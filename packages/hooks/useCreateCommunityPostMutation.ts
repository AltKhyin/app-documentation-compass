
// ABOUTME: TanStack Query mutation hook for creating new community posts with proper validation and cache updates.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

interface CreatePostPayload {
  title?: string;
  content: string;
  category: string;
}

interface CreatePostResponse {
  success: boolean;
  post_id?: number;
  message: string;
}

export const useCreateCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostResponse, Error, CreatePostPayload>({
    mutationFn: async (payload) => {
      console.log('Creating community post:', payload);
      
      const { data, error } = await supabase.functions.invoke('create-community-post', {
        body: payload
      });

      if (error) {
        console.error('Post creation error:', error);
        throw new Error(error.message || 'Failed to create post');
      }

      if (data?.error) {
        console.error('Post creation API error:', data.error);
        throw new Error(data.error.message || 'Failed to create post');
      }

      console.log('Post created successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Post creation successful, invalidating queries');
      
      // Invalidate community feed to show new post
      queryClient.invalidateQueries({ 
        queryKey: ['community-feed'] 
      });
      
      // Invalidate sidebar data to update activity stats
      queryClient.invalidateQueries({ 
        queryKey: ['community-sidebar'] 
      });
    },
    onError: (error) => {
      console.error('Post creation failed:', error);
    }
  });
};
