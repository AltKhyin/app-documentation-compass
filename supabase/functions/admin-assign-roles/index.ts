
// ABOUTME: Admin Edge Function for role assignment and management operations following the canonical 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { rateLimitCheck } from '../_shared/rate-limit.ts';
import { sendSuccess, sendError } from '../_shared/api-helpers.ts';

interface RoleManagementPayload {
  action: 'assign_role' | 'revoke_role' | 'list_user_roles' | 'list_available_roles';
  userId?: string;
  roleName?: string;
  expiresAt?: string;
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
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return sendError('UNAUTHORIZED', 'Authorization header is required', 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return sendError('UNAUTHORIZED', 'Invalid authentication token', 401);
    }

    // Verify admin role using the existing database function
    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'admin' 
      });

    if (roleError || !hasAdminRole) {
      return sendError('FORBIDDEN', 'Admin role required for role management', 403);
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await rateLimitCheck(req, 'admin-assign-roles', 30, 60);
    if (!rateLimitResult.allowed) {
      return sendError('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', 429);
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
        if (!payload.userId) throw new Error('User ID is required for listing user roles');
        result = await handleListUserRoles(supabase, payload.userId);
        break;
      
      case 'assign_role':
        if (!payload.userId || !payload.roleName) {
          throw new Error('User ID and role name are required for role assignment');
        }
        result = await handleAssignRole(supabase, payload.userId, payload.roleName, payload.expiresAt, user.id);
        break;
      
      case 'revoke_role':
        if (!payload.userId || !payload.roleName) {
          throw new Error('User ID and role name are required for role revocation');
        }
        result = await handleRevokeRole(supabase, payload.userId, payload.roleName, user.id);
        break;
      
      default:
        throw new Error(`Invalid action: ${payload.action}`);
    }

    // STEP 6: Standardized Success Response
    return sendSuccess(result);

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Role management error:', error);
    return sendError('INTERNAL_ERROR', error.message || 'An unexpected error occurred', 500);
  }
});

// Helper function to list available roles
async function handleListAvailableRoles() {
  // Return static list of available roles based on system design
  return {
    availableRoles: ['editor', 'moderator']
  };
}

// Helper function to list user roles
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

// Helper function to assign role
async function handleAssignRole(supabase: any, userId: string, roleName: string, expiresAt: string | undefined, performedBy: string) {
  // Insert into UserRoles table
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

  // Update user's primary role in Practitioners table if this is a higher role
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

  // Log the audit event
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

// Helper function to revoke role
async function handleRevokeRole(supabase: any, userId: string, roleName: string, performedBy: string) {
  // Remove from UserRoles table
  const { error: deleteError } = await supabase
    .from('UserRoles')
    .delete()
    .eq('practitioner_id', userId)
    .eq('role_name', roleName);

  if (deleteError) {
    console.error('Error revoking role:', deleteError);
    throw new Error(`Failed to revoke role: ${deleteError.message}`);
  }

  // Update user's primary role in Practitioners table to highest remaining role
  const { data: remainingRoles, error: rolesError } = await supabase
    .from('UserRoles')
    .select('role_name')
    .eq('practitioner_id', userId)
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.now()'); // Only active roles

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

  // Log the audit event
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
