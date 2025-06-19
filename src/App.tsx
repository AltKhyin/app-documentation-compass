
// ABOUTME: Updated App component with new /community/submit route

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { CustomThemeProvider } from './components/theme/CustomThemeProvider';
import { PWAProvider } from './components/pwa/PWAProvider';

// Pages
import HomePage from './pages/HomePage';
import ComunidadePage from './pages/ComunidadePage';
import CommunityInfoPage from './pages/CommunityInfoPage';
import SubmitPage from './pages/community/SubmitPage';
import AcervoPage from './pages/AcervoPage';
import LoginPage from './pages/LoginPage';

// Layout Components
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider defaultTheme="dark" storageKey="evidens-ui-theme">
        <PWAProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes with App Shell */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AppShell>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/comunidade" element={<ComunidadePage />} />
                        <Route path="/comunidade/info" element={<CommunityInfoPage />} />
                        <Route path="/community/submit" element={<SubmitPage />} />
                        <Route path="/acervo" element={<AcervoPage />} />
                      </Routes>
                    </AppShell>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </PWAProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
