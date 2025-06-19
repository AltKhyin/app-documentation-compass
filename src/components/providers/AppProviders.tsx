
// ABOUTME: Unified provider component that wraps all necessary context providers in correct order.

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthSessionProvider from '../auth/AuthSessionProvider';
import { CustomThemeProvider } from '../theme/CustomThemeProvider';
import PWAProvider from '../pwa/PWAProvider';

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
            {children}
          </PWAProvider>
        </CustomThemeProvider>
      </AuthSessionProvider>
    </QueryClientProvider>
  );
};
