
// ABOUTME: A component to protect routes that require authentication.
import { useAuthStore } from '@/store/auth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuthStore();
  const location = useLocation();

  console.log('ProtectedRoute state:', { session: !!session, isLoading });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    console.log('No session, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Session found, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
