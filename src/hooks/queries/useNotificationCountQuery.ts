
// ABOUTME: Fetches the count of unread notifications for the current user.
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth';

const fetchNotificationCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('Notifications')
    .select('*', { count: 'exact', head: true })
    .eq('practitioner_id', userId)
    .eq('is_read', false);

  if (error) {
    throw error;
  }

  return count ?? 0;
};

export const useNotificationCountQuery = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['notificationCount', userId],
    queryFn: () => {
        if (!userId) {
            return 0;
        }
        return fetchNotificationCount(userId);
    },
    enabled: !!userId,
  });
};
