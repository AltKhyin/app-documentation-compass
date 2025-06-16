
// ABOUTME: Legacy wrapper for notification count data - now uses consolidated data context.
import { useAppData } from '@/contexts/AppDataContext';

/**
 * @deprecated Use useAppData() from AppDataContext instead.
 * This hook is kept for backward compatibility only.
 */
export const useNotificationCountQuery = () => {
  const { notificationCount, isLoading, isError, error } = useAppData();

  return {
    data: notificationCount,
    isLoading,
    isError,
    error,
  };
};
