
// ABOUTME: Updated App component with proper provider hierarchy and consistent routing

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './components/providers/AppProviders';
import { Toaster } from './components/ui/toaster';

// Pages
import HomePage from './pages/HomePage';
import ComunidadePage from './pages/ComunidadePage';
import CommunityInfoPage from './pages/CommunityInfoPage';
import SubmitPage from './pages/community/SubmitPage';
import AcervoPage from './pages/AcervoPage';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/PerfilPage';

// Protected Route Wrapper
import { ProtectedAppRoute } from './components/routes/ProtectedAppRoute';

const App = () => {
  return (
    <AppProviders>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes - All wrapped with ProtectedAppRoute */}
            <Route path="/" element={
              <ProtectedAppRoute>
                <HomePage />
              </ProtectedAppRoute>
            } />
            <Route path="/comunidade" element={
              <ProtectedAppRoute>
                <ComunidadePage />
              </ProtectedAppRoute>
            } />
            <Route path="/comunidade/info" element={
              <ProtectedAppRoute>
                <CommunityInfoPage />
              </ProtectedAppRoute>
            } />
            <Route path="/community/submit" element={
              <ProtectedAppRoute>
                <SubmitPage />
              </ProtectedAppRoute>
            } />
            <Route path="/acervo" element={
              <ProtectedAppRoute>
                <AcervoPage />
              </ProtectedAppRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedAppRoute>
                <PerfilPage />
              </ProtectedAppRoute>
            } />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </AppProviders>
  );
};

export default App;
