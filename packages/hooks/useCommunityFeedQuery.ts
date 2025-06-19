
// ABOUTME: TanStack Query hook for fetching paginated community feed with voting data, user personalization, and moderation indicators.

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

export interface CommunityPost {
  id: number;
  title: string | null;
  content: string;
  category: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  user_vote: string | null;
  reply_count: number;
  is_pinned?: boolean;
  is_locked?: boolean;
  flair_text?: string;
  flair_color?: string;
}

interface FeedResponse {
  posts: CommunityPost[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface FeedParams {
  category?: string;
  sort?: 'recent' | 'popular' | 'trending';
  limit?: number;
}

const fetchCommunityFeed = async ({ 
  pageParam = 0, 
  category, 
  sort = 'recent', 
  limit = 20 
}: FeedParams & { pageParam?: number }): Promise<FeedResponse> => {
  console.log('Fetching community feed:', { pageParam, category, sort, limit });
  
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: limit.toString(),
    sort
  });

  if (category && category !== 'all') {
    params.append('category', category);
  }

  const { data, error } = await supabase.functions.invoke('get-community-feed', {
    body: Object.fromEntries(params)
  });

  if (error) {
    console.error('Community feed fetch error:', error);
    throw new Error(error.message || 'Failed to fetch community feed');
  }

  if (data?.error) {
    console.error('Community feed API error:', data.error);
    throw new Error(data.error.message || 'Failed to fetch community feed');
  }

  console.log(`Community feed fetched successfully: ${data.posts.length} posts`);
  return data;
};

export const useCommunityFeedQuery = (params: FeedParams = {}) => {
  return useInfiniteQuery<FeedResponse, Error>({
    queryKey: ['community-feed', params.category, params.sort],
    queryFn: ({ pageParam }) => fetchCommunityFeed({ 
      ...params, 
      pageParam: pageParam as number 
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
