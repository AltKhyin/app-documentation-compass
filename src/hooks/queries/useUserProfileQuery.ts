
// ABOUTME: Legacy wrapper for user profile data - now uses consolidated data context.
import { useAppData } from '@/contexts/AppDataContext';

/**
 * @deprecated Use useAppData() from AppDataContext instead.
 * This hook is kept for backward compatibility only.
 */
export const useUserProfileQuery = () => {
  const { userProfile, isLoading, isError, error } = useAppData();

  return {
    data: userProfile,
    isLoading,
    isError,
    error,
  };
};
