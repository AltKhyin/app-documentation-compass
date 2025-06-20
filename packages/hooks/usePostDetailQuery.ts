
// ABOUTME: Hook for fetching individual community post details with comments and interactions - improved type safety.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import type { CommunityPost } from '../../src/types/community';
import type { ApiResponse } from '../../src/types/api';

export const usePostDetailQuery = (postId: number) => {
  return useQuery({
    queryKey: ['community-post-detail', postId],
    queryFn: async (): Promise<CommunityPost> => {
      console.log('Fetching post detail for ID:', postId);
      
      const { data, error } = await supabase.functions.invoke('get-community-post-detail', {
        body: { post_id: postId }
      });

      if (error) {
        console.error('Post detail fetch error:', error);
        throw new Error(error.message || 'Failed to fetch post details');
      }

      console.log('Post detail fetched successfully:', data);
      return data as CommunityPost;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!postId && !isNaN(postId) && postId > 0,
  });
};
