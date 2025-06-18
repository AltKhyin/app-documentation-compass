
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SidebarData {
  rules: string[];
  links: Array<{ title: string; url: string; description?: string }>;
  featuredPoll: {
    id: number;
    question: string;
    options: Array<{ id: number; text: string; vote_count: number }>;
    total_votes: number;
    expires_at: string | null;
    user_vote: number | null;
  } | null;
  trendingDiscussions: Array<{
    id: number;
    title: string | null;
    content: string;
    category: string;
    upvotes: number;
    reply_count: number;
    author: {
      full_name: string | null;
    } | null;
  }>;
  recentActivity: {
    onlineUsers: number;
    todayPosts: number;
    totalDiscussions: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user for rate limiting and personalization
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
      }
    }

    // Check rate limit (20 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'get-community-sidebar-data', userId, 20, 60);
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: { message: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED' }
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...rateLimitHeaders(rateLimitResult)
        }
      });
    }

    console.log('Fetching community sidebar data');

    // Fetch all sidebar data in parallel
    const [
      settingsResult,
      featuredPollResult,
      trendingResult,
      activityResult
    ] = await Promise.allSettled([
      // Get community settings (rules, links, etc.)
      supabase
        .from('SiteSettings')
        .select('value')
        .eq('key', 'community_sidebar_settings')
        .maybeSingle(),
      
      // Get featured poll
      supabase
        .from('Polls')
        .select(`
          id,
          question,
          expires_at,
          total_votes,
          options:PollOptions(
            id,
            option_text,
            vote_count
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      
      // Get trending discussions via function call
      supabase.functions.invoke('get-trending-discussions'),
      
      // Get activity stats
      Promise.all([
        // Total discussions count
        supabase
          .from('CommunityPosts')
          .select('id', { count: 'exact' })
          .is('parent_post_id', null),
        
        // Today's posts count
        supabase
          .from('CommunityPosts')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date().toISOString().split('T')[0])
      ])
    ]);

    // Process settings data
    let rules: string[] = [];
    let links: Array<{ title: string; url: string; description?: string }> = [];
    
    if (settingsResult.status === 'fulfilled' && settingsResult.value.data) {
      const settings = settingsResult.value.data.value;
      rules = settings?.rules || [
        'Mantenha discussões respeitosas e construtivas',
        'Foque em evidências científicas',
        'Evite spam e autopromoção excessiva',
        'Use categorias apropriadas para seus posts',
        'Cite fontes quando relevante'
      ];
      links = settings?.links || [
        { title: 'Interpretando Evidência', url: '#', description: 'Curso sobre análise crítica' },
        { title: 'Journals: Acervo de Revistas', url: '#', description: 'Base de dados científica' }
      ];
    } else {
      // Default values
      rules = [
        'Mantenha discussões respeitosas e construtivas',
        'Foque em evidências científicas',
        'Evite spam e autopromoção excessiva',
        'Use categorias apropriadas para seus posts',
        'Cite fontes quando relevante'
      ];
      links = [
        { title: 'Interpretando Evidência', url: '#', description: 'Curso sobre análise crítica' },
        { title: 'Journals: Acervo de Revistas', url: '#', description: 'Base de dados científica' }
      ];
    }

    // Process featured poll
    let featuredPoll = null;
    if (featuredPollResult.status === 'fulfilled' && featuredPollResult.value.data) {
      const poll = featuredPollResult.value.data;
      
      // Get user's vote if authenticated
      let userVote = null;
      if (userId !== 'anonymous') {
        const { data: voteData } = await supabase
          .from('PollVotes')
          .select('option_id')
          .eq('poll_id', poll.id)
          .eq('practitioner_id', userId)
          .maybeSingle();
        
        userVote = voteData?.option_id || null;
      }

      featuredPoll = {
        id: poll.id,
        question: poll.question,
        options: poll.options.map((opt: any) => ({
          id: opt.id,
          text: opt.option_text,
          vote_count: opt.vote_count
        })),
        total_votes: poll.total_votes,
        expires_at: poll.expires_at,
        user_vote: userVote
      };
    }

    // Process trending discussions - FIX: Don't call .json() on Supabase function response
    let trendingDiscussions: any[] = [];
    if (trendingResult.status === 'fulfilled' && trendingResult.value.data) {
      // The data is already parsed JSON from Supabase functions.invoke()
      const trendingData = trendingResult.value.data;
      trendingDiscussions = trendingData.posts?.slice(0, 3).map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
        category: post.category,
        upvotes: post.upvotes,
        reply_count: post.reply_count,
        author: post.author
      })) || [];
    }

    // Process activity stats
    let recentActivity = {
      onlineUsers: 0, // This would require real-time presence tracking
      todayPosts: 0,
      totalDiscussions: 0
    };

    if (activityResult.status === 'fulfilled') {
      const [totalResult, todayResult] = activityResult.value;
      recentActivity = {
        onlineUsers: 0, // Placeholder - would need presence system
        todayPosts: todayResult.count || 0,
        totalDiscussions: totalResult.count || 0
      };
    }

    const sidebarData: SidebarData = {
      rules,
      links,
      featuredPoll,
      trendingDiscussions,
      recentActivity
    };

    console.log('Successfully fetched community sidebar data');

    return new Response(JSON.stringify(sidebarData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Community sidebar data fetch error:', error);
    
    return new Response(JSON.stringify({
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
