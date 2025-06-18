

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
import AcervoPage from './pages/AcervoPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ComunidadePage from './pages/ComunidadePage';
import PerfilPage from './pages/PerfilPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DebugSignupPage from './pages/DebugSignupPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFound from './pages/NotFound';
import AppShell from './components/shell/AppShell';
import AuthSessionProvider from './components/auth/AuthSessionProvider';
import PWAProvider from './components/pwa/PWAProvider';
import { CustomThemeProvider } from './components/theme/CustomThemeProvider';
import { AppDataProvider } from './contexts/AppDataContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PWAProvider>
        <AuthSessionProvider>
          <AppDataProvider>
            <CustomThemeProvider>
              <ErrorBoundary>
                <BrowserRouter>
                  <Routes>
                    {/* Authentication routes - outside AppShell */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/debug-signup" element={<DebugSignupPage />} />
                    
                    {/* Main app routes - inside AppShell */}
                    <Route path="/*" element={
                      <AppShell>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/acervo" element={<AcervoPage />} />
                          <Route path="/reviews/:slug" element={<ReviewDetailPage />} />
                          <Route path="/comunidade" element={<ComunidadePage />} />
                          <Route path="/perfil" element={<PerfilPage />} />
                          <Route path="/unauthorized" element={<UnauthorizedPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AppShell>
                    } />
                  </Routes>
                </BrowserRouter>
                <Toaster />
              </ErrorBoundary>
            </CustomThemeProvider>
          </AppDataProvider>
        </AuthSessionProvider>
      </PWAProvider>
    </QueryClientProvider>
  );
}

export default App;
