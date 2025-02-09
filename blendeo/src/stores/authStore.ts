// src/stores/authStore.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import * as authApi from "@/api/auth";
import type {
  AuthResponse,
  SigninRequest,
  SignupRequest,
} from "@/types/api/auth";

interface AuthStore {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  signin: (data: SigninRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthResponse | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: JSON.parse(localStorage.getItem("user") || "null"),
        token: localStorage.getItem("token"),
        isAuthenticated: !!localStorage.getItem("user"),
        isLoading: false,
        error: null,

        setUser: (user) => set({ user }),

        signin: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authApi.signin(data);
            if (response) {
              set({
                user: response,
                token: response.accessToken,
                isAuthenticated: true,
                isLoading: false,
              });
              localStorage.setItem("user", JSON.stringify(response));
              localStorage.setItem("token", response.accessToken);
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
              token: response.accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
            localStorage.setItem("user", JSON.stringify(response));
            localStorage.setItem("token", response.accessToken);
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
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({
              user: null,
              token: null,
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
              token: response.accessToken || null,
              isLoading: false,
            });
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
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "auth-store" }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
