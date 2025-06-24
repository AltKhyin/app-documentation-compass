
// ABOUTME: Comprehensive user management Edge Function for admin operations following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  authenticateUser,
  handleCorsPreflightRequest,
  RateLimitError
} from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface UserManagementPayload {
  action: 'list' | 'get' | 'update' | 'deactivate' | 'reactivate' | 'delete';
  userId?: string;
  userData?: {
    full_name?: string;
    avatar_url?: string;
    profession_flair?: string;
    display_hover_card?: boolean;
  };
  filters?: {
    role?: string;
    subscription_tier?: string;
    search?: string;
    page?: number;
    limit?: number;
  };
}

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
      throw new Error('FORBIDDEN: User management requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-manage-users', 60, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    let payload: UserManagementPayload;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      payload = {
        action: 'list',
        filters: {
          role: url.searchParams.get('role') || undefined,
          subscription_tier: url.searchParams.get('subscription_tier') || undefined,
          search: url.searchParams.get('search') || undefined,
          page: parseInt(url.searchParams.get('page') || '1'),
          limit: parseInt(url.searchParams.get('limit') || '20')
        }
      };
    } else {
      payload = await req.json();
    }

    console.log('User management request:', { action: payload.action, userId: payload.userId });

    // STEP 5: Core Business Logic Execution
    let result;

    switch (payload.action) {
      case 'list':
        result = await handleListUsers(supabase, payload.filters);
        break;
      
      case 'get':
        if (!payload.userId) throw new Error('VALIDATION_FAILED: User ID is required for get action');
        result = await handleGetUser(supabase, payload.userId);
        break;
      
      case 'update':
        if (!payload.userId || !payload.userData) {
          throw new Error('VALIDATION_FAILED: User ID and user data are required for update action');
        }
        result = await handleUpdateUser(supabase, payload.userId, payload.userData, user.id);
        break;
      
      case 'deactivate':
      case 'reactivate':
        if (!payload.userId) throw new Error('VALIDATION_FAILED: User ID is required for activation actions');
        result = await handleToggleUserStatus(supabase, payload.userId, payload.action === 'reactivate', user.id);
        break;
      
      case 'delete':
        if (!payload.userId) throw new Error('VALIDATION_FAILED: User ID is required for delete action');
        if (userRole !== 'admin') {
          throw new Error('FORBIDDEN: Only admins can delete users');
        }
        result = await handleDeleteUser(supabase, payload.userId, user.id);
        break;
      
      default:
        throw new Error(`VALIDATION_FAILED: Invalid action: ${payload.action}`);
    }

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('User management error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to list users with filtering and pagination
async function handleListUsers(supabase: any, filters: any) {
  let query = supabase
    .from('Practitioners')
    .select(`
      id,
      full_name,
      avatar_url,
      role,
      subscription_tier,
      profession_flair,
      display_hover_card,
      contribution_score,
      created_at
    `);

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }
  
  if (filters?.subscription_tier) {
    query = query.eq('subscription_tier', filters.subscription_tier);
  }
  
  if (filters?.search) {
    query = query.ilike('full_name', `%${filters.search}%`);
  }

  const page = filters?.page || 1;
  const limit = Math.min(filters?.limit || 20, 100);
  const offset = (page - 1) * limit;
  
  query = query.range(offset, offset + limit - 1);
  query = query.order('created_at', { ascending: false });

  const { data: users, error } = await query;
  
  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const { count: totalCount, error: countError } = await supabase
    .from('Practitioners')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error getting user count:', countError);
  }

  return {
    users: users || [],
    pagination: {
      page,
      limit,
      total: totalCount || 0,
      hasMore: (totalCount || 0) > offset + limit
    }
  };
}

// Helper function to get single user with detailed information
async function handleGetUser(supabase: any, userId: string) {
  const { data: user, error } = await supabase
    .from('Practitioners')
    .select(`
      id,
      full_name,
      avatar_url,
      role,
      subscription_tier,
      profession_flair,
      display_hover_card,
      contribution_score,
      created_at
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  const { data: userRoles, error: rolesError } = await supabase
    .rpc('get_user_roles', { p_user_id: userId });

  if (rolesError) {
    console.error('Error fetching user roles:', rolesError);
  }

  return {
    ...user,
    roles: userRoles || []
  };
}

// Helper function to update user information
async function handleUpdateUser(supabase: any, userId: string, userData: any, performedBy: string) {
  const { data: updatedUser, error } = await supabase
    .from('Practitioners')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }

  await supabase.rpc('log_audit_event', {
    p_performed_by: performedBy,
    p_action_type: 'UPDATE',
    p_resource_type: 'Practitioners',
    p_resource_id: userId,
    p_new_values: userData,
    p_metadata: { source: 'admin_panel' }
  });

  return updatedUser;
}

// Helper function to toggle user active status
async function handleToggleUserStatus(supabase: any, userId: string, isActive: boolean, performedBy: string) {
  await supabase.rpc('log_audit_event', {
    p_performed_by: performedBy,
    p_action_type: isActive ? 'REACTIVATE' : 'DEACTIVATE',
    p_resource_type: 'Practitioners',
    p_resource_id: userId,
    p_metadata: { source: 'admin_panel', target_status: isActive }
  });

  return { userId, status: isActive ? 'active' : 'inactive' };
}

// Helper function to delete user (soft delete or complete removal)
async function handleDeleteUser(supabase: any, userId: string, performedBy: string) {
  await supabase.rpc('log_audit_event', {
    p_performed_by: performedBy,
    p_action_type: 'DELETE',
    p_resource_type: 'Practitioners',
    p_resource_id: userId,
    p_metadata: { source: 'admin_panel', type: 'hard_delete' }
  });

  return { userId, status: 'deletion_logged' };
}
