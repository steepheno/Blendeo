// src/components/login/LoginForm.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { SigninRequest } from "@/types/api/auth";
import { AxiosError } from "axios";
import LoginInput from "./LoginInput";

interface ErrorResponse {
  message?: string;
  status?: number;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<SigninRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { signin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("loc:",location);
      
      await signin(formData);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorResponse = err.response?.data as ErrorResponse;

        if (err.response?.status === 401) {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (err.response?.status === 404) {
          setError("존재하지 않는 계정입니다.");
        } else {
          setError(errorResponse?.message || "로그인 중 오류가 발생했습니다.");
        }
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // 입력이 변경되면 에러 메시지 초기화
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      {error && (
        <div
          className="mb-4 p-3 text-red-500 text-sm bg-red-50 rounded-md border border-red-200 cursor-pointer"
          onClick={() => setError("")}
        >
          {error}
        </div>
      )}

      <LoginInput
        id="email"
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        error={!!error && error.includes("이메일")}
      />

      <LoginInput
        id="password"
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        error={!!error && error.includes("비밀번호")}
      />

      <button
        type="submit"
        disabled={isLoading || !formData.email || !formData.password}
        className="mt-6 p-4 w-full text-white bg-violet-700 rounded-md font-semibold hover:bg-violet-800 disabled:bg-violet-400 transition-colors duration-200"
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
};

export default LoginForm;
