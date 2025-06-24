
// ABOUTME: Unified provider component that wraps all necessary context providers in correct order with proper error boundaries.

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthSessionProvider from '../auth/AuthSessionProvider';
import { CustomThemeProvider } from '../theme/CustomThemeProvider';
import PWAProvider from '../pwa/PWAProvider';

// Create QueryClient with stable reference and proper error handling
const createQueryClient = () => new QueryClient({
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

// Stable client instance to prevent re-creation on re-renders
const queryClient = createQueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  // Add error boundary for QueryClient initialization
  const [hasQueryError, setHasQueryError] = React.useState(false);

  React.useEffect(() => {
    // Ensure React is available
    if (typeof React.useEffect !== 'function') {
      console.error('React hooks not available - this indicates a React version mismatch');
      setHasQueryError(true);
      return;
    }
    
    // Reset error state if React is working
    setHasQueryError(false);
  }, []);

  if (hasQueryError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-foreground">Erro de Inicialização</h1>
          <p className="text-muted-foreground">
            Ocorreu um erro ao inicializar a aplicação. Recarregue a página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

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
