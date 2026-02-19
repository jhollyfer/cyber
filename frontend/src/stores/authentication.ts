/* eslint-disable @typescript-eslint/explicit-function-return-type */
// DESVIO INTENCIONAL (Skill 023): Este store mistura state management com API
// calls (signIn, signUp, signOut, fetchUser). A decisao de manter API calls
// embutidas no store foi tomada intencionalmente porque:
// 1. Auth e um caso especial onde o state e a API estao fortemente acoplados
// 2. O store precisa ser acessado fora de componentes (route guards via getState())
// 3. Separar em mutation hooks adicionaria complexidade sem beneficio real aqui
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { api } from '@/lib/api';
import type { User } from '@/lib/interfaces';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  fetchUser: () => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
  signUp: (name: string, phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (val: boolean) => set({ hasHydrated: val }),

      fetchUser: async () => {
        try {
          set({ isLoading: true });
          const { data } = await api.get<User>('/authentication/me');
          set({ user: data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      signIn: async (phone: string, password: string) => {
        await api.post('/authentication/sign-in', { phone, password });
        const { data } = await api.get<User>('/authentication/me');
        set({ user: data, isAuthenticated: true });
      },

      signUp: async (name: string, phone: string, password: string) => {
        await api.post('/authentication/sign-up', { name, phone, password });
        const { data } = await api.get<User>('/authentication/me');
        set({ user: data, isAuthenticated: true });
      },

      signOut: async () => {
        try {
          await api.post('/authentication/sign-out');
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      clear: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'cyber-guardian-auth',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
