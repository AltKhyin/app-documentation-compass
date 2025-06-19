
// ABOUTME: Enhanced component to protect routes with authentication and role-based access control with timeout handling.
import { useAuthStore } from '../../store/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { UserProfile } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserProfile['role'];
}

// Role hierarchy: admin > moderator > practitioner
const roleHierarchy: Record<UserProfile['role'], number> = {
  admin: 3,
  moderator: 2,
  practitioner: 1,
  editor: 2, // Same level as moderator
};

const checkRolePermission = (userRole: UserProfile['role'], requiredRole: UserProfile['role']): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

const ProtectedRoute = ({ children, requiredRole = 'practitioner' }: ProtectedRouteProps) => {
  const { session, isLoading } = useAuthStore();
  const location = useLocation();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Implement timeout to prevent infinite loading states
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !session) {
        console.warn('Authentication timeout - redirecting to login');
        setHasTimedOut(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading, session]);

  console.log('ProtectedRoute state:', { 
    session: !!session, 
    isLoading, 
    hasTimedOut,
    requiredRole,
    userRole: session?.user?.app_metadata?.role 
  });

  // Handle timeout case
  if (hasTimedOut || (!isLoading && !session)) {
    console.log('No session or timeout, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading state with timeout protection
  if (isLoading && !hasTimedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // At this point we should have a session
  if (!session) {
    console.log('Unexpected: no session after loading complete');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions for protected routes
  const userRole = (session.user?.app_metadata?.role as UserProfile['role']) || 'practitioner';
  const hasPermission = checkRolePermission(userRole, requiredRole);

  if (!hasPermission) {
    console.log('Insufficient permissions, redirecting to unauthorized');
    return <Navigate to="/unauthorized" state={{ requiredRole, userRole }} replace />;
  }

  console.log('Session and permissions valid, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
