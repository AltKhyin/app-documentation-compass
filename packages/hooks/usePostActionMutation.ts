
// ABOUTME: Mutation hook for post actions like pin/unpin, hide/unhide with proper type safety.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import { toast } from 'sonner';

interface PostActionRequest {
  postId: number;
  action: 'pin' | 'unpin' | 'hide' | 'unhide';
}

interface PostActionResponse {
  success: boolean;
  message: string;
}

/**
 * Hook for performing actions on community posts (pin/unpin, hide/unhide).
 * Follows [DAL.1-4] - encapsulates backend interaction, uses TanStack Query, invalidates cache.
 */
export const usePostActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PostActionResponse, Error, PostActionRequest>({
    mutationFn: async ({ postId, action }) => {
      const { data, error } = await supabase.functions.invoke('moderate-community-post', {
        body: { postId, action }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error.message || 'Failed to perform action');
      }

      // Ensure we return the correct type
      return {
        success: data?.success || true,
        message: data?.message || 'Action completed successfully'
      } as PostActionResponse;
    },
    onSuccess: () => {
      // [DAL.4] - Mandatory cache invalidation
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
      queryClient.invalidateQueries({ queryKey: ['community-sidebar'] });
      
      toast.success('Ação realizada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao realizar ação. Tente novamente.');
    }
  });
};
