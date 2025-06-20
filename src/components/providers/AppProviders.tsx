
// ABOUTME: Unified provider component that wraps all necessary context providers in correct order.

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthSessionProvider from '../auth/AuthSessionProvider';
import { CustomThemeProvider } from '../theme/CustomThemeProvider';
import PWAProvider from '../pwa/PWAProvider';
import { AppDataProvider } from '../../contexts/AppDataContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <CustomThemeProvider defaultTheme="dark" storageKey="evidens-theme">
          <PWAProvider>
            <AppDataProvider>
              {children}
            </AppDataProvider>
          </PWAProvider>
        </CustomThemeProvider>
      </AuthSessionProvider>
    </QueryClientProvider>
  );
};
