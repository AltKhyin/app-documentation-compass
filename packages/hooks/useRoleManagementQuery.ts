
// ABOUTME: TanStack Query hooks for role assignment and management operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RoleAssignment {
  role_name: string;
  granted_at: string;
  expires_at?: string;
}

interface RoleAssignmentPayload {
  userId: string;
  roleName: string;
  expiresAt?: string;
}

// Hook for listing available roles
export const useAvailableRolesQuery = () => {
  return useQuery({
    queryKey: ['admin-roles', 'available'],
    queryFn: async (): Promise<{ availableRoles: string[] }> => {
      console.log('Fetching available roles...');
      
      const { data, error } = await supabase.functions.invoke('admin-assign-roles', {
        body: {
          action: 'list_available_roles'
        }
      });
      
      if (error) {
        console.error('Error fetching available roles:', error);
        throw new Error(`Failed to fetch roles: ${error.message}`);
      }

      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (roles don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false
  });
};

// Hook for listing a user's roles
export const useUserRolesQuery = (userId: string) => {
  return useQuery({
    queryKey: ['admin-roles', 'user', userId],
    queryFn: async (): Promise<{ userId: string; roles: RoleAssignment[] }> => {
      console.log('Fetching user roles...', { userId });
      
      const { data, error } = await supabase.functions.invoke('admin-assign-roles', {
        body: {
          action: 'list_user_roles',
          userId
        }
      });
      
      if (error) {
        console.error('Error fetching user roles:', error);
        throw new Error(`Failed to fetch user roles: ${error.message}`);
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.error('User roles query failed:', error);
      return failureCount < 2;
    }
  });
};

// Hook for assigning roles to users
export const useAssignRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleName, expiresAt }: RoleAssignmentPayload) => {
      console.log('Assigning role via Edge Function...', { userId, roleName, expiresAt });
      
      const { data, error } = await supabase.functions.invoke('admin-assign-roles', {
        body: {
          action: 'assign',
          userId,
          roleName,
          expiresAt
        }
      });
      
      if (error) {
        console.error('Error assigning role:', error);
        throw new Error(`Failed to assign role: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data, { userId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['admin-roles', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      console.log('Role assigned successfully:', data);
    },
    onError: (error) => {
      console.error('Role assignment failed:', error);
    }
  });
};

// Hook for revoking roles from users
export const useRevokeRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleName }: { userId: string; roleName: string }) => {
      console.log('Revoking role via Edge Function...', { userId, roleName });
      
      const { data, error } = await supabase.functions.invoke('admin-assign-roles', {
        body: {
          action: 'revoke',
          userId,
          roleName
        }
      });
      
      if (error) {
        console.error('Error revoking role:', error);
        throw new Error(`Failed to revoke role: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data, { userId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['admin-roles', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      console.log('Role revoked successfully:', data);
    },
    onError: (error) => {
      console.error('Role revocation failed:', error);
    }
  });
};
