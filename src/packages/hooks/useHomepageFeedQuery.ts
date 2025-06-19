
// ABOUTME: Consolidated homepage feed query hook that fetches all homepage data in a single request

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';

export interface Review {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  featured_image_url?: string;
  published_at: string;
  authors: string[];
  tags: string[];
  type: 'review' | 'editorial' | 'guide';
  reading_time_minutes: number;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  vote_count: number;
  created_at: string;
  created_by: string;
  status: 'active' | 'reviewing' | 'accepted' | 'rejected';
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'moderator' | 'practitioner' | 'editor';
  subscription_tier: 'free' | 'premium' | 'enterprise';
}

export interface ConsolidatedHomepageData {
  featured: Review | null;
  recent: Review[];
  popular: Review[];
  recommendations: Review[];
  suggestions: Suggestion[];
  layout: string[];
  userProfile: UserProfile | null;
  notificationCount: number;
}

export const useConsolidatedHomepageFeedQuery = () => {
  return useQuery({
    queryKey: ['consolidated-homepage-feed'],
    queryFn: async (): Promise<ConsolidatedHomepageData> => {
      const { data, error } = await supabase.functions.invoke('get-homepage-feed');
      
      if (error) {
        console.error('Homepage feed error:', error);
        throw new Error(error.message || 'Failed to fetch homepage data');
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
