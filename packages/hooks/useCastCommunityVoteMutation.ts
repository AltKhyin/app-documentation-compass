
// ABOUTME: TanStack Query mutation hook for casting votes on community posts with optimistic updates.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

interface CastVotePayload {
  post_id: number;
  vote_type: 'up' | 'down' | 'none';
}

interface CastVoteResponse {
  success: boolean;
  message: string;
}

export const useCastCommunityVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CastVoteResponse, Error, CastVotePayload>({
    mutationFn: async (payload) => {
      console.log('Casting community vote:', payload);
      
      const { data, error } = await supabase.functions.invoke('cast-community-vote', {
        body: payload
      });

      if (error) {
        console.error('Community vote error:', error);
        throw new Error(error.message || 'Failed to cast vote');
      }

      if (data?.error) {
        console.error('Community vote API error:', data.error);
        throw new Error(data.error.message || 'Failed to cast vote');
      }

      console.log('Community vote cast successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Community vote successful, invalidating queries');
      
      // Invalidate community feed to reflect vote changes
      queryClient.invalidateQueries({ 
        queryKey: ['community-feed'] 
      });
      
      // Invalidate sidebar trending discussions
      queryClient.invalidateQueries({ 
        queryKey: ['community-sidebar'] 
      });
    },
    onError: (error) => {
      console.error('Community vote failed:', error);
    }
  });
};
