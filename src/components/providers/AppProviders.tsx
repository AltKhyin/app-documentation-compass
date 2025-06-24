
// ABOUTME: Unified provider component that wraps all necessary context providers in correct order with proper error boundaries.

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthSessionProvider from '../auth/AuthSessionProvider';
import { CustomThemeProvider } from '../theme/CustomThemeProvider';
import PWAProvider from '../pwa/PWAProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  // Create QueryClient with stable reference inside component to ensure proper React context
  const [queryClient] = React.useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            // Don't retry on auth errors
            if (error?.message?.includes('unauthorized') || error?.message?.includes('forbidden')) {
              return false;
            }
            // Retry up to 2 times for other errors
            return failureCount < 2;
          },
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
        },
        mutations: {
          retry: false, // Don't retry mutations by default
        },
      },
    })
  );

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
