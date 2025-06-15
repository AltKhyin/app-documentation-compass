
// ABOUTME: Fetches the public profile of the currently authenticated user.
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth';

const fetchPractitioner = async (userId: string) => {
  const { data, error } = await supabase
    .from('Practitioners')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    // Let react-query handle the error
    throw error;
  }
  return data;
};

export const useUserProfileQuery = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return fetchPractitioner(userId);
    },
    enabled: !!userId,
  });
};
