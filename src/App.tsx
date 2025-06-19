
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './components/providers/AppProviders';
import { ProtectedAppRoute } from './components/routes/ProtectedAppRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Index from './pages/Index';
import AcervoPage from './pages/AcervoPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ComunidadePage from './pages/ComunidadePage';
import CommunityInfoPage from './pages/CommunityInfoPage';
import SavedPostsPage from './pages/SavedPostsPage';
import { SubmitPage } from './pages/community/SubmitPage';
import CommunityPostPage from "./pages/CommunityPostPage";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedAppRoute>
              <Index />
            </ProtectedAppRoute>
          } />
          
          <Route path="/acervo" element={
            <ProtectedAppRoute>
              <AcervoPage />
            </ProtectedAppRoute>
          } />
          
          <Route path="/reviews/:id" element={
            <ProtectedAppRoute>
              <ReviewDetailPage />
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
          
          {/* Saved Posts Route - NEW */}
          <Route 
            path="/comunidade/salvos" 
            element={
              <ProtectedAppRoute>
                <SavedPostsPage />
              </ProtectedAppRoute>
            } 
          />
          
          {/* Community Submit Route */}
          <Route 
            path="/community/submit" 
            element={
              <ProtectedAppRoute>
                <SubmitPage />
              </ProtectedAppRoute>
            } 
          />
          
          {/* Community Post Route */}
          <Route 
            path="/comunidade/:postId" 
            element={
              <ProtectedAppRoute>
                <CommunityPostPage />
              </ProtectedAppRoute>
            } 
          />
          
          {/* Default route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
