
// ABOUTME: Wrapper component for protected routes with consistent app shell and data provider structure.

import React from 'react';
import ProtectedRoute from '../auth/ProtectedRoute';
import { AppDataProvider } from '../../contexts/AppDataContext';
import type { UserProfile } from '../../types';

interface ProtectedAppRouteProps {
  children: React.ReactNode;
  requiredRole?: UserProfile['role'];
}

export const ProtectedAppRoute = ({ children, requiredRole = 'practitioner' }: ProtectedAppRouteProps) => {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <AppDataProvider>
        {children}
      </AppDataProvider>
    </ProtectedRoute>
  );
};
