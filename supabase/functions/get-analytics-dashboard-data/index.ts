
// ABOUTME: Edge Function to fetch consolidated analytics dashboard data per Blueprint 09

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse, authenticateUser } from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

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
    
    const user = await authenticateUser(supabase, req.headers.get('Authorization'));
    
    // Verify admin role for analytics access
    const userRole = user.app_metadata?.role || 'practitioner';
    if (userRole !== 'admin' && userRole !== 'editor') {
      throw new Error('FORBIDDEN: Analytics access requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(supabase, 'get-analytics-dashboard-data', user.id);
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
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    
    console.log('Fetching analytics dashboard data...', { startDate, endDate });

    // STEP 5: Core Business Logic Execution
    // Fetch analytics data using the RPC functions we just created
    const [userStatsResult, contentStatsResult, engagementStatsResult] = await Promise.all([
      supabase.rpc('get_user_analytics'),
      supabase.rpc('get_content_analytics'),
      supabase.rpc('get_engagement_analytics')
    ]);

    if (userStatsResult.error) {
      console.error('Error fetching user analytics:', userStatsResult.error);
      throw new Error(`User analytics error: ${userStatsResult.error.message}`);
    }

    if (contentStatsResult.error) {
      console.error('Error fetching content analytics:', contentStatsResult.error);
      throw new Error(`Content analytics error: ${contentStatsResult.error.message}`);
    }

    if (engagementStatsResult.error) {
      console.error('Error fetching engagement analytics:', engagementStatsResult.error);
      throw new Error(`Engagement analytics error: ${engagementStatsResult.error.message}`);
    }

    // System stats (mock data as specified in Blueprint)
    const systemStats = {
      dbSize: '2.4 GB',
      apiCalls: 15420,
      errorRate: 0.02,
      uptime: '99.9%'
    };

    const analyticsData = {
      userStats: userStatsResult.data || {
        totalUsers: 0,
        activeToday: 0,
        newThisWeek: 0,
        premiumUsers: 0
      },
      contentStats: contentStatsResult.data || {
        totalReviews: 0,
        publishedReviews: 0,
        draftReviews: 0,
        totalPosts: 0
      },
      engagementStats: engagementStatsResult.data || {
        totalViews: 0,
        totalVotes: 0,
        avgEngagement: 0,
        topContent: []
      },
      systemStats
    };

    // STEP 6: Standardized Success Response
    return createSuccessResponse(analyticsData, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Analytics dashboard error:', error);
    return createErrorResponse(error);
  }
});
