// src/stores/authStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as authApi from "@/api/auth";
import type {
  AuthResponse,
  SigninRequest,
  SignupRequest,
} from "@/types/api/auth";

interface AuthStore {
  user: AuthResponse | null;
  token: string | null; // token 필드 추가
  isAuthenticated: boolean;
  signin: (data: SigninRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      token: localStorage.getItem("token"), // 초기값 설정
      isAuthenticated: false,

      signin: async (data) => {
        try {
          const response = await authApi.signin(data);
          if (response) {
            set({
              user: response,
              token: null, // 새 API에서는 token이 없으므로 null로 설정
              isAuthenticated: true,
            });
            localStorage.setItem("user", JSON.stringify(response));
          }
        } catch (error) {
          console.error("Signin failed:", error);
          throw error;
        }
      },

      signup: async (data) => {
        try {
          const response: AuthResponse = await authApi.signup(data);
          if (response.token) {
            localStorage.setItem("token", response.token);
            set({
              user: response,
              token: response.token,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error("Signup failed:", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Logout failed:", error);
          throw error;
        }
      },
    }),
    { name: "auth-store" }
  )
);
