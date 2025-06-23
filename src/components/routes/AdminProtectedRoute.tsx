
// ABOUTME: Route protection component for admin-only pages with role-based access control

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const AdminProtectedRoute = ({ 
  children, 
  requiredRoles = ['admin', 'editor'] 
}: AdminProtectedRouteProps) => {
  const { user } = useAuthStore();
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const userRole = user.app_metadata?.role;
  if (!userRole || !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
