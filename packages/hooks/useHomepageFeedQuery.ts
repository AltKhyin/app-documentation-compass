
// ABOUTME: TanStack Query hook for fetching all homepage data in a single request.

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
  total_votes: number;
  created_at: string;
  Practitioners: {
    full_name: string;
  };
}

export interface HomepageFeedData {
  layout: string[];
  featured: Review | null;
  recent: Review[];
  popular: Review[];
  recommendations: Review[];
  suggestions: Suggestion[];
}

/**
 * Fetches the complete homepage feed data from the get-homepage-feed Edge Function.
 * This is the only function that should call the Edge Function directly.
 */
const fetchHomepageFeed = async (): Promise<HomepageFeedData> => {
  console.log('Fetching homepage feed data...');
  
  const { data, error } = await supabase.functions.invoke('get-homepage-feed', {
    method: 'POST',
    body: {}
  });

  if (error) {
    console.error('Error fetching homepage feed:', error);
    throw new Error(error.message || 'Failed to fetch homepage feed');
  }

  if (!data) {
    throw new Error('No data returned from homepage feed');
  }

  console.log('Homepage feed data fetched successfully');
  return data as HomepageFeedData;
};

/**
 * Custom hook for fetching homepage feed data.
 * Implements caching, retry logic, and follows the patterns from [DOC_6].
 * 
 * @returns TanStack Query result with homepage feed data
 */
export const useHomepageFeedQuery = () => {
  return useQuery({
    queryKey: ['homepage-feed'],
    queryFn: fetchHomepageFeed,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache for 15 minutes (renamed from cacheTime in v5)
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Always refetch when component mounts
  });
};
