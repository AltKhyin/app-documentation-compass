
// ABOUTME: Provider component to initialize the auth state listener on app startup.
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export const AuthSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return () => {
      unsubscribe();
    };
  }, [initialize]);

  return <>{children}</>;
};
