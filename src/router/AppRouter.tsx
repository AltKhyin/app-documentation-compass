
// ABOUTME: Main application router with enhanced stability and proper shell integration.

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import AppShell from '@/components/shell/AppShell';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load pages to prevent bundling issues
const Index = React.lazy(() => import('@/pages/Index'));
const CollectionPage = React.lazy(() => import('@/pages/CollectionPage'));
const CommunityPage = React.lazy(() => import('@/pages/CommunityPage'));
const CommunityPostPage = React.lazy(() => import('@/pages/CommunityPostPage'));
const CreatePostPage = React.lazy(() => import('@/pages/CreatePostPage'));
const ReviewDetailPage = React.lazy(() => import('@/pages/ReviewDetailPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const SavedPostsPage = React.lazy(() => import('@/pages/SavedPostsPage'));
const CommunityInfoPage = React.lazy(() => import('@/pages/CommunityInfoPage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignupPage = React.lazy(() => import('@/pages/SignupPage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const UnauthorizedPage = React.lazy(() => import('@/pages/UnauthorizedPage'));

// Consistent loading fallback for all pages
const PageLoadingFallback = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  </div>
);

const AppRouter = () => {
  const { session, isLoading } = useAuthStore();

  // Show consistent loading state during auth initialization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppShell>
          <PageLoadingFallback />
        </AppShell>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication routes - no shell wrapper */}
        <Route path="/auth" element={
          <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-48" /></div>}>
            <AuthPage />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-48" /></div>}>
            <LoginPage />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-48" /></div>}>
            <SignupPage />
          </Suspense>
        } />
        <Route path="/unauthorized" element={
          <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-48" /></div>}>
            <UnauthorizedPage />
          </Suspense>
        } />

        {/* Protected routes with consistent shell wrapper */}
        <Route path="/*" element={
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/acervo" element={
                  <ProtectedRoute>
                    <CollectionPage />
                  </ProtectedRoute>
                } />
                <Route path="/community" element={
                  <ProtectedRoute>
                    <CommunityPage />
                  </ProtectedRoute>
                } />
                <Route path="/community/info" element={
                  <ProtectedRoute>
                    <CommunityInfoPage />
                  </ProtectedRoute>
                } />
                <Route path="/community/create" element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                } />
                <Route path="/community/:postId" element={
                  <ProtectedRoute>
                    <CommunityPostPage />
                  </ProtectedRoute>
                } />
                <Route path="/reviews/:id" element={
                  <ProtectedRoute>
                    <ReviewDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/saved" element={
                  <ProtectedRoute>
                    <SavedPostsPage />
                  </ProtectedRoute>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </AppShell>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
