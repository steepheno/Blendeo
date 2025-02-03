// stores/useAuthStore.ts - 상태 관리 및 API 호출
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/api/auth";
import { User } from "@/types/api/user";
// import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.login(email, password);
          set({ user, isLoading: false });
        } catch (err) {
          const error = err as Error;
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      googleLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.googleLogin();
          set({ user, isLoading: false });
        } catch (err) {
          const error = err as Error;
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authApi.logout();
          set({ user: null, isLoading: false });
        } catch (err) {
          const error = err as Error;
          set({ error: error.message, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
