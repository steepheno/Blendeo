// src/stores/authStore.ts
import React from "react";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import * as authApi from "@/api/auth";
import type {
  SigninRequest,
  SignupRequest,
} from "@/types/api/auth";
import { User } from "@/types/api/user";
import { getUser } from "@/api/user";
import { AuthResponse } from "@/types/api/auth";

const transformAuthResponse = (response: AuthResponse): User => {
  return {
    ...response,
    instruments: response.instruments || []  // undefined일 경우 빈 배열 할당
  };
};

interface AuthStore {
  userId: number | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean; // 추가: 스토어 hydration 상태

  signin: (data: SigninRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  fetchUserData: () => Promise<void>;
  setHydrated: (state: boolean) => void; // 추가: hydration 상태 설정
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
        isHydrated: false, // 초기값 설정

        setHydrated: (state) => set({ isHydrated: state }),

        setUser: (user) => set({ user }),

        fetchUserData: async () => {
          const { userId } = get();
          if (!userId) return;

          set({ isLoading: true });
          try {
            const response = await getUser(userId);
            if (response) {
              set({
                user: response,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            set({ 
              user: null, 
              userId: null,
              isAuthenticated: false,
              isLoading: false
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
              user: transformAuthResponse(response),
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
              user: transformAuthResponse(response),
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
        storage: createJSONStorage(() => localStorage),
        partialize: (state: AuthStore) => ({
          userId: state.userId,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);

          if (state?.userId) {
            state?.fetchUserData();
          }
        },
      }
    )
  )
);

export const useInitializeAuth = () => {
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isLoading = useAuthStore((state) => state.isLoading);

  React.useEffect(() => {
    if (isHydrated && userId && !user) {
      fetchUserData();
    }
  }, [isHydrated, userId, user, fetchUserData]);

  // userId가 있는데 user가 없으면 아직 초기화 중인 상태
  return {
    isInitializing: !isHydrated || isLoading || (userId && !user)
  };
};

// 인증 상태를 체크하는 새로운 훅
export const useAuthGuard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { isInitializing } = useInitializeAuth();

  return {
    isAuthorized: isAuthenticated && !!user,
    isInitializing
  };
};

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);