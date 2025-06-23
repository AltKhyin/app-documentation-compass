
// ABOUTME: Admin Edge Function for content queue management following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  authenticateUser,
  handleCorsPreflightRequest,
  RateLimitError
} from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

Deno.serve(async (req) => {
  // STEP 1: CORS Preflight Handling (MANDATORY FIRST)
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
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

    const user = await authenticateUser(supabase, authHeader);
    
    // Verify admin/editor role using JWT claims
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      throw new Error('FORBIDDEN: Content queue access requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-get-content-queue', 30, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const body = await req.json().catch(() => ({}));
    const page = Math.max(1, body.page || 1);
    const limit = Math.min(Math.max(1, body.limit || 20), 100);
    const status = body.status || 'all';
    const search = body.search || '';
    const authorId = body.authorId;
    const reviewerId = body.reviewerId;

    console.log('Content queue request:', { page, limit, status, search, userRole });

    // STEP 5: Core Business Logic Execution
    const result = await handleGetContentQueue(supabase, { 
      page, 
      limit, 
      status, 
      search, 
      authorId, 
      reviewerId 
    });

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
  try {
    // Get reviews with publication workflow data
    let reviewsQuery = supabase
      .from('Reviews')
      .select(`
        id,
        title,
        description,
        review_status,
        status,
        created_at,
        published_at,
        scheduled_publish_at,
        review_requested_at,
        reviewed_at,
        access_level,
        author_id,
        reviewer_id,
        publication_notes
      `);

    // Apply status filtering
    if (filters.status !== 'all') {
      if (filters.status === 'under_review') {
        reviewsQuery = reviewsQuery.eq('review_status', 'under_review');
      } else if (filters.status === 'scheduled') {
        reviewsQuery = reviewsQuery.eq('review_status', 'scheduled');
      } else if (filters.status === 'published') {
        reviewsQuery = reviewsQuery.eq('status', 'published');
      } else if (filters.status === 'draft') {
        reviewsQuery = reviewsQuery.eq('status', 'draft');
      }
    }

    // Apply search filtering
    if (filters.search) {
      reviewsQuery = reviewsQuery.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply author filtering
    if (filters.authorId) {
      reviewsQuery = reviewsQuery.eq('author_id', filters.authorId);
    }

    // Apply reviewer filtering
    if (filters.reviewerId) {
      reviewsQuery = reviewsQuery.eq('reviewer_id', filters.reviewerId);
    }

    // Apply pagination
    const offset = (filters.page - 1) * filters.limit;
    reviewsQuery = reviewsQuery
      .range(offset, offset + filters.limit - 1)
      .order('created_at', { ascending: false });

    const { data: reviews, error: reviewsError } = await reviewsQuery;
    
    if (reviewsError) {
      console.error('Error fetching content queue:', reviewsError);
      throw new Error(`Failed to fetch content queue: ${reviewsError.message}`);
    }

    // Get community posts with similar filtering
    const { data: posts, error: postsError } = await supabase
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
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (postsError) {
      console.error('Error fetching community posts:', postsError);
    }

    // Get total counts for pagination
    const { count: totalReviews } = await supabase
      .from('Reviews')
      .select('*', { count: 'exact', head: true });

    const { count: totalPosts } = await supabase
      .from('CommunityPosts')
      .select('*', { count: 'exact', head: true });

    return {
      reviews: reviews || [],
      posts: posts || [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: totalReviews || 0,
        hasMore: (totalReviews || 0) > offset + filters.limit
      },
      stats: {
        totalReviews: totalReviews || 0,
        totalPosts: totalPosts || 0
      }
    };

  } catch (error) {
    console.error('Error in handleGetContentQueue:', error);
    throw error;
  }
}
