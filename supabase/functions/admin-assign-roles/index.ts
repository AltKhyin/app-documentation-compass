
// ABOUTME: Role assignment and management Edge Function for granular permission control

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse, authenticateUser } from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface RoleAssignmentPayload {
  action: 'assign' | 'revoke' | 'list_user_roles' | 'list_available_roles';
  userId?: string;
  roleName?: string;
  expiresAt?: string; // ISO string for expiration date
}

const VALID_ROLES = ['admin', 'editor', 'moderator', 'practitioner'];

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
    
    // Verify admin role for role assignment
    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'admin' 
      });

    if (roleError || !hasAdminRole) {
      throw new Error('FORBIDDEN: Role assignment requires admin privileges');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(supabase, 'admin-assign-roles', user.id);
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
    const payload: RoleAssignmentPayload = await req.json();
    
    console.log('Role assignment request:', { 
      action: payload.action, 
      userId: payload.userId, 
      roleName: payload.roleName 
    });

    // STEP 5: Core Business Logic Execution
    let result;

    switch (payload.action) {
      case 'assign':
        if (!payload.userId || !payload.roleName) {
          throw new Error('User ID and role name are required for assignment');
        }
        if (!VALID_ROLES.includes(payload.roleName)) {
          throw new Error(`Invalid role: ${payload.roleName}`);
        }
        result = await handleAssignRole(supabase, payload.userId, payload.roleName, user.id, payload.expiresAt);
        break;
      
      case 'revoke':
        if (!payload.userId || !payload.roleName) {
          throw new Error('User ID and role name are required for revocation');
        }
        result = await handleRevokeRole(supabase, payload.userId, payload.roleName, user.id);
        break;
      
      case 'list_user_roles':
        if (!payload.userId) {
          throw new Error('User ID is required to list user roles');
        }
        result = await handleListUserRoles(supabase, payload.userId);
        break;
      
      case 'list_available_roles':
        result = { availableRoles: VALID_ROLES };
        break;
      
      default:
        throw new Error(`Invalid action: ${payload.action}`);
    }

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Role assignment error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to assign a role to a user
async function handleAssignRole(supabase: any, userId: string, roleName: string, grantedBy: string, expiresAt?: string) {
  // Check if user exists
  const { data: userExists, error: userError } = await supabase
    .from('Practitioners')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !userExists) {
    throw new Error('User not found');
  }

  // Parse expiration date if provided
  let expirationDate = null;
  if (expiresAt) {
    expirationDate = new Date(expiresAt);
    if (isNaN(expirationDate.getTime())) {
      throw new Error('Invalid expiration date format');
    }
  }

  // Insert or update the role assignment
  const { data: roleAssignment, error: assignError } = await supabase
    .from('UserRoles')
    .upsert({
      practitioner_id: userId,
      role_name: roleName,
      granted_by: grantedBy,
      granted_at: new Date().toISOString(),
      expires_at: expirationDate?.toISOString(),
      is_active: true
    }, {
      onConflict: 'practitioner_id,role_name'
    })
    .select()
    .single();

  if (assignError) {
    console.error('Error assigning role:', assignError);
    throw new Error(`Failed to assign role: ${assignError.message}`);
  }

  // Update the legacy role field in Practitioners table for backwards compatibility
  if (roleName === 'admin' || roleName === 'editor') {
    await supabase
      .from('Practitioners')
      .update({ role: roleName })
      .eq('id', userId);
  }

  // Log the audit event
  await supabase.rpc('log_audit_event', {
    p_performed_by: grantedBy,
    p_action_type: 'ROLE_ASSIGNED',
    p_resource_type: 'UserRoles',
    p_resource_id: roleAssignment.id,
    p_new_values: {
      user_id: userId,
      role_name: roleName,
      expires_at: expirationDate?.toISOString()
    },
    p_metadata: { source: 'admin_panel' }
  });

  return {
    success: true,
    roleAssignment: roleAssignment,
    message: `Role '${roleName}' assigned to user successfully`
  };
}

// Helper function to revoke a role from a user
async function handleRevokeRole(supabase: any, userId: string, roleName: string, revokedBy: string) {
  // Find the role assignment
  const { data: existingRole, error: findError } = await supabase
    .from('UserRoles')
    .select('*')
    .eq('practitioner_id', userId)
    .eq('role_name', roleName)
    .eq('is_active', true)
    .single();

  if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error finding role:', findError);
    throw new Error(`Failed to find role: ${findError.message}`);
  }

  if (!existingRole) {
    throw new Error(`User does not have the role '${roleName}' or it's already inactive`);
  }

  // Deactivate the role assignment
  const { data: updatedRole, error: revokeError } = await supabase
    .from('UserRoles')
    .update({ is_active: false })
    .eq('id', existingRole.id)
    .select()
    .single();

  if (revokeError) {
    console.error('Error revoking role:', revokeError);
    throw new Error(`Failed to revoke role: ${revokeError.message}`);
  }

  // Update the legacy role field in Practitioners table
  if (roleName === 'admin' || roleName === 'editor') {
    // Check if user still has other admin/editor roles
    const { data: remainingRoles } = await supabase
      .from('UserRoles')
      .select('role_name')
      .eq('practitioner_id', userId)
      .eq('is_active', true)
      .in('role_name', ['admin', 'editor']);

    if (!remainingRoles || remainingRoles.length === 0) {
      await supabase
        .from('Practitioners')
        .update({ role: 'practitioner' })
        .eq('id', userId);
    }
  }

  // Log the audit event
  await supabase.rpc('log_audit_event', {
    p_performed_by: revokedBy,
    p_action_type: 'ROLE_REVOKED',
    p_resource_type: 'UserRoles',
    p_resource_id: existingRole.id,
    p_old_values: existingRole,
    p_new_values: { is_active: false },
    p_metadata: { source: 'admin_panel' }
  });

  return {
    success: true,
    message: `Role '${roleName}' revoked from user successfully`
  };
}

// Helper function to list all roles for a specific user
async function handleListUserRoles(supabase: any, userId: string) {
  const { data: userRoles, error } = await supabase
    .rpc('get_user_roles', { p_user_id: userId });

  if (error) {
    console.error('Error fetching user roles:', error);
    throw new Error(`Failed to fetch user roles: ${error.message}`);
  }

  return {
    userId: userId,
    roles: userRoles || []
  };
}
