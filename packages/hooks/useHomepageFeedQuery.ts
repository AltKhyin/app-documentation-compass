
// ABOUTME: TanStack Query hook for fetching all homepage data in a single consolidated request.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  published_at: string;
  view_count: number;
}

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  upvotes: number;
  created_at: string;
  Practitioners: {
    full_name: string;
  };
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  subscription_tier: string;
  contribution_score: number;
  profession_flair: string | null;
  display_hover_card: boolean;
  created_at: string;
}

// Consolidated interface that includes ALL homepage data
export interface ConsolidatedHomepageData {
  layout: string[];
  featured: Review | null;
  recent: Review[];
  popular: Review[];
  recommendations: Review[];
  suggestions: Suggestion[];
  userProfile: UserProfile | null;
  notificationCount: number;
}

/**
 * Fetches the complete consolidated homepage feed data from the get-homepage-feed Edge Function.
 * This single function replaces multiple separate API calls and follows [DOC_6] guidelines.
 */
const fetchConsolidatedHomepageFeed = async (): Promise<ConsolidatedHomepageData> => {
  console.log('Fetching consolidated homepage feed data...');
  
  try {
    const { data, error } = await supabase.functions.invoke('get-homepage-feed', {
      method: 'POST',
      body: {}
    });

    if (error) {
      console.error('Error fetching consolidated homepage feed:', error);
      throw new Error(error.message || 'Failed to fetch consolidated homepage feed');
    }

    if (!data) {
      console.error('No data returned from consolidated homepage feed');
      throw new Error('No data returned from consolidated homepage feed');
    }

    console.log('Consolidated homepage feed data fetched successfully:', data);
    return data as ConsolidatedHomepageData;
  } catch (error) {
    console.error('Critical error in fetchConsolidatedHomepageFeed:', error);
    throw error;
  }
};

/**
 * Custom hook for fetching consolidated homepage feed data.
 * Implements caching, retry logic, and follows the patterns from [DOC_6].
 * This single hook replaces useHomepageFeedQuery, useUserProfileQuery, and useNotificationCountQuery.
 * 
 * @returns TanStack Query result with consolidated homepage feed data
 */
export const useConsolidatedHomepageFeedQuery = () => {
  return useQuery({
    queryKey: ['consolidated-homepage-feed'],
    queryFn: fetchConsolidatedHomepageFeed,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache for 15 minutes
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Always refetch when component mounts
  });
};

// Backward compatibility export - deprecated, use useConsolidatedHomepageFeedQuery
export const useHomepageFeedQuery = useConsolidatedHomepageFeedQuery;

// Legacy interface for backward compatibility
export interface HomepageFeedData {
  layout: string[];
  featured: Review | null;
  recent: Review[];
  popular: Review[];
  recommendations: Review[];
  suggestions: Suggestion[];
}
