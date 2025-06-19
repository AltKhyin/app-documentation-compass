
// ABOUTME: Enhanced mutation hook for creating community posts with comprehensive error handling and logging.

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
  success: boolean;
}

/**
 * Enhanced hook for creating new community posts.
 * Follows [DAL.1-4] - encapsulates backend interaction, uses TanStack Query, invalidates cache.
 * Uses the create-community-post Edge Function as specified in [DOC_5].
 */
export const useCreateCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCommunityPostResponse, Error, CreateCommunityPostPayload>({
    mutationFn: async (payload) => {
      console.log('Starting post creation mutation:', payload);

      try {
        const { data, error } = await supabase.functions.invoke('create-community-post', {
          body: payload
        });

        console.log('Edge function response:', { data, error });

        if (error) {
          console.error('Edge function error:', error);
          throw new Error(error.message || 'Failed to create post');
        }

        if (data?.error) {
          console.error('Data error:', data.error);
          throw new Error(data.error.message || 'Failed to create post');
        }

        if (!data?.success) {
          console.error('Unexpected response format:', data);
          throw new Error('Unexpected response from server');
        }

        console.log('Post created successfully:', data);
        return data as CreateCommunityPostResponse;

      } catch (error) {
        console.error('Mutation error:', error);
        
        // Re-throw with enhanced error information
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('Unknown error occurred during post creation');
        }
      }
    },
    onSuccess: (data) => {
      console.log('Post creation successful, invalidating caches');
      
      // [DAL.4] - Mandatory cache invalidation for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
      queryClient.invalidateQueries({ queryKey: ['community-page-data'] });
      
      // Optional: Prefetch the new post data
      console.log('Cache invalidation complete');
    },
    onError: (error) => {
      console.error('Post creation mutation failed:', error);
      // Toast handling is done in the component for more specific error messages
    }
  });
};
