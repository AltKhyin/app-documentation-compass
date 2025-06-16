
// ABOUTME: Global context for consolidated app data including user profile and homepage data.

import React, { createContext, useContext, ReactNode } from 'react';
import { useConsolidatedHomepageFeedQuery, UserProfile } from '../../packages/hooks/useHomepageFeedQuery';

interface AppDataContextType {
  userProfile: UserProfile | null;
  notificationCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
  children: ReactNode;
}

/**
 * Global provider for consolidated app data.
 * Fetches user profile, notification count, and homepage data in a single request.
 * Follows [DOC_6] data fetching strategy to minimize API calls.
 */
export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useConsolidatedHomepageFeedQuery();

  const contextValue: AppDataContextType = {
    userProfile: data?.userProfile || null,
    notificationCount: data?.notificationCount || 0,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

/**
 * Hook to access consolidated app data including user profile and notifications.
 * Replaces individual useUserProfileQuery and useNotificationCountQuery hooks.
 */
export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
