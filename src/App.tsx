

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthSessionProvider from './components/auth/AuthSessionProvider';
import AuthThemeProvider from './components/auth/AuthThemeProvider';
import PWAProvider from './components/pwa/PWAProvider';
import { AppDataProvider } from './contexts/AppDataContext';
import { useAuthStore } from './store/auth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AcervoPage from './pages/AcervoPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ComunidadePage from './pages/ComunidadePage';
import CommunityInfoPage from './pages/CommunityInfoPage';
import AppShell from './components/shell/AppShell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading indicator
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <AuthThemeProvider>
          <PWAProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignupPage />} />

                {/* Protected routes - wrapped with AppDataProvider */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppDataProvider>
                      <AppShell>
                        <div>Home Page - Coming Soon</div>
                      </AppShell>
                    </AppDataProvider>
                  </ProtectedRoute>
                } />
                <Route path="/acervo" element={
                  <ProtectedRoute>
                    <AppDataProvider>
                      <AppShell>
                        <AcervoPage />
                      </AppShell>
                    </AppDataProvider>
                  </ProtectedRoute>
                } />
                <Route path="/reviews/:id" element={
                  <ProtectedRoute>
                    <AppDataProvider>
                      <AppShell>
                        <ReviewDetailPage />
                      </AppShell>
                    </AppDataProvider>
                  </ProtectedRoute>
                } />
                
                {/* Community routes */}
                <Route path="/comunidade" element={
                  <ProtectedRoute>
                    <AppDataProvider>
                      <AppShell>
                        <ComunidadePage />
                      </AppShell>
                    </AppDataProvider>
                  </ProtectedRoute>
                } />
                
                <Route path="/comunidade/info" element={
                  <ProtectedRoute>
                    <AppDataProvider>
                      <AppShell>
                        <CommunityInfoPage />
                      </AppShell>
                    </AppDataProvider>
                  </ProtectedRoute>
                } />
                
                {/* Default route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </PWAProvider>
        </AuthThemeProvider>
      </AuthSessionProvider>
    </QueryClientProvider>
  );
}

export default App;

