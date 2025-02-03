import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const store = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await store.login(email, password);
      navigate("/dashboard"); // 로그인 성공 시 대시보드로 이동
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await store.googleLogin();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    store.logout();
    navigate("/login");
  };

  return {
    ...store,
    login: handleLogin,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
  };
};
