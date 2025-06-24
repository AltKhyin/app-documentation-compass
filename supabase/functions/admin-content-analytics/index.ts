
// ABOUTME: Content analytics Edge Function for admin dashboard data following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
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
    
    const user = await authenticateUser(supabase, req.headers.get('Authorization'));
    
    // Verify admin/editor role using JWT claims
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      throw new Error('FORBIDDEN: Content analytics access requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-content-analytics', 60, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const url = new URL(req.url);
    const timeRange = url.searchParams.get('timeRange') || '30d';
    
    console.log('Content analytics request:', { timeRange, userRole });

    // STEP 5: Core Business Logic Execution
    const result = await fetchContentAnalytics(supabase, timeRange);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Content analytics error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to fetch content analytics data
async function fetchContentAnalytics(supabase: any, timeRange: string) {
  try {
    // Calculate date range
    const days = parseInt(timeRange.replace('d', '')) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch content stats
    const { data: contentStats } = await supabase.rpc('get_content_analytics');
    
    // Fetch recent content activity
    const { data: recentActivity, error: activityError } = await supabase
      .from('Reviews')
      .select(`
        id,
        title,
        status,
        created_at,
        published_at,
        view_count,
        Practitioners!author_id(full_name)
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    if (activityError) {
      console.error('Error fetching recent activity:', activityError);
    }

    // Fetch status distribution
    const { data: statusDistribution, error: statusError } = await supabase
      .from('Reviews')
      .select('status')
      .gte('created_at', startDate.toISOString());

    if (statusError) {
      console.error('Error fetching status distribution:', statusError);
    }

    // Calculate status counts
    const statusCounts = (statusDistribution || []).reduce((acc: any, review: any) => {
      acc[review.status] = (acc[review.status] || 0) + 1;
      return acc;
    }, {});

    // Fetch top performing content
    const { data: topContent, error: topError } = await supabase
      .from('Reviews')
      .select(`
        id,
        title,
        view_count,
        status,
        published_at,
        Practitioners!author_id(full_name)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10);

    if (topError) {
      console.error('Error fetching top content:', topError);
    }

    return {
      summary: contentStats || {
        totalReviews: 0,
        publishedReviews: 0,
        draftReviews: 0,
        totalPosts: 0
      },
      recentActivity: recentActivity || [],
      statusDistribution: statusCounts,
      topPerforming: topContent || [],
      timeRange,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in fetchContentAnalytics:', error);
    throw error;
  }
}
