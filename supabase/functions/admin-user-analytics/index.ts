
// ABOUTME: Advanced user analytics Edge Function for comprehensive user insights and reporting

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse, authenticateUser } from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface AnalyticsQuery {
  type: 'growth' | 'engagement' | 'roles' | 'activity' | 'geographic' | 'comprehensive';
  startDate?: string;
  endDate?: string;
  granularity?: 'daily' | 'weekly' | 'monthly';
  userId?: string; // For individual user analytics
}

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
    
    // Verify admin/editor role for analytics access
    const { data: hasRole, error: roleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'admin' 
      });
    
    const { data: hasEditorRole, error: editorRoleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'editor' 
      });

    if (roleError || editorRoleError || (!hasRole && !hasEditorRole)) {
      throw new Error('FORBIDDEN: User analytics requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(supabase, 'admin-user-analytics', user.id);
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
    const query: AnalyticsQuery = {
      type: (url.searchParams.get('type') as any) || 'comprehensive',
      startDate: url.searchParams.get('start_date') || undefined,
      endDate: url.searchParams.get('end_date') || undefined,
      granularity: (url.searchParams.get('granularity') as any) || 'daily',
      userId: url.searchParams.get('user_id') || undefined
    };

    console.log('User analytics request:', query);

    // STEP 5: Core Business Logic Execution
    let result;

    switch (query.type) {
      case 'growth':
        result = await getUserGrowthAnalytics(supabase, query);
        break;
      
      case 'engagement':
        result = await getUserEngagementAnalytics(supabase, query);
        break;
      
      case 'roles':
        result = await getRoleDistributionAnalytics(supabase);
        break;
      
      case 'activity':
        result = await getUserActivityAnalytics(supabase, query);
        break;
      
      case 'geographic':
        result = await getGeographicAnalytics(supabase);
        break;
      
      case 'comprehensive':
        result = await getComprehensiveUserAnalytics(supabase, query);
        break;
      
      default:
        throw new Error(`Invalid analytics type: ${query.type}`);
    }

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('User analytics error:', error);
    return createErrorResponse(error);
  }
});

// User growth analytics over time
async function getUserGrowthAnalytics(supabase: any, query: AnalyticsQuery) {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const { data: growthData, error } = await supabase
    .from('Practitioners')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch growth data: ${error.message}`);
  }

  // Group by granularity
  const groupedData = groupByTimeGranularity(growthData, query.granularity || 'daily');
  
  return {
    type: 'growth',
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    granularity: query.granularity,
    data: groupedData
  };
}

// User engagement analytics
async function getUserEngagementAnalytics(supabase: any, query: AnalyticsQuery) {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get community post activity
  const { data: postActivity, error: postError } = await supabase
    .from('CommunityPosts')
    .select('author_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .not('author_id', 'is', null);

  if (postError) {
    throw new Error(`Failed to fetch post activity: ${postError.message}`);
  }

  // Calculate engagement metrics
  const uniqueActiveUsers = new Set(postActivity.map(p => p.author_id)).size;
  const totalPosts = postActivity.length;
  const avgPostsPerActiveUser = uniqueActiveUsers > 0 ? totalPosts / uniqueActiveUsers : 0;

  // Get total user count for context
  const { count: totalUsers, error: countError } = await supabase
    .from('Practitioners')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error getting total user count:', countError);
  }

  return {
    type: 'engagement',
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    metrics: {
      totalUsers: totalUsers || 0,
      activeUsers: uniqueActiveUsers,
      engagementRate: totalUsers ? (uniqueActiveUsers / totalUsers) * 100 : 0,
      totalPosts: totalPosts,
      avgPostsPerActiveUser: Math.round(avgPostsPerActiveUser * 100) / 100
    },
    activityByDay: groupByTimeGranularity(postActivity, 'daily')
  };
}

// Role distribution analytics
async function getRoleDistributionAnalytics(supabase: any) {
  // Get legacy role distribution
  const { data: legacyRoles, error: legacyError } = await supabase
    .from('Practitioners')
    .select('role')
    .not('role', 'is', null);

  if (legacyError) {
    throw new Error(`Failed to fetch legacy roles: ${legacyError.message}`);
  }

  // Get new UserRoles distribution
  const { data: newRoles, error: newError } = await supabase
    .from('UserRoles')
    .select('role_name, practitioner_id')
    .eq('is_active', true);

  if (newError) {
    throw new Error(`Failed to fetch new roles: ${newError.message}`);
  }

  // Process legacy roles
  const legacyRoleCount = legacyRoles.reduce((acc: any, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  // Process new roles
  const newRoleCount = newRoles.reduce((acc: any, role: any) => {
    acc[role.role_name] = (acc[role.role_name] || 0) + 1;
    return acc;
  }, {});

  return {
    type: 'roles',
    legacyRoleDistribution: legacyRoleCount,
    newRoleDistribution: newRoleCount,
    totalRoleAssignments: newRoles.length
  };
}

// User activity analytics
async function getUserActivityAnalytics(supabase: any, query: AnalyticsQuery) {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  // Get activity from audit logs
  const { data: auditActivity, error: auditError } = await supabase
    .from('SystemAuditLog')
    .select('performed_by, action_type, created_at, resource_type')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (auditError) {
    console.error('Error fetching audit activity:', auditError);
  }

  return {
    type: 'activity',
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    auditEvents: auditActivity || [],
    summary: {
      totalEvents: auditActivity?.length || 0,
      uniqueUsers: new Set(auditActivity?.map(a => a.performed_by) || []).size,
      actionTypes: groupBy(auditActivity || [], 'action_type'),
      resourceTypes: groupBy(auditActivity || [], 'resource_type')
    }
  };
}

// Geographic analytics (placeholder - would need IP geolocation data)
async function getGeographicAnalytics(supabase: any) {
  // This is a placeholder for geographic analytics
  // In a real implementation, you would collect and analyze IP geolocation data
  return {
    type: 'geographic',
    message: 'Geographic analytics not yet implemented',
    placeholder: true
  };
}

// Comprehensive analytics combining multiple metrics
async function getComprehensiveUserAnalytics(supabase: any, query: AnalyticsQuery) {
  const [growth, engagement, roles, activity] = await Promise.all([
    getUserGrowthAnalytics(supabase, query),
    getUserEngagementAnalytics(supabase, query),
    getRoleDistributionAnalytics(supabase),
    getUserActivityAnalytics(supabase, query)
  ]);

  return {
    type: 'comprehensive',
    generatedAt: new Date().toISOString(),
    growth,
    engagement,
    roles,
    activity
  };
}

// Helper function to group data by time granularity
function groupByTimeGranularity(data: any[], granularity: string) {
  const grouped: { [key: string]: number } = {};
  
  data.forEach(item => {
    const date = new Date(item.created_at);
    let key: string;
    
    switch (granularity) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    grouped[key] = (grouped[key] || 0) + 1;
  });
  
  return grouped;
}

// Helper function to group by a property
function groupBy(array: any[], key: string) {
  return array.reduce((acc, item) => {
    const group = item[key];
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
}
