
// ABOUTME: Hook for fetching individual community post details with enhanced error handling and performance optimization.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import type { CommunityPost } from '../../src/types/community';

export const usePostDetailQuery = (postId: number) => {
  return useQuery({
    queryKey: ['community-post-detail', postId],
    queryFn: async (): Promise<CommunityPost> => {
      console.log('Fetching post detail for ID:', postId);
      
      try {
        const { data, error } = await supabase.functions.invoke('get-community-post-detail', {
          body: { post_id: postId },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (error) {
          console.error('Post detail fetch error:', error);
          throw new Error(error.message || `Failed to fetch post details for ID: ${postId}`);
        }

        if (!data) {
          throw new Error(`Post with ID ${postId} not found`);
        }

        console.log('Post detail fetched successfully:', data);
        return data as CommunityPost;
      } catch (error) {
        console.error('Error in usePostDetailQuery:', error);
        
        // Enhanced error handling for specific error types
        if (error instanceof Error) {
          if (error.message.includes('Rate limit')) {
            throw new Error('Too many requests. Please wait a moment and try again.');
          }
          if (error.message.includes('not found')) {
            throw new Error('This post could not be found.');
          }
          if (error.message.includes('network')) {
            throw new Error('Network error. Please check your connection and try again.');
          }
        }
        
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - posts change less frequently
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    enabled: !!postId && !isNaN(postId) && postId > 0,
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
    retry: (failureCount, error) => {
      // Don't retry on 404 or rate limit errors
      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('Rate limit')) {
          return false;
        }
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: `Failed to load post details`
    }
  });
};
