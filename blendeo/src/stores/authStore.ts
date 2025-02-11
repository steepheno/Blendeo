// src/stores/authStore.ts
import { useEffect } from "react";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import * as authApi from "@/api/auth";
import type { SigninRequest, SignupRequest } from "@/types/api/auth";
import { User } from "@/types/api/user";
import { getUser } from "@/api/user";

interface AuthStore {
  userId: number | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  signin: (data: SigninRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  fetchUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        userId: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setUser: (user) => set({ user }),

        fetchUserData: async () => {
          const { userId } = get();
          if (!userId) return;

          try {
            const response = await getUser(userId);
            if (response) {
              set({
                user: response,
                isAuthenticated: true,
              });
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            set({
              user: null,
              userId: null,
              isAuthenticated: false,
            });
          }
        },

        signin: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authApi.signin(data);
            if (response) {
              set({
                userId: response.id,
                isAuthenticated: true,
                isLoading: false,
              });
              // Fetch user data immediately after signin
              await get().fetchUserData();
            }
          } catch (error) {
            const err = error as Error;
            set({ error: err.message, isLoading: false });
            console.error("Signin failed:", error);
            throw error;
          }
        },

        signup: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authApi.signup(data);
            set({
              user: response,
              isAuthenticated: true,
              isLoading: false,
            });

            await get().fetchUserData();
          } catch (error) {
            const err = error as Error;
            set({ error: err.message, isLoading: false });
            console.error("Signup failed:", error);
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true, error: null });
          try {
            await authApi.logout();
          } catch (error) {
            const err = error as Error;
            set({ error: err.message });
            console.error("Logout failed:", error);
          } finally {
            set({
              userId: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },

        googleLogin: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await authApi.signin({
              email: "",
              password: "",
            });
            set({
              user: response,
              isAuthenticated: true,
              isLoading: false,
            });
            await get().fetchUserData();
          } catch (error) {
            const err = error as Error;
            set({ error: err.message, isLoading: false });
            throw error;
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage), // window.sessionStorage로 명시적 지정
        partialize: (state: AuthStore) => ({
          userId: state.userId,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

// App.tsx나 적절한 상위 컴포넌트에서 사용할 초기화 훅
export const useInitializeAuth = () => {
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (isAuthenticated && userId) {
      console.log("Initializing auth with userId:", userId);
      fetchUserData().catch(console.error);
    }
  }, [isAuthenticated, userId, fetchUserData]);
};

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
