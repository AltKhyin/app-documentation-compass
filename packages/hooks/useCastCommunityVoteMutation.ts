
// ABOUTME: TanStack Query mutation hook for casting votes on community posts with optimistic updates.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

interface CastVotePayload {
  post_id: number;
  vote_type: 'up' | 'down' | 'none';
}

interface VoteResponse {
  post_id: number;
  upvotes: number;
  downvotes: number;
  user_vote: string | null;
}

export const useCastCommunityVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<VoteResponse, Error, CastVotePayload>({
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
    onMutate: async ({ post_id, vote_type }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['community-feed'] });

      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: ['community-feed'] });

      // Optimistically update the vote
      queryClient.setQueriesData(
        { queryKey: ['community-feed'] },
        (oldData: any) => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => {
              if (post.id === post_id) {
                const currentVote = post.user_vote;
                let newUpvotes = post.upvotes;
                let newDownvotes = post.downvotes;

                // Remove previous vote effect
                if (currentVote === 'up') newUpvotes--;
                if (currentVote === 'down') newDownvotes--;

                // Apply new vote effect
                if (vote_type === 'up') newUpvotes++;
                if (vote_type === 'down') newDownvotes++;

                return {
                  ...post,
                  upvotes: Math.max(0, newUpvotes),
                  downvotes: Math.max(0, newDownvotes),
                  user_vote: vote_type === 'none' ? null : vote_type
                };
              }
              return post;
            })
          }));

          return {
            ...oldData,
            pages: newPages
          };
        }
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Vote casting failed:', error);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    }
  });
};
