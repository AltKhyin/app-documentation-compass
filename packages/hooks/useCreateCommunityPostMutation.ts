
// ABOUTME: Mutation hook for creating new community posts with rich text content and proper cache invalidation.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateCommunityPostPayload {
  title: string;
  content: string;
  category: string;
  post_type: string;
  review_id?: number;
  parent_post_id?: number;
}

interface CreateCommunityPostResponse {
  post_id: number;
  message: string;
}

/**
 * Hook for creating new community posts.
 * Follows [DAL.1-4] - encapsulates backend interaction, uses TanStack Query, invalidates cache.
 * Uses the create-community-post Edge Function as specified in [DOC_5].
 */
export const useCreateCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCommunityPostResponse, Error, CreateCommunityPostPayload>({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.functions.invoke('create-community-post', {
        body: payload
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error.message || 'Failed to create post');
      }

      return data as CreateCommunityPostResponse;
    },
    onSuccess: (data) => {
      // [DAL.4] - Mandatory cache invalidation for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
      
      // Show success feedback
      toast.success('Discussão criada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar discussão. Tente novamente.');
    }
  });
};
