
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
        // Call the edge function with post_id as a URL parameter
        const { data, error } = await supabase.functions.invoke('get-community-post-detail', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Pass post_id as a query parameter
          body: new URLSearchParams({ post_id: postId.toString() })
        });

        console.log('Edge function response:', { data, error });

        if (error) {
          console.error('Post detail fetch error:', error);
          
          // Handle specific error types
          if (error.message?.includes('Rate limit')) {
            throw new Error('Too many requests. Please wait a moment and try again.');
          }
          if (error.message?.includes('not found') || error.message?.includes('POST_NOT_FOUND')) {
            throw new Error('Este post não foi encontrado.');
          }
          if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
            throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
          }
          
          throw new Error(error.message || `Falha ao carregar o post com ID: ${postId}`);
        }

        if (!data) {
          console.error('No data returned from edge function');
          throw new Error(`Post com ID ${postId} não encontrado`);
        }

        console.log('Post detail fetched successfully:', data);
        return data as CommunityPost;
      } catch (error) {
        console.error('Error in usePostDetailQuery:', error);
        
        // Enhanced error handling for specific error types
        if (error instanceof Error) {
          if (error.message.includes('Rate limit')) {
            throw new Error('Muitas tentativas. Aguarde um momento e tente novamente.');
          }
          if (error.message.includes('not found')) {
            throw new Error('Este post não foi encontrado.');
          }
          if (error.message.includes('network') || error.message.includes('Failed to fetch') || error.message.includes('Failed to send a request')) {
            throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
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
