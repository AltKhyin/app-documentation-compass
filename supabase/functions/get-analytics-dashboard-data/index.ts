
// ABOUTME: Analytics dashboard Edge Function using simplified pattern that works in production

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Set the auth header for this request
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check if user has admin or editor role
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      throw new Error('Insufficient permissions: Admin or editor role required');
    }

    // Parse request parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    
    console.log('Fetching analytics dashboard data...', { startDate, endDate });

    // Fetch analytics data using the RPC functions we have
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

    console.log('Analytics dashboard response:', {
      userStatsKeys: Object.keys(analyticsData.userStats),
      contentStatsKeys: Object.keys(analyticsData.contentStats),
      engagementStatsKeys: Object.keys(analyticsData.engagementStats)
    });

    return new Response(JSON.stringify(analyticsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('authentication') ? 401 :
                      errorMessage.includes('permissions') ? 403 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Analytics dashboard fetch failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
