
// ABOUTME: TanStack Query hook for fetching current user's notification count.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';

export const useNotificationCountQuery = () => {
  return useQuery<number>({
    queryKey: ['notification-count'],
    queryFn: async (): Promise<number> => {
      console.log('Fetching notification count...');
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No authenticated user for notifications');
          return 0;
        }

        const { count, error } = await supabase
          .from('Notifications')
          .select('id', { count: 'exact' })
          .eq('practitioner_id', user.id)
          .eq('is_read', false);

        if (error) {
          console.error('Notification count fetch error:', error);
          throw new Error(error.message || 'Failed to fetch notification count');
        }

        const notificationCount = count || 0;
        console.log('Notification count fetched successfully:', notificationCount);
        return notificationCount;
      } catch (error) {
        console.error('Error in useNotificationCountQuery:', error);
        // Return 0 on error to avoid breaking the UI
        return 0;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.log(`Notification count query retry ${failureCount}:`, error);
      return failureCount < 2;
    },
  });
};
