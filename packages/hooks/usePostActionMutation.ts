
// ABOUTME: TanStack Query mutation hook for performing moderation actions on community posts.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import { toast } from 'sonner';

interface PostActionParams {
  postId: number;
  action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'hide' | 'delete';
}

const executePostAction = async ({ postId, action }: PostActionParams) => {
  console.log('Executing post action:', { postId, action });
  
  // TASK 2.1: Fix payload property names to match backend expectation
  const { data, error } = await supabase.functions.invoke('moderate-community-post', {
    body: { 
      post_id: postId, 
      action_type: action 
    }
  });

  if (error) {
    console.error('Post action error:', error);
    throw new Error(error.message || 'Failed to execute post action');
  }

  if (data?.error) {
    console.error('Post action API error:', data.error);
    throw new Error(data.error.message || 'Failed to execute post action');
  }

  console.log('Post action executed successfully');
  return data;
};

export const usePostActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executePostAction,
    onSuccess: (data, variables) => {
      // Invalidate community feed to show updated post status
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
      
      // Show success toast
      const actionLabels = {
        pin: 'fixado',
        unpin: 'desfixado',
        lock: 'bloqueado',
        unlock: 'desbloqueado',
        hide: 'ocultado',
        delete: 'excluído'
      };
      
      toast.success(`Post ${actionLabels[variables.action]} com sucesso`);
    },
    onError: (error) => {
      console.error('Post action mutation error:', error);
      toast.error(error.message || 'Erro ao executar ação');
    },
  });
};
