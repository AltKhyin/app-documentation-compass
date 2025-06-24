
// ABOUTME: Community page data Edge Function following mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPrelight } from '../_shared/cors.ts';
import { checkRateLimit } from '../_shared/rate-limit.ts';
import { authenticateRequest } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  // STEP 1: Handle CORS preflight
  const corsResponse = handleCorsPrelight(req);
  if (corsResponse) return corsResponse;

  try {
    // STEP 2: Rate limiting (community-specific - 40 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(req, { windowMs: 60000, maxRequests: 40 });
    if (!rateLimitResult.success) {
      return new Response(JSON.stringify({ 
        error: rateLimitResult.error || 'Rate limit exceeded',
        details: 'Too many community requests'
      }), {
        status: 429,
        headers: { ...corsHeaders, ...rateLimitResult.headers, 'Content-Type': 'application/json' },
      });
    }

    // STEP 3: Authentication (optional for community data)
    let userId = 'anonymous';
    
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const authResult = await authenticateRequest(req);
        if (authResult.success) {
          userId = authResult.user.id;
        }
      } catch (authError) {
        console.warn('Auth verification failed, continuing as anonymous:', authError);
      }
    }

    // STEP 4: Authorization (not required - public endpoint)
    // No authorization required for community page data

    // STEP 5: Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // STEP 6: Business Logic - Community page data fetching
    console.log(`Fetching community page data for user: ${userId}`);

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);

    // Fetch community posts using the optimized RPC
    const { data: posts, error: postsError } = await supabase.rpc('get_community_feed_with_details', {
      p_user_id: userId,
      p_limit: limit,
      p_offset: page * limit,
    });

    if (postsError) {
      console.error('Community posts RPC error:', postsError);
      throw new Error(`Failed to fetch community posts: ${postsError.message}`);
    }

    // Fetch trending discussions
    const { data: trendingPosts, error: trendingError } = await supabase
      .from('CommunityPosts')
      .select(`
        id,
        title,
        content,
        category,
        upvotes,
        downvotes,
        created_at,
        author:Practitioners!author_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .is('parent_post_id', null)
      .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
      .order('upvotes', { ascending: false })
      .limit(5);

    if (trendingError) {
      console.error('Trending posts error:', trendingError);
      // Don't fail the entire request for trending data
    }

    const response = {
      posts: posts || [],
      trending: trendingPosts || [],
      pagination: {
        page,
        limit,
        hasMore: (posts || []).length === limit
      }
    };

    console.log(`Successfully fetched ${(posts || []).length} posts and ${(trendingPosts || []).length} trending posts`);

    // STEP 7: Return structured success response
    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        ...rateLimitResult.headers,
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Community page data fetch error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('authentication') ? 401 :
                      errorMessage.includes('permissions') ? 403 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Community page data fetch failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
