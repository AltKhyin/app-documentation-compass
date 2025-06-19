
// ABOUTME: TanStack Query hook for fetching user's saved posts with infinite scroll support.

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import { CommunityPost } from '../../src/types';

interface SavedPostsResponse {
  posts: CommunityPost[];
  pagination: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

/**
 * Fetches saved posts for the current user
 * @param page Page number (0-based)
 * @param limit Number of posts per page
 */
const fetchSavedPosts = async ({ pageParam = 0 }): Promise<SavedPostsResponse> => {
  console.log(`Fetching saved posts: page ${pageParam}`);
  
  const { data, error } = await supabase.functions.invoke('get-saved-posts', {
    body: null,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (error) {
    console.error('Fetch saved posts error:', error);
    throw new Error(error.message || 'Failed to fetch saved posts');
  }

  return data;
};

/**
 * Custom hook for fetching user's saved posts with infinite scroll
 * Uses TanStack Query's useInfiniteQuery for pagination
 */
export const useSavedPostsQuery = () => {
  return useInfiniteQuery({
    queryKey: ['savedPosts'],
    queryFn: fetchSavedPosts,
    initialPageParam: 0, // Required for TanStack Query v5
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_next) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

/**
 * Simple hook for getting saved posts count only
 */
export const useSavedPostsCount = () => {
  const { data } = useSavedPostsQuery();
  
  const totalCount = data?.pages?.[0]?.pagination?.total_count || 0;
  
  return totalCount;
};
