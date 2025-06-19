
// ABOUTME: Mutation hook for community post actions (delete, pin, lock, etc.) with simple cache invalidation strategy.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PostActionPayload {
  postId: number;
  action: 'delete' | 'pin' | 'unpin' | 'lock' | 'unlock';
}

interface PostActionResponse {
  success: boolean;
  message: string;
}

/**
 * Hook for executing post moderation actions.
 * Follows [DAL.1-4] - encapsulates backend interaction, uses TanStack Query, invalidates cache.
 * Prioritizes simplicity over performance - no optimistic updates.
 */
export const usePostActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PostActionResponse, Error, PostActionPayload>({
    mutationFn: async ({ postId, action }) => {
      const { data, error } = await supabase.rpc('handle_post_action', {
        p_post_id: postId,
        p_user_id: (await supabase.auth.getUser()).data.user?.id || '',
        p_action_type: action
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as PostActionResponse;
    },
    onSuccess: (data, variables) => {
      // [DAL.4] - Mandatory cache invalidation for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
      
      // Show success feedback
      toast.success(data.message || 'Ação executada com sucesso');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao executar ação. Tente novamente.');
    }
  });
};
