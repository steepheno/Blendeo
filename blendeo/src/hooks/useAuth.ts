// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const store = useAuthStore();

  const handleSignin = async (email: string, password: string) => {
    try {
      await store.signin({ email, password });
      navigate("/dashboard"); // 로그인 성공 시 대시보드로 이동
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await store.googleLogin();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await store.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    signin: handleSignin,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
  };
};

// Additional selectors for convenient access
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
