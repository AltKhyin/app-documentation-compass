
// ABOUTME: TanStack Query hook for fetching consolidated community sidebar data with caching and error handling.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

export interface SidebarRule {
  text: string;
}

export interface SidebarLink {
  title: string;
  url: string;
  description?: string;
}

export interface FeaturedPoll {
  id: number;
  question: string;
  options: Array<{
    id: number;
    text: string;
    vote_count: number;
  }>;
  total_votes: number;
  expires_at: string | null;
  user_vote: number | null;
}

export interface TrendingDiscussion {
  id: number;
  title: string | null;
  content: string;
  category: string;
  upvotes: number;
  reply_count: number;
  author: {
    full_name: string | null;
  } | null;
}

export interface RecentActivity {
  onlineUsers: number;
  todayPosts: number;
  totalDiscussions: number;
}

export interface CommunitySidebarData {
  rules: string[];
  links: SidebarLink[];
  featuredPoll: FeaturedPoll | null;
  trendingDiscussions: TrendingDiscussion[];
  recentActivity: RecentActivity;
}

const fetchCommunitySidebarData = async (): Promise<CommunitySidebarData> => {
  console.log('Fetching community sidebar data');
  
  const { data, error } = await supabase.functions.invoke('get-community-sidebar-data');

  if (error) {
    console.error('Community sidebar data fetch error:', error);
    throw new Error(error.message || 'Failed to fetch community sidebar data');
  }

  if (data?.error) {
    console.error('Community sidebar API error:', data.error);
    throw new Error(data.error.message || 'Failed to fetch community sidebar data');
  }

  console.log('Community sidebar data fetched successfully');
  return data;
};

export const useCommunitySidebarQuery = () => {
  return useQuery<CommunitySidebarData, Error>({
    queryKey: ['community-sidebar'],
    queryFn: fetchCommunitySidebarData,
    staleTime: 5 * 60 * 1000, // 5 minutes - balance freshness with performance
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on auth or rate limit errors
      if (error.message.includes('Rate limit') || error.message.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
