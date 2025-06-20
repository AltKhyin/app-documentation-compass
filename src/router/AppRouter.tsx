
// ABOUTME: Main application router configuration with protected routes and lazy loading.

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AppShell from '../components/shell/AppShell';
import { CommunityLoadingState } from '../components/community/CommunityLoadingState';

// Lazy loading for better performance
const Index = React.lazy(() => import('../pages/Index'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const SignupPage = React.lazy(() => import('../pages/SignupPage'));
const CommunityPage = React.lazy(() => import('../pages/CommunityPage'));
const CommunityPostPage = React.lazy(() => import('../pages/CommunityPostPage'));
const CreatePostPage = React.lazy(() => import('../pages/CreatePostPage'));
const CollectionPage = React.lazy(() => import('../pages/CollectionPage'));
const ReviewDetailPage = React.lazy(() => import('../pages/ReviewDetailPage'));
const SavedPostsPage = React.lazy(() => import('../pages/SavedPostsPage'));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'));
const CommunityInfoPage = React.lazy(() => import('../pages/CommunityInfoPage'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

export default function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<CommunityLoadingState variant="page" />}>
        <Routes>
          {/* Public Routes - No AppShell */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes - Wrapped with AppShell */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Define protected routes that will be rendered inside AppShell
export const protectedRoutes = (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/comunidade" element={<CommunityPage />} />
    <Route path="/comunidade/:postId" element={<CommunityPostPage />} />
    <Route path="/comunidade/criar" element={<CreatePostPage />} />
    <Route path="/acervo" element={<CollectionPage />} />
    <Route path="/review/:slug" element={<ReviewDetailPage />} />
    <Route path="/salvos" element={<SavedPostsPage />} />
    <Route path="/perfil" element={<ProfilePage />} />
    <Route path="/comunidade/sobre" element={<CommunityInfoPage />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);
