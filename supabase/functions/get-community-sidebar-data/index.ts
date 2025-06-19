
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Check rate limit (60 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'get-community-sidebar-data', userId, 60, 60);
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

    // Static community rules
    const rules = [
      "Debata ideias, não pessoas.",
      "Mantenha sigilo clínico.",
      "Evite assuntos políticos e não-científicos.",
      "Ver todas (4)"
    ];

    // Static useful links
    const links = [
      {
        title: "Interpretando Evidência",
        url: "https://interpretandoevidencia.com",
        description: "Curso oficial da plataforma"
      },
      {
        title: "Journals: Acervo de Revistas",
        url: "/acervo",
        description: "Biblioteca de publicações científicas"
      }
    ];

    // Get featured poll
    let featuredPoll = null;
    const { data: pollData } = await supabase
      .from('Polls')
      .select(`
        id,
        question,
        expires_at,
        total_votes,
        PollOptions:PollOptions(
          id,
          option_text,
          vote_count
        )
      `)
      .eq('is_featured', true)
      .single();

    if (pollData) {
      // Get user's vote if authenticated
      let userVote = null;
      if (userId !== 'anonymous') {
        const { data: voteData } = await supabase
          .from('PollVotes')
          .select('option_id')
          .eq('poll_id', pollData.id)
          .eq('practitioner_id', userId)
          .maybeSingle();
        
        userVote = voteData?.option_id || null;
      }

      featuredPoll = {
        id: pollData.id,
        question: pollData.question,
        expires_at: pollData.expires_at,
        total_votes: pollData.total_votes,
        user_vote: userVote,
        options: pollData.PollOptions.map((opt: any) => ({
          id: opt.id,
          text: opt.option_text,
          vote_count: opt.vote_count
        }))
      };
    }

    // Get trending discussions (top 5 by engagement in last 48 hours)
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    
    const { data: trendingData } = await supabase
      .from('CommunityPosts')
      .select(`
        id,
        title,
        content,
        category,
        upvotes,
        is_pinned,
        flair_text,
        author:Practitioners!author_id(
          full_name
        )
      `)
      .is('parent_post_id', null)
      .gte('created_at', twoDaysAgo)
      .order('upvotes', { ascending: false })
      .limit(5);

    // Add reply counts to trending discussions
    const trendingDiscussions = await Promise.all(
      (trendingData || []).map(async (post) => {
        const { count: replyCount } = await supabase
          .from('CommunityPosts')
          .select('id', { count: 'exact' })
          .eq('parent_post_id', post.id);

        return {
          ...post,
          reply_count: replyCount || 0
        };
      })
    );

    // Get community statistics
    const { data: statsData } = await supabase
      .from('CommunityStats')
      .select('stat_key, stat_value')
      .in('stat_key', ['total_discussions', 'today_posts', 'active_users_24h']);

    const stats = statsData?.reduce((acc: any, stat) => {
      acc[stat.stat_key] = stat.stat_value.count || 0;
      return acc;
    }, {}) || {};

    const recentActivity = {
      onlineUsers: stats.active_users_24h || 0,
      todayPosts: stats.today_posts || 0,
      totalDiscussions: stats.total_discussions || 0
    };

    console.log('Community sidebar data fetched successfully');

    return new Response(JSON.stringify({
      rules,
      links,
      featuredPoll,
      trendingDiscussions,
      recentActivity
    }), {
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
