
// ABOUTME: Admin Edge Function for analytics dashboard data following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse } from '../_shared/api-helpers.ts';
import { rateLimitCheck, rateLimitHeaders } from '../_shared/rate-limit.ts';

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
      return createErrorResponse(new Error('UNAUTHORIZED: Authorization header is required'));
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return createErrorResponse(new Error('UNAUTHORIZED: Invalid authentication token'));
    }
    
    // Verify admin/editor role for analytics access
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      return createErrorResponse(new Error('FORBIDDEN: Analytics access requires admin or editor role'));
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await rateLimitCheck(req, 'admin-analytics', 30, 60);
    if (!rateLimitResult.allowed) {
      return createErrorResponse(new Error('RATE_LIMIT_EXCEEDED: Rate limit exceeded'), rateLimitHeaders(rateLimitResult));
    }

    // STEP 4: Input Parsing & Validation
    const url = new URL(req.url);
    const params = {
      timeframe: url.searchParams.get('timeframe') || '30d',
      metrics: url.searchParams.getAll('metrics') || ['overview']
    };

    console.log('Analytics request:', params);

    // STEP 5: Core Business Logic Execution
    const result = await fetchAnalytics(supabase, params);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Analytics error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to fetch analytics data
async function fetchAnalytics(supabase: any, params: any) {
  try {
    const analytics: any = {};

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate: Date;
    
    switch (params.timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch overview metrics
    if (params.metrics.includes('overview')) {
      const [userStats, contentStats, engagementStats] = await Promise.all([
        supabase.rpc('get_user_analytics'),
        supabase.rpc('get_content_analytics'),
        supabase.rpc('get_engagement_analytics')
      ]);

      analytics.overview = {
        users: userStats.data || {},
        content: contentStats.data || {},
        engagement: engagementStats.data || {}
      };
    }

    // Fetch publication funnel metrics
    if (params.metrics.includes('publication_funnel')) {
      const { data: funnelData, error: funnelError } = await supabase
        .from('Reviews')
        .select('review_status, created_at')
        .gte('created_at', startDate.toISOString());

      if (!funnelError && funnelData) {
        const funnel = funnelData.reduce((acc: any, review: any) => {
          const status = review.review_status || 'draft';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        analytics.publication_funnel = funnel;
      }
    }

    // Fetch publication history trends
    if (params.metrics.includes('trends')) {
      const { data: historyData, error: historyError } = await supabase
        .from('Publication_History')
        .select('action, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (!historyError && historyData) {
        // Group by day and action type
        const trends = historyData.reduce((acc: any, item: any) => {
          const date = item.created_at.split('T')[0];
          if (!acc[date]) acc[date] = {};
          acc[date][item.action] = (acc[date][item.action] || 0) + 1;
          return acc;
        }, {});

        analytics.trends = trends;
      }
    }

    // Fetch user activity metrics
    if (params.metrics.includes('user_activity')) {
      const { data: activityData, error: activityError } = await supabase
        .from('CommunityPosts')
        .select('author_id, created_at')
        .gte('created_at', startDate.toISOString());

      if (!activityError && activityData) {
        const dailyActivity = activityData.reduce((acc: any, post: any) => {
          const date = post.created_at.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        analytics.user_activity = {
          daily_posts: dailyActivity,
          unique_authors: [...new Set(activityData.map((p: any) => p.author_id))].length
        };
      }
    }

    return {
      timeframe: params.timeframe,
      generated_at: new Date().toISOString(),
      ...analytics
    };

  } catch (error) {
    console.error('Error in fetchAnalytics:', error);
    throw error;
  }
}
