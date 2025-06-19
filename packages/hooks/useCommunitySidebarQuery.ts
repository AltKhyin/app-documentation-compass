
// ABOUTME: Enhanced TanStack Query hook for community sidebar with community metadata

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

export interface SidebarLink {
  title: string;
  url: string;
  description?: string;
}

export interface FeaturedPoll {
  id: number;
  question: string;
  options: Array<{ id: number; text: string; vote_count: number }>;
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
  flair_text?: string;
  is_pinned?: boolean;
}

export interface RecentActivity {
  onlineUsers: number;
  todayPosts: number;
  totalDiscussions: number;
}

export interface Community {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  member_count: number;
}

interface SidebarData {
  rules: string[];
  links: SidebarLink[];
  featuredPoll: FeaturedPoll | null;
  trendingDiscussions: TrendingDiscussion[];
  recentActivity: RecentActivity;
  communityDetails: Community; // Added community metadata
}

const fetchCommunitySidebarData = async (): Promise<SidebarData> => {
  console.log('Fetching enhanced community sidebar data with community details');
  
  // First fetch community details from the new Communities table
  const { data: communityData, error: communityError } = await supabase
    .from('Communities')
    .select('*')
    .eq('id', 'a7d8e9f0-a1b2-c3d4-e5f6-a7b8c9d0e1f2')
    .single();

  if (communityError) {
    console.error('Failed to fetch community details:', communityError);
    // Fallback community data
    const fallbackCommunity: Community = {
      id: 'a7d8e9f0-a1b2-c3d4-e5f6-a7b8c9d0e1f2',
      name: 'Comunidade',
      description: 'Discussões e insights sobre evidências científicas.',
      avatar_url: null,
      banner_url: '/lovable-uploads/community-banner-default.jpg',
      member_count: 0
    };
    
    // Still fetch other sidebar data
    const { data, error } = await supabase.functions.invoke('get-community-sidebar-data');
    
    if (error) {
      console.error('Community sidebar data fetch error:', error);
      throw new Error(error.message || 'Failed to fetch community sidebar data');
    }

    return {
      ...data,
      communityDetails: fallbackCommunity
    };
  }

  // Fetch sidebar data from edge function
  const { data, error } = await supabase.functions.invoke('get-community-sidebar-data');

  if (error) {
    console.error('Community sidebar data fetch error:', error);
    throw new Error(error.message || 'Failed to fetch community sidebar data');
  }

  if (data?.error) {
    console.error('Community sidebar API error:', data.error);
    throw new Error(data.error.message || 'Failed to fetch community sidebar data');
  }

  console.log('Enhanced community sidebar data fetched successfully');
  return {
    ...data,
    communityDetails: communityData
  };
};

export const useCommunitySidebarQuery = () => {
  return useQuery<SidebarData, Error>({
    queryKey: ['community-sidebar'],
    queryFn: fetchCommunitySidebarData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};
