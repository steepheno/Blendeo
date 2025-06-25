import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { SigninRequest } from "@/types/api/auth";
import { AxiosError } from "axios";
import LoginInput from "./LoginInput";
import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
  status?: number;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<SigninRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const { signin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 이메일 유효성 검사
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "이메일을 입력해주세요.";
    }
    if (!emailRegex.test(email)) {
      return "올바른 이메일 형식이 아닙니다.";
    }
    return undefined;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "비밀번호를 입력해주세요.";
    }
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (!/[a-z]/.test(password)) {
      return "비밀번호는 소문자를 포함해야 합니다.";
    }
    if (!/[0-9]/.test(password)) {
      return "비밀번호는 숫자를 포함해야 합니다.";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "비밀번호는 특수문자(!@#$%^&*)를 포함해야 합니다.";
    }
    return undefined;
  };

  // 전체 폼 유효성 검사
  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setValidationErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 제출 전 유효성 검사
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signin(formData);
      toast.success("로그인이 성공적으로 이뤄졌습니다!");
      const from = location.state?.from || "/main";
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorResponse = err.response?.data as ErrorResponse;

        if (errorResponse.status === 401) {
          toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (errorResponse.status === 404) {
          toast.error("존재하지 않는 계정입니다.");
        } else {
          toast.error("로그인 중 오류가 발생했습니다.");
        }
      } else {
        toast.error("로그인 중 오류가 발생했습니다.");
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

    // 실시간 유효성 검사
    if (name === "email") {
      setValidationErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    } else if (name === "password") {
      setValidationErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <LoginInput
        id="email"
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        error={!!validationErrors.email}
      />
      {validationErrors.email && (
        <div className="mt-1 text-sm text-red-500">
          {validationErrors.email}
        </div>
      )}

      <LoginInput
        id="password"
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        error={!!validationErrors.password}
      />
      {validationErrors.password && (
        <div className="mt-1 text-sm text-red-500">
          {validationErrors.password}
        </div>
      )}

      <button
        type="submit"
        disabled={
          isLoading ||
          !formData.email ||
          !formData.password ||
          !!validationErrors.email ||
          !!validationErrors.password
        }
        className="mt-6 p-4 w-full text-white bg-violet-700 rounded-md font-semibold hover:bg-violet-800 disabled:bg-violet-400 transition-colors duration-200"
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
};

export default LoginForm;
