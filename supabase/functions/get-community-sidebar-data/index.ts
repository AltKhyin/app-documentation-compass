
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
    flair_text?: string;
    is_pinned?: boolean;
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
      statsResult
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
      
      // Get trending discussions with enhanced data
      supabase
        .from('CommunityPosts')
        .select(`
          id,
          title,
          content,
          category,
          upvotes,
          flair_text,
          is_pinned,
          created_at,
          author:Practitioners!author_id(
            full_name
          )
        `)
        .is('parent_post_id', null)
        .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()) // Last 48 hours
        .order('upvotes', { ascending: false })
        .limit(5),
      
      // Get community stats from the new table
      supabase
        .from('CommunityStats')
        .select('stat_key, stat_value')
        .in('stat_key', ['total_discussions', 'today_posts', 'active_users_24h'])
    ]);

    // Process settings data with enhanced defaults
    let rules: string[] = [];
    let links: Array<{ title: string; url: string; description?: string }> = [];
    
    if (settingsResult.status === 'fulfilled' && settingsResult.value.data) {
      const settings = settingsResult.value.data.value;
      rules = settings?.rules || [];
      links = settings?.links || [];
    }
    
    // Default rules and links if none configured
    if (rules.length === 0) {
      rules = [
        'Mantenha discussões respeitosas e construtivas',
        'Foque em evidências científicas',
        'Evite spam e autopromoção excessiva', 
        'Use categorias apropriadas para seus posts',
        'Cite fontes quando relevante'
      ];
    }
    
    if (links.length === 0) {
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

    // Process trending discussions with reply counts
    let trendingDiscussions: any[] = [];
    if (trendingResult.status === 'fulfilled' && trendingResult.value.data) {
      const posts = trendingResult.value.data;
      
      // Get reply counts for each post
      trendingDiscussions = await Promise.all(
        posts.map(async (post: any) => {
          const { count: replyCount } = await supabase
            .from('CommunityPosts')
            .select('id', { count: 'exact' })
            .eq('parent_post_id', post.id);

          return {
            id: post.id,
            title: post.title,
            content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
            category: post.category,
            upvotes: post.upvotes,
            reply_count: replyCount || 0,
            author: post.author,
            flair_text: post.flair_text,
            is_pinned: post.is_pinned
          };
        })
      );
    }

    // Process activity stats from new CommunityStats table
    let recentActivity = {
      onlineUsers: 0, // This would require real-time presence tracking
      todayPosts: 0,
      totalDiscussions: 0
    };

    if (statsResult.status === 'fulfilled' && statsResult.value.data) {
      const stats = statsResult.value.data;
      const statsMap = stats.reduce((acc: any, stat: any) => {
        acc[stat.stat_key] = stat.stat_value.count;
        return acc;
      }, {});

      recentActivity = {
        onlineUsers: statsMap.active_users_24h || 0,
        todayPosts: statsMap.today_posts || 0,
        totalDiscussions: statsMap.total_discussions || 0
      };
    }

    const sidebarData: SidebarData = {
      rules,
      links,
      featuredPoll,
      trendingDiscussions,
      recentActivity
    };

    console.log('Successfully fetched enhanced community sidebar data');

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
