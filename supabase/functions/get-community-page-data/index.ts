
// ABOUTME: Consolidated community page data endpoint combining feed and sidebar data into a single efficient request.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

// CORS headers as mandated by [DOC_5] PRINCIPLE 5 - Complete CORS implementation
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests FIRST - [DOC_5] PRINCIPLE 5 compliance
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    });
  }

  // Only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  try {
    console.log('Starting community page data fetch...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user ID for personalization and rate limiting
    const authHeader = req.headers.get('Authorization');
    let userId = '00000000-0000-0000-0000-000000000000'; // Default UUID for anonymous
    
    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        if (user) {
          userId = user.id;
          console.log(`Authenticated user: ${userId}`);
        }
      } catch (authError) {
        console.warn('Auth verification failed, continuing as anonymous:', authError);
      }
    }

    // Check rate limit (30 requests per 60 seconds) - [DOC_5] PRINCIPLE 6 compliance
    const rateLimitResult = await checkRateLimit(supabase, 'get-community-page-data', userId);
    if (!rateLimitResult.allowed) {
      console.log('Rate limit exceeded for user:', userId);
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

    // Parse request body safely
    let requestBody = {};
    try {
      const bodyText = await req.text();
      if (bodyText) {
        requestBody = JSON.parse(bodyText);
      }
    } catch (parseError) {
      console.warn('Failed to parse request body, using defaults:', parseError);
    }

    const { page = 0, limit = 20 } = requestBody;
    const actualLimit = Math.min(limit, 50);
    const offset = page * actualLimit;

    console.log(`Fetching community page data: page=${page}, limit=${actualLimit}, user=${userId}`);

    // Fetch main feed posts using the optimized RPC
    const { data: posts, error: postsError } = await supabase.rpc('get_community_feed_with_details', {
      p_user_id: userId,
      p_limit: actualLimit,
      p_offset: offset,
    });
        
    if (postsError) {
      console.error('Community feed RPC error:', postsError);
      return new Response(JSON.stringify({
        error: { message: `Failed to fetch community posts: ${postsError.message}`, code: 'DATABASE_ERROR' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    console.log(`Successfully fetched ${(posts || []).length} community posts via RPC`);

    // Derive trending discussions from the already-fetched posts (server-side optimization)
    const trendingDiscussions = (posts || [])
      .filter(post => post.created_at && new Date(post.created_at) > new Date(Date.now() - 48 * 60 * 60 * 1000)) // Last 48 hours
      .sort((a, b) => {
        // Engagement score: (New Votes * 2) + (New Comments)
        const scoreA = ((a.upvotes || 0) + (a.downvotes || 0)) * 2 + (a.reply_count || 0);
        const scoreB = ((b.upvotes || 0) + (b.downvotes || 0)) * 2 + (b.reply_count || 0);
        return scoreB - scoreA;
      })
      .slice(0, 5) // Top 5 trending
      .map(post => ({
        id: post.id,
        title: post.title || 'Untitled Post',
        content: post.content || '',
        category: post.category || 'general',
        reply_count: post.reply_count || 0,
        upvotes: post.upvotes || 0,
        created_at: post.created_at,
        author: post.author || null,
        flair_text: post.flair_text || undefined,
        is_pinned: post.is_pinned || false
      }));

    // Fetch sidebar configuration from site settings
    const { data: sidebarSettings, error: settingsError } = await supabase
      .from('SiteSettings')
      .select('value')
      .eq('key', 'community_sidebar_settings')
      .single();

    let sidebarConfig = {
      rules: [
        'Seja respeitoso com outros membros',
        'Mantenha discussões relevantes ao tema',
        'Não faça spam ou autopromoção',
        'Use linguagem apropriada'
      ],
      links: [
        { title: 'Guia da Comunidade', url: '/community/about' },
        { title: 'FAQ', url: '/faq' }
      ],
      featuredPollId: null
    };

    if (!settingsError && sidebarSettings?.value) {
      try {
        sidebarConfig = { ...sidebarConfig, ...JSON.parse(JSON.stringify(sidebarSettings.value)) };
      } catch (e) {
        console.warn('Failed to parse sidebar settings, using defaults');
      }
    }

    // Fetch featured poll if configured
    let featuredPoll = null;
    if (sidebarConfig.featuredPollId) {
      const { data: poll } = await supabase
        .from('Polls')
        .select(`
          id,
          question,
          total_votes,
          PollOptions (
            id,
            option_text,
            vote_count
          )
        `)
        .eq('id', sidebarConfig.featuredPollId)
        .single();
      
      featuredPoll = poll;
    }

    // Fetch recent activity for sidebar
    const { data: recentActivity } = await supabase
      .from('CommunityPosts')
      .select(`
        id,
        title,
        created_at,
        Practitioners!author_id (
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(3);

    // Construct consolidated response
    const response = {
      posts: posts || [],
      pagination: {
        page,
        limit: actualLimit,
        hasMore: (posts || []).length === actualLimit
      },
      sidebarData: {
        rules: sidebarConfig.rules,
        links: sidebarConfig.links,
        trendingDiscussions,
        featuredPoll,
        recentActivity: recentActivity || []
      }
    };

    console.log('Successfully prepared consolidated community page data');

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Community page data fetch error:', error);
    return new Response(JSON.stringify({
      error: { message: error.message || 'Internal server error', code: 'INTERNAL_ERROR' }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
