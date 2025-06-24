
// ABOUTME: Profile page data fetching hook following decoupled architecture pattern

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from './useUserProfileQuery';

interface ProfilePageData {
  userProfile: UserProfile | null;
  isOwnProfile: boolean;
}

export const useProfilePageQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['profile-page', userId || 'me'],
    queryFn: async (): Promise<ProfilePageData> => {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const targetUserId = userId || user.id;
      const isOwnProfile = targetUserId === user.id;

      // Fetch profile data
      const { data: profile, error } = await supabase
        .from('Practitioners')
        .select(`
          id,
          full_name,
          avatar_url,
          role,
          subscription_tier,
          profession,
          affiliation,
          biography,
          contribution_score,
          created_at
        `)
        .eq('id', targetUserId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }

      return {
        userProfile: profile,
        isOwnProfile
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.message?.includes('authentication')) {
        return false;
      }
      return failureCount < 2;
    }
  });
};

export type { ProfilePageData };
