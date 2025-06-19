
// ABOUTME: Main application entry point with provider composition and routing.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthSessionProvider } from './components/auth/AuthSessionProvider';
import { AuthThemeProvider } from './components/auth/AuthThemeProvider';
import { PWAProvider } from './components/pwa/PWAProvider';
import { Toaster } from './components/ui/sonner';
import { AppRouter } from './router/AppRouter';
import { AppProviders } from './components/providers/AppProviders';
import './App.css';

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <AuthThemeProvider>
          <PWAProvider>
            <AppProviders>
              <AppRouter />
              <Toaster position="top-right" />
            </AppProviders>
          </PWAProvider>
        </AuthThemeProvider>
      </AuthSessionProvider>
    </QueryClientProvider>
  );
}

export default App;
