
// ABOUTME: TanStack Query mutation hook for centralized post actions (delete, pin, lock, etc.)

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import { useToast } from '../../src/hooks/use-toast';

interface PostActionPayload {
  postId: number;
  action: 'delete' | 'pin' | 'unpin' | 'lock' | 'unlock';
}

interface PostActionResponse {
  status: string;
  post_id?: number;
  [key: string]: any;
}

const executePostAction = async ({ postId, action }: PostActionPayload): Promise<PostActionResponse> => {
  console.log(`Executing post action: ${action} on post ${postId}`);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase.rpc('handle_post_action', {
    p_post_id: postId,
    p_user_id: user.id,
    p_action_type: action
  });

  if (error) {
    console.error('Post action RPC error:', error);
    throw new Error(error.message || 'Failed to execute post action');
  }

  console.log('Post action executed successfully:', data);
  return data;
};

export const usePostActionMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<PostActionResponse, Error, PostActionPayload>({
    mutationFn: executePostAction,
    onSuccess: (data, variables) => {
      // Invalidate community feed to reflect changes immediately
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
      queryClient.invalidateQueries({ queryKey: ['community-sidebar'] });
      
      // Show success message
      const actionMessages = {
        delete: 'Post excluído com sucesso',
        pin: 'Post fixado com sucesso',
        unpin: 'Post desfixado com sucesso',
        lock: 'Post bloqueado com sucesso',
        unlock: 'Post desbloqueado com sucesso'
      };
      
      toast({
        title: 'Ação realizada',
        description: actionMessages[variables.action] || 'Ação executada com sucesso'
      });
    },
    onError: (error) => {
      console.error('Post action mutation error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao executar ação',
        variant: 'destructive'
      });
    }
  });
};
