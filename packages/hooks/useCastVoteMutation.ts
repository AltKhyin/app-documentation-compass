
// ABOUTME: TanStack Query mutation hook for casting votes on suggestions.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

interface CastVotePayload {
  suggestion_id: number;
  action: 'upvote' | 'remove_vote';
}

interface CastVoteResponse {
  message: string;
  suggestion_id: number;
  action: string;
  new_vote_count: number;
  user_has_voted: boolean;
}

export const useCastVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CastVoteResponse, Error, CastVotePayload>({
    mutationFn: async (payload) => {
      console.log('Casting vote via Edge Function:', payload);
      
      const { data, error } = await supabase.functions.invoke('cast-suggestion-vote', {
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
    onSuccess: (data) => {
      console.log('Vote casting successful, invalidating queries');
      // Invalidate consolidated homepage feed to refetch suggestions with updated counts
      queryClient.invalidateQueries({ 
        queryKey: ['consolidated-homepage-feed'] 
      });
    },
    onError: (error) => {
      console.error('Vote casting failed:', error);
    }
  });
};
