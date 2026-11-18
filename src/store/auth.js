import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const createAuthStore = () => create(
  persist(
    (set) => ({
      token: null,
      username: null,
      login: (token, username) => set({ token, username }),
      logout: () => set({ token: null, username: null }),
    }),
    { name: 'auth-storage' }
  )
);