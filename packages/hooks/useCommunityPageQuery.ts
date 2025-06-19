
// ABOUTME: Consolidated hook for fetching all community page data (posts + sidebar) in a single request.

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import type { CommunityPost } from '../../src/types';

export interface CommunityPageResponse {
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
      content: string;
      category: string;
      reply_count: number;
      upvotes: number;
      created_at: string;
      author: {
        full_name: string | null;
      } | null;
      flair_text?: string;
      is_pinned?: boolean;
    }>;
    featuredPoll?: any;
    recentActivity: Array<{
      id: number;
      title: string;
      created_at: string;
      Practitioners: { full_name: string };
    }>;
  };
}

export const useCommunityPageQuery = () => {
  return useInfiniteQuery({
    queryKey: ['community-page-data'],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching community page data, page:', pageParam);
      
      const { data, error } = await supabase.functions.invoke('get-community-page-data', {
        body: { page: pageParam, limit: 20 }
      });

      if (error) {
        console.error('Community page data fetch error:', error);
        throw new Error(error.message || 'Failed to fetch community page data');
      }

      console.log('Community page data fetched successfully:', data);
      return data as CommunityPageResponse;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return undefined;
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Flatten all posts from all pages
      const posts = data.pages.flatMap(page => page.posts);
      // Get sidebar data from the first page (it's the same across all pages)
      const sidebarData = data.pages[0]?.sidebarData;
      
      return {
        posts,
        sidebarData
      };
    }
  });
};
