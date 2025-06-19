
// ABOUTME: Consolidated community page data endpoint combining feed and sidebar data into a single efficient request.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'
import { 
  createErrorResponse, 
  createSuccessResponse, 
  handleCorsPreflightRequest,
  RateLimitError 
} from '../_shared/api-helpers.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user ID for personalization and rate limiting
    const authHeader = req.headers.get('Authorization');
    let userId = '00000000-0000-0000-0000-000000000000'; // Default UUID for anonymous
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
      }
    }

    // Check rate limit (30 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'get-community-page-data', userId, 30, 60);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // Parse query parameters
    const { page = 0, limit = 20 } = await req.json().catch(() => ({}));
    const actualLimit = Math.min(limit, 50);
    const offset = page * actualLimit;

    console.log(`Fetching consolidated community page data: page=${page}, limit=${actualLimit}, user=${userId}`);

    // Fetch main feed posts using the optimized RPC
    const { data: posts, error: postsError } = await supabase.rpc('get_community_feed_with_details', {
      p_user_id: userId,
      p_limit: actualLimit,
      p_offset: offset,
    });
        
    if (postsError) {
      console.error('Community feed RPC error:', postsError);
      throw new Error(`Failed to fetch community posts: ${postsError.message}`);
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

    return createSuccessResponse(response, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    console.error('Community page data fetch error:', error);
    return createErrorResponse(error);
  }
});
