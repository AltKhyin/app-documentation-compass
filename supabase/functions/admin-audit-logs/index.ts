
// ABOUTME: Admin Edge Function for audit log access following the mandatory 7-step pattern

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
    
    const user = await authenticateUser(supabase, req.headers.get('Authorization'));
    
    // Verify admin role for audit log access
    const userRole = user.app_metadata?.role;
    if (!userRole || userRole !== 'admin') {
      throw new Error('FORBIDDEN: Audit log access requires admin role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-audit-logs', 60, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const url = new URL(req.url);
    const params = {
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: Math.min(parseInt(url.searchParams.get('limit') || '50'), 100),
      actionType: url.searchParams.get('actionType'),
      resourceType: url.searchParams.get('resourceType'),
      performedBy: url.searchParams.get('performedBy'),
      startDate: url.searchParams.get('startDate'),
      endDate: url.searchParams.get('endDate')
    };

    console.log('Audit log request:', params);

    // STEP 5: Core Business Logic Execution
    const result = await fetchAuditLogs(supabase, params);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Audit log error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to fetch audit logs with filtering and pagination
async function fetchAuditLogs(supabase: any, params: any) {
  try {
    let query = supabase
      .from('SystemAuditLog')
      .select(`
        *,
        Practitioners!performed_by(full_name, avatar_url)
      `);

    // Apply filters
    if (params.actionType) {
      query = query.eq('action_type', params.actionType);
    }
    if (params.resourceType) {
      query = query.eq('resource_type', params.resourceType);
    }
    if (params.performedBy) {
      query = query.eq('performed_by', params.performedBy);
    }
    if (params.startDate) {
      query = query.gte('created_at', params.startDate);
    }
    if (params.endDate) {
      query = query.lte('created_at', params.endDate);
    }

    // Apply pagination
    const offset = (params.page - 1) * params.limit;
    query = query
      .range(offset, offset + params.limit - 1)
      .order('created_at', { ascending: false });

    const { data: logs, error: logsError } = await query;
    
    if (logsError) {
      throw new Error(`Failed to fetch audit logs: ${logsError.message}`);
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('SystemAuditLog')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Failed to get total count:', countError);
    }

    return {
      logs: logs || [],
      pagination: {
        page: params.page,
        limit: params.limit,
        total: totalCount || 0,
        hasMore: (totalCount || 0) > offset + params.limit
      }
    };

  } catch (error) {
    console.error('Error in fetchAuditLogs:', error);
    throw error;
  }
}
