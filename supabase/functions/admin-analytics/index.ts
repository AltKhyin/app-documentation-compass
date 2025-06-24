
// ABOUTME: Admin analytics Edge Function following mandatory 7-step pattern from DOC_5

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPrelight } from '../_shared/cors.ts';
import { checkAdminRateLimit } from '../_shared/rate-limit.ts';
import { authenticateRequest, requireRole } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  // STEP 1: Handle CORS preflight
  const corsResponse = handleCorsPrelight(req);
  if (corsResponse) return corsResponse;

  try {
    // STEP 2: Rate limiting (admin-specific)
    const rateLimitResult = await checkAdminRateLimit(req);
    if (!rateLimitResult.success) {
      return new Response(JSON.stringify({ 
        error: rateLimitResult.error || 'Rate limit exceeded',
        details: 'Too many admin requests'
      }), {
        status: 429,
        headers: { ...corsHeaders, ...rateLimitResult.headers, 'Content-Type': 'application/json' },
      });
    }

    // STEP 3: Authentication
    const authResult = await authenticateRequest(req);
    if (!authResult.success) {
      return new Response(JSON.stringify({ 
        error: authResult.error || 'Authentication failed',
        details: 'Invalid or missing authentication'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 4: Authorization (admin or editor only)
    const roleCheck = requireRole(authResult.user, ['admin', 'editor']);
    if (!roleCheck.success) {
      return new Response(JSON.stringify({ 
        error: roleCheck.error || 'Insufficient permissions',
        details: 'Admin or editor role required for analytics access'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 5: Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // STEP 6: Business Logic - Analytics data fetching
    console.log('Fetching analytics data for admin dashboard...');

    // Parse request parameters
    const url = new URL(req.url);
    const params = {
      timeframe: url.searchParams.get('timeframe') || '30d',
      metrics: url.searchParams.getAll('metrics') || ['overview']
    };

    console.log('Analytics request parameters:', params);

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
      try {
        const [userStats, contentStats, engagementStats] = await Promise.all([
          supabase.rpc('get_user_analytics'),
          supabase.rpc('get_content_analytics'),
          supabase.rpc('get_engagement_analytics')
        ]);

        analytics.overview = {
          users: userStats.data || {
            totalUsers: 0,
            activeToday: 0,
            newThisWeek: 0,
            premiumUsers: 0
          },
          content: contentStats.data || {
            totalReviews: 0,
            publishedReviews: 0,
            draftReviews: 0,
            totalPosts: 0
          },
          engagement: engagementStats.data || {
            totalViews: 0,
            totalVotes: 0,
            avgEngagement: 0,
            topContent: []
          }
        };
      } catch (error) {
        console.error('Error fetching overview analytics:', error);
        // Provide fallback data instead of failing completely
        analytics.overview = {
          users: { totalUsers: 0, activeToday: 0, newThisWeek: 0, premiumUsers: 0 },
          content: { totalReviews: 0, publishedReviews: 0, draftReviews: 0, totalPosts: 0 },
          engagement: { totalViews: 0, totalVotes: 0, avgEngagement: 0, topContent: [] }
        };
      }
    }

    // Fetch publication funnel metrics
    if (params.metrics.includes('publication_funnel')) {
      try {
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
        } else {
          analytics.publication_funnel = {};
        }
      } catch (error) {
        console.error('Error fetching publication funnel:', error);
        analytics.publication_funnel = {};
      }
    }

    // Fetch user activity metrics
    if (params.metrics.includes('user_activity')) {
      try {
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
        } else {
          analytics.user_activity = { daily_posts: {}, unique_authors: 0 };
        }
      } catch (error) {
        console.error('Error fetching user activity:', error);
        analytics.user_activity = { daily_posts: {}, unique_authors: 0 };
      }
    }

    const result = {
      timeframe: params.timeframe,
      generated_at: new Date().toISOString(),
      ...analytics
    };

    console.log('Analytics response prepared successfully:', {
      timeframe: result.timeframe,
      metricsIncluded: params.metrics,
      overviewKeys: analytics.overview ? Object.keys(analytics.overview) : []
    });

    // STEP 7: Return structured success response
    return new Response(JSON.stringify(result), {
      headers: { 
        ...corsHeaders, 
        ...rateLimitResult.headers,
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Admin analytics error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('authentication') ? 401 :
                      errorMessage.includes('permissions') ? 403 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Analytics fetch failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
