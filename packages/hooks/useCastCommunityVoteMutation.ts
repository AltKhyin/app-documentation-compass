
// ABOUTME: TanStack Query mutation hook for casting votes on community posts with optimistic updates.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

interface VotePayload {
  post_id: number;
  vote_type: 'up' | 'down' | 'none';
}

interface VoteResponse {
  success: boolean;
  message: string;
}

export const useCastCommunityVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<VoteResponse, Error, VotePayload>({
    mutationFn: async (payload) => {
      console.log('Casting community vote:', payload);
      
      const { data, error } = await supabase.functions.invoke('cast-community-vote', {
        body: payload
      });

      if (error) {
        console.error('Vote casting error:', error);
        throw new Error(error.message || 'Failed to cast vote');
      }

      if (data?.error) {
        console.error('Vote casting API error:', data.error);
        throw new Error(data.error.message || 'Failed to cast vote');
      }

      console.log('Vote cast successfully:', data);
      return data;
    },
    onSuccess: (response, variables) => {
      console.log('Vote casting successful, invalidating queries');
      
      // Invalidate community feed to refresh vote counts
      queryClient.invalidateQueries({ 
        queryKey: ['community-feed'] 
      });

      // Optimistically update the post in cache
      queryClient.setQueriesData(
        { queryKey: ['community-feed'] },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatePost = (post: any) => {
            if (post.id === variables.post_id) {
              const updatedPost = { ...post };
              
              // Remove previous vote if any
              if (post.user_vote === 'up') {
                updatedPost.upvotes = Math.max(0, updatedPost.upvotes - 1);
              } else if (post.user_vote === 'down') {
                updatedPost.downvotes = Math.max(0, updatedPost.downvotes - 1);
              }
              
              // Add new vote
              if (variables.vote_type === 'up') {
                updatedPost.upvotes += 1;
                updatedPost.user_vote = 'up';
              } else if (variables.vote_type === 'down') {
                updatedPost.downvotes += 1;
                updatedPost.user_vote = 'down';
              } else {
                updatedPost.user_vote = null;
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
      console.error('Vote casting failed:', error);
    }
  });
};
