
// ABOUTME: Main application router configuration with all community routes properly defined.

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../components/shell/AppShell';
import { ProtectedAppRoute } from '../components/routes/ProtectedAppRoute';
import Index from '../pages/Index';
import AcervoPage from '../pages/AcervoPage';
import ComunidadePage from '../pages/ComunidadePage';
import CommunityPostPage from '../pages/CommunityPostPage';
import CreatePostPage from '../pages/CreatePostPage';
import PerfilPage from '../pages/PerfilPage'; // FIXED: Use correct file name
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
        element: <Index />
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
            element: <ComunidadePage />
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
        element: <PerfilPage /> // FIXED: Use correct component name
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
