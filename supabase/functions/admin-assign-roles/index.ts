
// ABOUTME: Admin Edge Function for role assignment and management operations following the canonical 7-step pattern

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

interface RoleManagementPayload {
  action: 'assign_role' | 'revoke_role' | 'list_user_roles' | 'list_available_roles';
  userId?: string;
  roleName?: string;
  expiresAt?: string;
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

    // Verify admin role using JWT claims
    const userRole = user.app_metadata?.role;
    if (!userRole || userRole !== 'admin') {
      throw new Error('FORBIDDEN: Admin role required for role management');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-assign-roles', 30, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const payload: RoleManagementPayload = await req.json();
    console.log('Role management request:', { action: payload.action, userId: payload.userId });

    // STEP 5: Core Business Logic Execution
    let result;

    switch (payload.action) {
      case 'list_available_roles':
        result = await handleListAvailableRoles();
        break;
      
      case 'list_user_roles':
        if (!payload.userId) throw new Error('VALIDATION_FAILED: User ID is required for listing user roles');
        result = await handleListUserRoles(supabase, payload.userId);
        break;
      
      case 'assign_role':
        if (!payload.userId || !payload.roleName) {
          throw new Error('VALIDATION_FAILED: User ID and role name are required for role assignment');
        }
        result = await handleAssignRole(supabase, payload.userId, payload.roleName, payload.expiresAt, user.id);
        break;
      
      case 'revoke_role':
        if (!payload.userId || !payload.roleName) {
          throw new Error('VALIDATION_FAILED: User ID and role name are required for role revocation');
        }
        result = await handleRevokeRole(supabase, payload.userId, payload.roleName, user.id);
        break;
      
      default:
        throw new Error(`VALIDATION_FAILED: Invalid action: ${payload.action}`);
    }

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Role management error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to list available roles
async function handleListAvailableRoles() {
  return {
    availableRoles: ['editor', 'moderator']
  };
}

async function handleListUserRoles(supabase: any, userId: string) {
  const { data: userRoles, error } = await supabase
    .rpc('get_user_roles', { p_user_id: userId });

  if (error) {
    console.error('Error fetching user roles:', error);
    throw new Error(`Failed to fetch user roles: ${error.message}`);
  }

  return {
    roles: userRoles || []
  };
}

async function handleAssignRole(supabase: any, userId: string, roleName: string, expiresAt: string | undefined, performedBy: string) {
  const roleData: any = {
    practitioner_id: userId,
    role_name: roleName,
    granted_by: performedBy,
    granted_at: new Date().toISOString(),
    is_active: true
  };

  if (expiresAt) {
    roleData.expires_at = expiresAt;
  }

  const { data: newRole, error: roleError } = await supabase
    .from('UserRoles')
    .insert(roleData)
    .select()
    .single();

  if (roleError) {
    console.error('Error assigning role:', roleError);
    throw new Error(`Failed to assign role: ${roleError.message}`);
  }

  const roleHierarchy = { 'admin': 4, 'editor': 3, 'moderator': 2, 'practitioner': 1 };
  const newRoleLevel = roleHierarchy[roleName as keyof typeof roleHierarchy] || 1;

  const { data: currentUser, error: userError } = await supabase
    .from('Practitioners')
    .select('role')
    .eq('id', userId)
    .single();

  if (!userError && currentUser) {
    const currentRoleLevel = roleHierarchy[currentUser.role as keyof typeof roleHierarchy] || 1;
    
    if (newRoleLevel > currentRoleLevel) {
      await supabase
        .from('Practitioners')
        .update({ role: roleName })
        .eq('id', userId);
    }
  }

  await supabase.rpc('log_audit_event', {
    p_performed_by: performedBy,
    p_action_type: 'ASSIGN_ROLE',
    p_resource_type: 'UserRoles',
    p_resource_id: userId,
    p_new_values: { role_name: roleName, expires_at: expiresAt },
    p_metadata: { source: 'admin_panel' }
  });

  return { success: true, role: newRole };
}

async function handleRevokeRole(supabase: any, userId: string, roleName: string, performedBy: string) {
  const { error: deleteError } = await supabase
    .from('UserRoles')
    .delete()
    .eq('practitioner_id', userId)
    .eq('role_name', roleName);

  if (deleteError) {
    console.error('Error revoking role:', deleteError);
    throw new Error(`Failed to revoke role: ${deleteError.message}`);
  }

  const { data: remainingRoles, error: rolesError } = await supabase
    .from('UserRoles')
    .select('role_name')
    .eq('practitioner_id', userId)
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.now()');

  if (!rolesError) {
    const roleHierarchy = { 'admin': 4, 'editor': 3, 'moderator': 2, 'practitioner': 1 };
    let highestRole = 'practitioner';
    let highestLevel = 1;

    remainingRoles?.forEach((role: any) => {
      const level = roleHierarchy[role.role_name as keyof typeof roleHierarchy] || 1;
      if (level > highestLevel) {
        highestLevel = level;
        highestRole = role.role_name;
      }
    });

    await supabase
      .from('Practitioners')
      .update({ role: highestRole })
      .eq('id', userId);
  }

  await supabase.rpc('log_audit_event', {
    p_performed_by: performedBy,
    p_action_type: 'REVOKE_ROLE',
    p_resource_type: 'UserRoles',
    p_resource_id: userId,
    p_old_values: { role_name: roleName },
    p_metadata: { source: 'admin_panel' }
  });

  return { success: true, message: `Role ${roleName} revoked successfully` };
}
