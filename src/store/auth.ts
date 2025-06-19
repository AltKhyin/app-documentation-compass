
// ABOUTME: Zustand store for authentication state management with improved error handling and timeout protection.

import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      console.log('Initializing auth store...');
      set({ isLoading: true, error: null });

      // Get initial session with timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session fetch timeout')), 8000)
      );

      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Auth session error:', error);
        set({ 
          session: null, 
          user: null, 
          isLoading: false, 
          error: error.message 
        });
        return;
      }

      console.log('Initial session:', session ? 'Found' : 'None');
      set({ 
        session, 
        user: session?.user || null, 
        isLoading: false,
        error: null 
      });

      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event, session ? 'Session exists' : 'No session');
          
          // Defer state updates to prevent race conditions
          setTimeout(() => {
            set({ 
              session, 
              user: session?.user || null, 
              isLoading: false,
              error: null 
            });
          }, 0);
        }
      );

      // Store cleanup function globally for later use
      (window as any).__authCleanup = () => {
        subscription?.unsubscribe();
      };

    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        session: null, 
        user: null, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ 
        session: null, 
        user: null, 
        isLoading: false,
        error: null 
      });
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Sign out failed',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// Initialize auth on store creation
useAuthStore.getState().initialize();
