
// ABOUTME: Minimal unified provider component for emergency stabilization with consistent React imports and PWA support.

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomThemeProvider } from '../theme/CustomThemeProvider';
import PWAProvider from '../pwa/PWAProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

// Create QueryClient with stable reference - emergency minimal configuration
const queryClient = new QueryClient({
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
});

export const AppProviders = ({ children }: AppProvidersProps) => {
  console.log('AppProviders: Emergency stabilization mode with PWA support - minimal providers');
  
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider defaultTheme="dark" storageKey="evidens-theme">
        <PWAProvider>
          {children}
        </PWAProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};
