
// ABOUTME: Main application router with standardized English route names while preserving Portuguese URLs for users

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedAppRoute } from '../components/routes/ProtectedAppRoute';
import AppShell from '../components/shell/AppShell';

// Pages - standardized English names for internal consistency
import Index from '../pages/Index';
import AuthPage from '../pages/AuthPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import CommunityPage from '../pages/CommunityPage';
import CollectionPage from '../pages/CollectionPage';
import ProfilePage from '../pages/ProfilePage';
import ReviewDetailPage from '../pages/ReviewDetailPage';
import CommunityPostPage from '../pages/CommunityPostPage';
import CreatePostPage from '../pages/CreatePostPage';
import CommunityInfoPage from '../pages/CommunityInfoPage';
import SavedPostsPage from '../pages/SavedPostsPage';
import NotFound from '../pages/NotFound';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import DebugSignupPage from '../pages/DebugSignupPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/debug-signup" element={<DebugSignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected application routes with Portuguese URLs preserved for users */}
        <Route path="/" element={
          <ProtectedAppRoute>
            <AppShell />
          </ProtectedAppRoute>
        }>
          <Route index element={<Index />} />
          
          {/* Community routes - Portuguese URLs preserved */}
          <Route path="comunidade" element={<CommunityPage />} />
          <Route path="comunidade/:postId" element={<CommunityPostPage />} />
          <Route path="comunidade/criar" element={<CreatePostPage />} />
          <Route path="comunidade/info" element={<CommunityInfoPage />} />
          
          {/* Collection route - Portuguese URL preserved */}
          <Route path="acervo" element={<CollectionPage />} />
          
          {/* Profile route - Portuguese URL preserved */}
          <Route path="perfil" element={<ProfilePage />} />
          
          {/* Review detail route */}
          <Route path="review/:slug" element={<ReviewDetailPage />} />
          
          {/* Saved posts route */}
          <Route path="salvos" element={<SavedPostsPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
