import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationEmail, verifyEmailCode } from "@/api/mail";
import SignupInput from "./SignupInput";
import VerificationInput from "@/components/signup/VerificationInput";
import { toast } from "sonner";

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nickname?: string;
  verificationCode?: string;
}

const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    verificationCode: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [emailSent, setEmailSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const validatePassword = (password: string): string | undefined => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&^])[a-z\d@$!%*?&^]{8,}$/;
    if (!password) {
      return "비밀번호를 입력해주세요.";
    }
    if (!regex.test(password)) {
      return "비밀번호는 영문 소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.";
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    setValidationErrors((prev) => {
      const newErrors = { ...prev };

      switch (name) {
        case "email":
          newErrors.email = validateEmail(value);
          break;
        case "password":
          newErrors.password = validatePassword(value);
          // 비밀번호가 변경되면 비밀번호 확인도 다시 검증
          if (formData.confirmPassword) {
            newErrors.confirmPassword =
              formData.confirmPassword !== value
                ? "비밀번호가 일치하지 않습니다."
                : undefined;
          }
          break;
        case "confirmPassword":
          newErrors.confirmPassword =
            value !== formData.password
              ? "비밀번호가 일치하지 않습니다."
              : undefined;
          break;
        case "nickname":
          newErrors.nickname = !value ? "닉네임을 입력해주세요." : undefined;
          break;
      }

      return newErrors;
    });
  };

  const handleEmailVerification = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setValidationErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    try {
      setIsLoading(true);
      await sendVerificationEmail(formData.email);
      setEmailSent(true);
      toast.success("인증번호가 전송되었습니다.");
    } catch (err) {
      console.error("이메일 전송 실패: ", err);
      const error = err as ApiError;
      toast.error(
        error.response?.data?.message || "인증번호 전송에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    if (!formData.verificationCode) {
      setValidationErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해주세요.",
      }));
      return;
    }

    try {
      await verifyEmailCode(formData.email, formData.verificationCode);
      setVerificationStatus("success");
      toast.success("이메일 인증이 완료되었습니다.");
    } catch (err) {
      console.error("인증번호 확인 실패: ", err);
      setVerificationStatus("fail");
      setValidationErrors((prev) => ({
        ...prev,
        verificationCode: "잘못된 인증번호입니다.",
      }));
    }
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.nickname) {
      setValidationErrors((prev) => ({
        ...prev,
        email: !formData.email ? "이메일을 입력해주세요." : undefined,
        password: !formData.password ? "비밀번호를 입력해주세요." : undefined,
        nickname: !formData.nickname ? "닉네임을 입력해주세요." : undefined,
      }));
      return;
    }

    if (verificationStatus !== "success") {
      toast.error("이메일 인증을 완료해주세요.");
      return;
    }

    navigate("/auth/signup2", {
      state: {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      },
    });
  };

  return (
    <form className="w-full" onSubmit={handleNext}>
      <VerificationInput
        type="email"
        placeholder="ssafy@gmail.com"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[60px] max-md:w-full mt-4"
        id="email"
        aria-label="Email address"
        value={formData.email}
        onChange={handleChange}
        onVerify={handleEmailVerification}
        buttonText="인증번호 전송"
        name="email"
        error={!!validationErrors.email}
      />
      {validationErrors.email && (
        <div className="mt-1 text-sm text-red-500">
          {validationErrors.email}
        </div>
      )}

      <VerificationInput
        type="text"
        placeholder="인증번호를 입력해주세요."
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[60px] max-md:w-full mt-4"
        id="verification"
        aria-label="Verification code"
        value={formData.verificationCode}
        onChange={handleChange}
        onVerify={handleCodeVerification}
        buttonText="확인"
        disabled={!emailSent}
        name="verificationCode"
        error={!!validationErrors.verificationCode}
      />
      {validationErrors.verificationCode && (
        <div className="mt-1 text-sm text-red-500">
          {validationErrors.verificationCode}
        </div>
      )}

      <SignupInput
        type="text"
        placeholder="닉네임을 입력해주세요"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[60px] max-md:w-full mt-4"
        id="nickname"
        aria-label="Nickname"
        value={formData.nickname}
        onChange={handleChange}
        name="nickname"
        error={!!validationErrors.nickname}
      />
      {validationErrors.nickname && (
        <div className="mt-1 text-sm text-red-500">
          {validationErrors.nickname}
        </div>
      )}

      <SignupInput
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[60px] max-md:w-full mt-4"
        id="password"
        aria-label="Password"
        value={formData.password}
        onChange={handleChange}
        name="password"
        error={!!validationErrors.password}
      />

      <SignupInput
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[60px] max-md:w-full mt-4"
        id="confirmPassword"
        aria-label="Confirm password"
        value={formData.confirmPassword}
        onChange={handleChange}
        name="confirmPassword"
        error={!!validationErrors.confirmPassword}
      />
      {validationErrors.confirmPassword ? (
        <div className="mt-1 text-sm text-red-500">
          {validationErrors.confirmPassword}
        </div>
      ) : (
        formData.password &&
        formData.confirmPassword && (
          <div className="mt-1.5 mb-1.5 text-xs font-light leading-5 text-zinc-400">
            {formData.password === formData.confirmPassword
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
          </div>
        )
      )}

      <button
        type="submit"
        disabled={isLoading || verificationStatus !== "success"}
        className="mt-6 p-4 w-full text-white bg-violet-700 rounded-md font-semibold hover:bg-violet-800 disabled:bg-violet-400 transition-colors duration-200"
      >
        다음
      </button>
    </form>
  );
};

export default SignUpForm;
