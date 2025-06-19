
// ABOUTME: TanStack Query mutation hook for community post moderation actions.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

interface ModerationPayload {
  post_id: number;
  action_type: 'pin' | 'unpin' | 'lock' | 'unlock' | 'flair' | 'hide';
  reason?: string;
  flair_text?: string;
  flair_color?: string;
}

interface ModerationResponse {
  success: boolean;
  message: string;
}

export const useModerateCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ModerationResponse, Error, ModerationPayload>({
    mutationFn: async (payload) => {
      console.log('Executing moderation action:', payload);
      
      const { data, error } = await supabase.functions.invoke('moderate-community-post', {
        body: payload
      });

      if (error) {
        console.error('Moderation action error:', error);
        throw new Error(error.message || 'Failed to execute moderation action');
      }

      if (data?.error) {
        console.error('Moderation action API error:', data.error);
        throw new Error(data.error.message || 'Failed to execute moderation action');
      }

      console.log('Moderation action completed successfully:', data);
      return data;
    },
    onSuccess: (response, variables) => {
      console.log('Moderation action successful, invalidating queries');
      
      // Invalidate community feed to refresh post states
      queryClient.invalidateQueries({ 
        queryKey: ['community-feed'] 
      });

      // Invalidate sidebar data to refresh trending discussions
      queryClient.invalidateQueries({ 
        queryKey: ['community-sidebar'] 
      });

      // Optimistically update the specific post in cache if possible
      queryClient.setQueriesData(
        { queryKey: ['community-feed'] },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatePost = (post: any) => {
            if (post.id === variables.post_id) {
              const updatedPost = { ...post };
              
              switch (variables.action_type) {
                case 'pin':
                  updatedPost.is_pinned = true;
                  break;
                case 'unpin':
                  updatedPost.is_pinned = false;  
                  break;
                case 'lock':
                  updatedPost.is_locked = true;
                  break;
                case 'unlock':
                  updatedPost.is_locked = false;
                  break;
                case 'flair':
                  if (variables.flair_text) {
                    updatedPost.flair_text = variables.flair_text;
                    updatedPost.flair_color = variables.flair_color || '#6366f1';
                  }
                  break;
              }
              
              return updatedPost;
            }
            return post;
          };

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map(updatePost)
            }))
          };
        }
      );
    },
    onError: (error) => {
      console.error('Moderation action failed:', error);
    }
  });
};
