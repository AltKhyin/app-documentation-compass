
// ABOUTME: User analytics Edge Function for admin dashboard user insights following the mandatory 7-step pattern

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
    
    // Verify admin role for user analytics access
    const userRole = user.app_metadata?.role;
    if (!userRole || userRole !== 'admin') {
      throw new Error('FORBIDDEN: User analytics access requires admin role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-user-analytics', 60, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const url = new URL(req.url);
    const timeRange = url.searchParams.get('timeRange') || '30d';
    const includeDetails = url.searchParams.get('includeDetails') === 'true';
    
    console.log('User analytics request:', { timeRange, includeDetails });

    // STEP 5: Core Business Logic Execution
    const result = await fetchUserAnalytics(supabase, timeRange, includeDetails);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('User analytics error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to fetch user analytics data
async function fetchUserAnalytics(supabase: any, timeRange: string, includeDetails: boolean) {
  try {
    // Calculate date range
    const days = parseInt(timeRange.replace('d', '')) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch user stats from the database function
    const { data: userStats } = await supabase.rpc('get_user_analytics');

    // Fetch user registration trends
    const { data: registrationTrends, error: trendsError } = await supabase
      .from('Practitioners')
      .select(`
        created_at,
        role,
        subscription_tier
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (trendsError) {
      console.error('Error fetching registration trends:', trendsError);
    }

    // Calculate daily registration counts
    const dailyRegistrations = (registrationTrends || []).reduce((acc: any, user: any) => {
      const date = new Date(user.created_at).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Fetch user activity metrics
    const { data: recentActivity, error: activityError } = await supabase
      .from('CommunityPosts')
      .select(`
        author_id,
        created_at,
        Practitioners!author_id(
          full_name,
          role,
          subscription_tier,
          contribution_score
        )
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (activityError) {
      console.error('Error fetching recent activity:', activityError);
    }

    // Calculate user engagement metrics
    const activeUserIds = new Set((recentActivity || []).map((post: any) => post.author_id));
    const engagementByRole = (recentActivity || []).reduce((acc: any, post: any) => {
      const role = post.Practitioners?.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    // Fetch subscription distribution
    const { data: subscriptionData, error: subError } = await supabase
      .from('Practitioners')
      .select('subscription_tier')
      .gte('created_at', startDate.toISOString());

    if (subError) {
      console.error('Error fetching subscription data:', subError);
    }

    const subscriptionDistribution = (subscriptionData || []).reduce((acc: any, user: any) => {
      acc[user.subscription_tier] = (acc[user.subscription_tier] || 0) + 1;
      return acc;
    }, {});

    // Fetch top contributors if details requested
    let topContributors = null;
    if (includeDetails) {
      const { data: contributors, error: contributorsError } = await supabase
        .from('Practitioners')
        .select(`
          id,
          full_name,
          role,
          subscription_tier,
          contribution_score,
          created_at
        `)
        .order('contribution_score', { ascending: false })
        .limit(20);

      if (contributorsError) {
        console.error('Error fetching top contributors:', contributorsError);
      } else {
        topContributors = contributors;
      }
    }

    return {
      summary: userStats || {
        totalUsers: 0,
        activeToday: 0,
        newThisWeek: 0,
        premiumUsers: 0
      },
      trends: {
        dailyRegistrations: Object.entries(dailyRegistrations).map(([date, count]) => ({
          date,
          count
        })),
        totalInPeriod: (registrationTrends || []).length
      },
      engagement: {
        activeUsers: activeUserIds.size,
        activityByRole: engagementByRole,
        totalPosts: (recentActivity || []).length
      },
      subscriptions: subscriptionDistribution,
      topContributors,
      timeRange,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in fetchUserAnalytics:', error);
    throw error;
  }
}
