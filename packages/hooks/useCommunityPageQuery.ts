
// ABOUTME: Consolidated TanStack Query hook for fetching all community page data (feed + sidebar) in a single request.

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import type { CommunityPost } from './useCommunityFeedQuery';

interface CommunityPageResponse {
  posts: CommunityPost[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  sidebarData: {
    rules: string[];
    links: Array<{ title: string; url: string }>;
    trendingDiscussions: Array<{
      id: number;
      title: string;
      reply_count: number;
      upvotes: number;
      created_at: string;
    }>;
    featuredPoll: any;
    recentActivity: Array<{
      id: number;
      title: string;
      created_at: string;
      Practitioners: { full_name: string };
    }>;
  };
}

interface UseCommunityPageQueryOptions {
  category?: string;
  sort?: 'recent' | 'popular' | 'trending';
}

const fetchCommunityPageData = async ({ pageParam = 0 }: { pageParam?: number }) => {
  console.log('Fetching community page data:', { page: pageParam });
  
  const { data, error } = await supabase.functions.invoke('get-community-page-data', {
    body: { 
      page: pageParam,
      limit: 20
    }
  });

  if (error) {
    console.error('Community page data error:', error);
    throw new Error(error.message || 'Failed to fetch community page data');
  }

  if (data?.error) {
    console.error('Community page data API error:', data.error);
    throw new Error(data.error.message || 'Failed to fetch community page data');
  }

  console.log('Community page data fetched successfully');
  return data as CommunityPageResponse;
};

export const useCommunityPageQuery = (options: UseCommunityPageQueryOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ['community-page-data', options.category, options.sort],
    queryFn: fetchCommunityPageData,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    select: (data) => {
      // Extract posts for infinite scroll and sidebar data from first page only
      const allPosts = data.pages.flatMap(page => page.posts);
      const sidebarData = data.pages[0]?.sidebarData;
      
      return {
        posts: allPosts,
        sidebarData,
        pagination: data.pages[data.pages.length - 1]?.pagination
      };
    }
  });
};

// Export types for use in components
export type { CommunityPageResponse };
