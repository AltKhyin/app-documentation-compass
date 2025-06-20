
// ABOUTME: TanStack Query hook for fetching current user profile data.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  subscription_tier: string;
}

export const useUserProfileQuery = () => {
  return useQuery<UserProfile | null>({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<UserProfile | null> => {
      console.log('Fetching user profile...');
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No authenticated user found');
          return null;
        }

        const { data: profile, error } = await supabase
          .from('Practitioners')
          .select('id, full_name, avatar_url, role, subscription_tier')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('User profile fetch error:', error);
          throw new Error(error.message || 'Failed to fetch user profile');
        }

        console.log('User profile fetched successfully:', profile);
        return profile;
      } catch (error) {
        console.error('Error in useUserProfileQuery:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.log(`User profile query retry ${failureCount}:`, error);
      return failureCount < 2;
    },
  });
};
