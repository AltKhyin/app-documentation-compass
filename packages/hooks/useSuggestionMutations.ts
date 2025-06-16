
// ABOUTME: TanStack Query mutations for suggestion voting and submission functionality.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SubmitSuggestionRequest {
  title: string;
  description?: string;
}

export interface CastVoteRequest {
  suggestion_id: number;
}

export interface SuggestionMutationResponse {
  data?: any;
  message: string;
}

/**
 * Mutation hook for submitting new suggestions.
 * Follows the established pattern from [DOC_6] with proper error handling and cache invalidation.
 */
export const useSubmitSuggestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SubmitSuggestionRequest): Promise<SuggestionMutationResponse> => {
      console.log('🚀 Submitting new suggestion:', request.title);
      
      const { data, error } = await supabase.functions.invoke('submit-suggestion', {
        method: 'POST',
        body: request
      });

      if (error) {
        console.error('❌ Error submitting suggestion:', error);
        throw new Error(error.message || 'Failed to submit suggestion');
      }

      if (!data) {
        console.error('❌ No data returned from submit-suggestion');
        throw new Error('No data returned from suggestion submission');
      }

      console.log('✅ Suggestion submitted successfully');
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch homepage data to show the new suggestion
      queryClient.invalidateQueries({ 
        queryKey: ['consolidated-homepage-feed'] 
      });
      console.log('✅ Invalidated homepage feed cache after suggestion submission');
    },
    onError: (error) => {
      console.error('❌ Suggestion submission failed:', error);
    }
  });
};

/**
 * Mutation hook for casting votes on suggestions.
 * Handles both voting and vote retraction with optimistic updates.
 */
export const useCastVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ suggestion_id, action }: { suggestion_id: number; action: 'vote' | 'retract' }): Promise<SuggestionMutationResponse> => {
      console.log(`🚀 ${action === 'vote' ? 'Casting vote' : 'Retracting vote'} on suggestion ${suggestion_id}`);
      
      const { data, error } = await supabase.functions.invoke('cast-vote', {
        method: action === 'vote' ? 'POST' : 'DELETE',
        body: { suggestion_id }
      });

      if (error) {
        console.error(`❌ Error ${action === 'vote' ? 'casting vote' : 'retracting vote'}:`, error);
        throw new Error(error.message || `Failed to ${action} vote`);
      }

      if (!data) {
        console.error(`❌ No data returned from ${action} vote`);
        throw new Error(`No data returned from ${action} vote`);
      }

      console.log(`✅ Vote ${action === 'vote' ? 'cast' : 'retracted'} successfully`);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch homepage data to show updated vote counts
      queryClient.invalidateQueries({ 
        queryKey: ['consolidated-homepage-feed'] 
      });
      console.log('✅ Invalidated homepage feed cache after vote action');
    },
    onError: (error) => {
      console.error('❌ Vote action failed:', error);
    }
  });
};
