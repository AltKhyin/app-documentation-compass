
// ABOUTME: Homepage-specific data context provider for consolidated homepage data only.
import React, { createContext, useContext } from 'react';
import { useConsolidatedHomepageFeedQuery } from '../../packages/hooks/useHomepageFeedQuery';
import type { ConsolidatedHomepageData, UserProfile } from '../../packages/hooks/useHomepageFeedQuery';

interface HomepageDataContextType {
  data: ConsolidatedHomepageData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  userProfile: UserProfile | null;
  notificationCount: number;
}

const HomepageDataContext = createContext<HomepageDataContextType | undefined>(undefined);

export const HomepageDataProvider = ({ children }: { children: React.ReactNode }) => {
  const queryResult = useConsolidatedHomepageFeedQuery();
  
  console.log('HomepageDataProvider state:', {
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    hasData: !!queryResult.data,
    error: queryResult.error
  });

  const contextValue: HomepageDataContextType = {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    refetch: queryResult.refetch,
    userProfile: queryResult.data?.userProfile || null,
    notificationCount: queryResult.data?.notificationCount || 0,
  };

  return (
    <HomepageDataContext.Provider value={contextValue}>
      {children}
    </HomepageDataContext.Provider>
  );
};

export const useHomepageData = () => {
  const context = useContext(HomepageDataContext);
  if (context === undefined) {
    throw new Error('useHomepageData must be used within a HomepageDataProvider');
  }
  return context;
};
