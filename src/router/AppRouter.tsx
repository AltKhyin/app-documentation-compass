
// ABOUTME: Main application router configuration with protected routes and lazy loading.

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
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
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <Index />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/comunidade" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <CommunityPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/comunidade/:postId" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <CommunityPostPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/comunidade/criar" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <CreatePostPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/acervo" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <CollectionPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/review/:slug" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <ReviewDetailPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/salvos" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <SavedPostsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/comunidade/sobre" 
            element={
              <ProtectedRoute requiredRole="practitioner">
                <CommunityInfoPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
