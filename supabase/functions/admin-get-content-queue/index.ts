
// ABOUTME: Admin Edge Function for content queue management following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse } from '../_shared/api-helpers.ts';
import { rateLimitCheck, rateLimitHeaders } from '../_shared/rate-limit.ts';

Deno.serve(async (req) => {
  // STEP 1: CORS Preflight Handling (MANDATORY FIRST)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // STEP 2: Manual Authentication (requires verify_jwt = false in config.toml)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('UNAUTHORIZED: Authorization header is required');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('UNAUTHORIZED: Invalid authentication token');
    }
    
    // Verify admin/editor role using the existing database function
    const { data: hasAdminRole, error: adminRoleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'admin' 
      });
    
    const { data: hasEditorRole, error: editorRoleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'editor' 
      });

    if (adminRoleError || editorRoleError || (!hasAdminRole && !hasEditorRole)) {
      throw new Error('FORBIDDEN: Content queue access requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await rateLimitCheck(req, 'admin-get-content-queue', 30, 60);
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

    // STEP 4: Input Parsing & Validation
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const status = url.searchParams.get('status') || undefined;

    console.log('Content queue request:', { page, limit, status });

    // STEP 5: Core Business Logic Execution
    const result = await handleGetContentQueue(supabase, { page, limit, status });

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Content queue error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to get content queue with filtering and pagination
async function handleGetContentQueue(supabase: any, filters: any) {
  // Get pending community posts
  let postsQuery = supabase
    .from('CommunityPosts')
    .select(`
      id,
      title,
      content,
      category,
      created_at,
      upvotes,
      downvotes,
      author_id,
      is_pinned,
      is_locked
    `);

  // Apply status filtering if needed (for future moderation features)
  if (filters.status === 'reported') {
    // Future: filter by reported content
  }

  // Apply pagination
  const offset = (filters.page - 1) * filters.limit;
  postsQuery = postsQuery
    .range(offset, offset + filters.limit - 1)
    .order('created_at', { ascending: false });

  const { data: posts, error: postsError } = await postsQuery;
  
  if (postsError) {
    console.error('Error fetching content queue:', postsError);
    throw new Error(`Failed to fetch content queue: ${postsError.message}`);
  }

  // Get pending reviews
  let reviewsQuery = supabase
    .from('Reviews')
    .select(`
      id,
      source_article_title,
      source_article_citation,
      status,
      created_at,
      access_level
    `)
    .eq('status', 'draft');

  const { data: reviews, error: reviewsError } = await reviewsQuery;
  
  if (reviewsError) {
    console.error('Error fetching pending reviews:', reviewsError);
  }

  // Get total counts
  const { count: totalPosts } = await supabase
    .from('CommunityPosts')
    .select('*', { count: 'exact', head: true });

  const { count: totalReviews } = await supabase
    .from('Reviews')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  return {
    posts: posts || [],
    reviews: reviews || [],
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: totalPosts || 0,
      hasMore: (totalPosts || 0) > offset + filters.limit
    },
    stats: {
      totalPosts: totalPosts || 0,
      pendingReviews: totalReviews || 0
    }
  };
}
