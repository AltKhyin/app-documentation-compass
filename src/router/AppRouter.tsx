
// ABOUTME: Main application router configuration with all community routes properly defined.

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../components/shell/AppShell';
import { ProtectedAppRoute } from '../components/routes/ProtectedAppRoute';
import HomePage from '../pages/HomePage';
import AcervoPage from '../pages/AcervoPage';
import CommunityPage from '../pages/CommunityPage';
import CommunityPostPage from '../pages/CommunityPostPage';
import CreatePostPage from '../pages/CreatePostPage';
import ProfilePage from '../pages/ProfilePage';
import ReviewDetailPage from '../pages/ReviewDetailPage';
import AuthPage from '../pages/AuthPage';
import { ErrorBoundary } from '../components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/',
    element: (
      <ProtectedAppRoute>
        <AppShell />
      </ProtectedAppRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'acervo',
        element: <AcervoPage />
      },
      {
        path: 'comunidade',
        children: [
          {
            index: true,
            element: <CommunityPage />
          },
          {
            path: 'criar',
            element: <CreatePostPage />
          },
          {
            path: ':postId',
            element: <CommunityPostPage />
          }
        ]
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'reviews/:slug',
        element: <ReviewDetailPage />
      }
    ]
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
