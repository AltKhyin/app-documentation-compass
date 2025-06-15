
// ABOUTME: Zustand store for managing authentication state, including session, user, and practitioner profile.
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Practitioner = Database['public']['Tables']['Practitioners']['Row'];

type AuthState = {
  session: Session | null;
  user: User | null;
  practitioner: Practitioner | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  fetchPractitioner: (userId: string) => Promise<void>;
  initialize: () => () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  practitioner: null,
  isLoading: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  fetchPractitioner: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('Practitioners')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }
      set({ practitioner: data });
    } catch (error) {
      console.error('Error fetching practitioner:', error);
      set({ practitioner: null });
    }
  },
  initialize: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          get().fetchPractitioner(session.user.id);
        } else {
          set({ practitioner: null });
        }
        set({ isLoading: false });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  },
}));
