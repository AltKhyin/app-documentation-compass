
// ABOUTME: Zustand store for managing authentication state - TEMPORARILY DISABLED for emergency stabilization.

import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  initialize: () => () => void;
};

/**
 * EMERGENCY STABILIZATION MODE:
 * This auth store is temporarily disabled to isolate React context issues.
 * Use SimpleAuthProvider in src/components/auth/SimpleAuthProvider.tsx instead.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  setSession: (session) => {
    console.warn('AuthStore: DISABLED during emergency stabilization');
  },
  initialize: () => {
    console.warn('AuthStore: DISABLED during emergency stabilization');
    return () => {}; // No-op cleanup function
  },
}));

// Export a warning for any existing usage
export const EMERGENCY_MODE_WARNING = 'Auth store disabled during emergency stabilization. Use SimpleAuthProvider instead.';
