import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthSessionProvider } from './providers/AuthSessionProvider';
import { AuthThemeProvider } from './providers/AuthThemeProvider';
import { PWAProvider } from './providers/PWAProvider';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AcervoPage from './pages/AcervoPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import EditorPage from './pages/EditorPage';
import ManagementPage from './pages/ManagementPage';
import ComunidadePage from './pages/ComunidadePage';
import CommunityInfoPage from './pages/CommunityInfoPage';
import DesktopShell from './components/shell/DesktopShell';
import MobileShell from './components/shell/MobileShell';
import { useIsMobile } from './hooks/use-mobile';

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
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading indicator
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// AppShell component
const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <MobileShell>{children}</MobileShell>
      ) : (
        <DesktopShell>{children}</DesktopShell>
      )}
    </>
  );
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
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppShell>
                      <HomePage />
                    </AppShell>
                  </ProtectedRoute>
                } />
                <Route path="/acervo" element={
                  <ProtectedRoute>
                    <AppShell>
                      <AcervoPage />
                    </AppShell>
                  </ProtectedRoute>
                } />
                <Route path="/reviews/:id" element={
                  <ProtectedRoute>
                    <AppShell>
                      <ReviewDetailPage />
                    </AppShell>
                  </ProtectedRoute>
                } />
                <Route path="/editor" element={
                  <ProtectedRoute>
                    <AppShell>
                      <EditorPage />
                    </AppShell>
                  </ProtectedRoute>
                } />
                <Route path="/management" element={
                  <ProtectedRoute>
                    <AppShell>
                      <ManagementPage />
                    </AppShell>
                  </ProtectedRoute>
                } />
                
                {/* Community routes */}
                <Route path="/comunidade" element={
                  <ProtectedRoute>
                    <AppShell>
                      <ComunidadePage />
                    </AppShell>
                  </ProtectedRoute>
                } />
                
                <Route path="/comunidade/info" element={
                  <ProtectedRoute>
                    <AppShell>
                      <CommunityInfoPage />
                    </AppShell>
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
