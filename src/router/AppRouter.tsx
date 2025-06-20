// ABOUTME: Main application router with decoupled data providers scoped to specific routes.

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthSessionProvider } from '@/components/auth/AuthSessionProvider';
import { ProtectedAppRoute } from '@/components/routes/ProtectedAppRoute';
import { AppShell } from '@/components/shell/AppShell';
import { AppDataProvider } from '@/contexts/AppDataContext';

// Pages
import Index from '@/pages/Index';
import CommunityPage from '@/pages/CommunityPage';
import CollectionPage from '@/pages/CollectionPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthSessionProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          
          {/* Protected Application Routes */}
          <Route path="/" element={
            <ProtectedAppRoute>
              <AppShell />
            </ProtectedAppRoute>
          }>
            {/* Homepage with scoped data provider */}
            <Route index element={
              <AppDataProvider>
                <Index />
              </AppDataProvider>
            } />
            
            {/* Other pages without global data provider */}
            <Route path="comunidade" element={<CommunityPage />} />
            <Route path="acervo" element={<CollectionPage />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthSessionProvider>
    </BrowserRouter>
  );
};
