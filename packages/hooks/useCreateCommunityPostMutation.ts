
// ABOUTME: TanStack Query mutation hook for creating community posts with auto-upvote and contribution score updates.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import type { CommunityPost } from './useCommunityFeedQuery';

interface CreatePostPayload {
  title?: string;
  content: string;
  category: string;
  review_id?: number;
  parent_post_id?: number;
}

export const useCreateCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommunityPost, Error, CreatePostPayload>({
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
    onSuccess: (newPost) => {
      console.log('Post creation successful, invalidating queries');
      
      // Invalidate and refetch community feed
      queryClient.invalidateQueries({ 
        queryKey: ['community-feed'] 
      });

      // Add the new post to the cache optimistically
      queryClient.setQueryData(
        ['community-feed', newPost.category, 'recent'],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const newPages = [...oldData.pages];
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              posts: [newPost, ...newPages[0].posts]
            };
          }
          
          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    },
    onError: (error) => {
      console.error('Post creation failed:', error);
    }
  });
};
