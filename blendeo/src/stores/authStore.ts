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
  token: string | null;
  isAuthenticated: boolean;
  signin: (data: SigninRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: JSON.parse(localStorage.getItem("user") || "null"),
      token: localStorage.getItem("token"),
      isAuthenticated: !!localStorage.getItem("user"),

      signin: async (data) => {
        try {
          const response = await authApi.signin(data);
          if (response) {
            set({
              user: response,
              token: response.token || null,
              isAuthenticated: true, // 로그인 성공시 true로 설정
            });
            localStorage.setItem("user", JSON.stringify(response));
            if (response.token) {
              localStorage.setItem("token", response.token);
            }
          }
        } catch (error) {
          console.error("Signin failed:", error);
          throw error;
        }
      },

      signup: async (data) => {
        try {
          const response: AuthResponse = await authApi.signup(data);
          set({
            user: response,
            token: response.token || null,
            isAuthenticated: true, // 회원가입 성공시 true로 설정
          });
          localStorage.setItem("user", JSON.stringify(response));
          if (response.token) {
            localStorage.setItem("token", response.token);
          }
        } catch (error) {
          console.error("Signup failed:", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          // 항상 로컬 상태를 초기화
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    { name: "auth-store" }
  )
);
