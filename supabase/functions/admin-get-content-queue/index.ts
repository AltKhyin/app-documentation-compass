
// ABOUTME: Admin Edge Function to fetch paginated content queue with filtering and summary statistics

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { rateLimitCheck } from '../_shared/rate-limit.ts'
import { sendSuccess, sendError } from '../_shared/api-helpers.ts'

interface ContentQueueParams {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  author_id?: string;
}

interface ReviewQueueItem {
  id: number;
  title: string;
  description: string;
  review_status: string;
  created_at: string;
  review_requested_at: string | null;
  reviewed_at: string | null;
  scheduled_publish_at: string | null;
  publication_notes: string | null;
  author: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Step 1: Rate limiting check (30 requests per 60 seconds)
    const rateLimitResult = await rateLimitCheck(req, 'admin-get-content-queue', 30, 60);
    if (!rateLimitResult.allowed) {
      return sendError('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', 429);
    }

    // Step 2: Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Step 3: Verify user authentication and authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return sendError('UNAUTHORIZED', 'Authorization header is required', 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return sendError('UNAUTHORIZED', 'Invalid authentication token', 401);
    }

    // Step 4: Verify admin/editor role
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      return sendError('FORBIDDEN', 'Admin or editor role required', 403);
    }

    // Step 5: Parse request parameters
    const url = new URL(req.url);
    const params: ContentQueueParams = {
      status: url.searchParams.get('status') || undefined,
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: Math.min(parseInt(url.searchParams.get('limit') || '20'), 50), // Cap at 50
      search: url.searchParams.get('search') || undefined,
      author_id: url.searchParams.get('author_id') || undefined,
    };

    // Step 6: Build query with filters
    let query = supabase
      .from('Reviews')
      .select(`
        id,
        title,
        description,
        review_status,
        created_at,
        review_requested_at,
        reviewed_at,
        scheduled_publish_at,
        publication_notes,
        author:author_id (
          id,
          full_name,
          avatar_url
        ),
        reviewer:reviewer_id (
          id,
          full_name,
          avatar_url
        )
      `, { count: 'exact' });

    // Apply filters
    if (params.status && params.status !== 'all') {
      query = query.eq('review_status', params.status);
    }

    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params.author_id) {
      query = query.eq('author_id', params.author_id);
    }

    // Apply pagination
    const offset = (params.page - 1) * params.limit;
    const { data: reviews, error: reviewsError, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + params.limit - 1);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return sendError('DATABASE_ERROR', 'Failed to fetch content queue', 500);
    }

    // Step 7: Get summary statistics
    const { data: summaryStats, error: summaryError } = await supabase
      .from('Reviews')
      .select('review_status')
      .not('review_status', 'is', null);

    if (summaryError) {
      console.error('Error fetching summary stats:', summaryError);
      return sendError('DATABASE_ERROR', 'Failed to fetch summary statistics', 500);
    }

    const summary = summaryStats?.reduce((acc: Record<string, number>, review) => {
      acc[review.review_status] = (acc[review.review_status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get recent publication history
    const { data: recentHistory, error: historyError } = await supabase
      .from('Publication_History')
      .select(`
        id,
        action,
        notes,
        created_at,
        review:review_id (
          id,
          title
        ),
        performer:performed_by (
          id,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) {
      console.error('Error fetching recent history:', historyError);
    }

    const totalPages = Math.ceil((count || 0) / params.limit);

    return sendSuccess({
      reviews: reviews as ReviewQueueItem[],
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages,
        hasMore: params.page < totalPages
      },
      summary: {
        draft: summary.draft || 0,
        under_review: summary.under_review || 0,
        scheduled: summary.scheduled || 0,
        published: summary.published || 0,
        archived: summary.archived || 0
      },
      recentHistory: recentHistory || []
    });

  } catch (error) {
    console.error('Unexpected error in admin-get-content-queue:', error);
    return sendError('INTERNAL_ERROR', 'An unexpected error occurred', 500);
  }
});
