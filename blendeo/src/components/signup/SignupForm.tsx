import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/auth";
import { sendVerificationEmail, verifyEmailCode } from "@/api/mail";
import SignupInput from "./SignupInput";
import VerificationInput from "@/components/signup/VerificationInput";

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
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
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleEmailVerification = async () => {
    if (!formData.email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      setIsLoading(true);
      await sendVerificationEmail(formData.email);
      setEmailSent(true);
      setError("");
      alert("인증번호가 전송되었습니다.");
    } catch (err) {
      console.error("이메일 전송 실패: ", err);
      const error = err as ApiError;
      setError(
        error.response?.data?.message || "인증번호 전송에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    if (!formData.verificationCode) {
      setError("인증번호를 입력해주세요.");
      return;
    }

    try {
      // API 파라미터 이름을 authCode로 변경
      await verifyEmailCode(formData.email, formData.verificationCode);
      setVerificationStatus("success");
      setError("");
      alert("이메일 인증이 완료되었습니다.");
    } catch (err) {
      console.error("인증번호 확인 실패: ", err);
      setVerificationStatus("fail");
      setError("잘못된 인증번호입니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.nickname) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (verificationStatus !== "success") {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      };

      await signup(signupData);
      alert("회원가입이 완료되었습니다.");
      navigate("/auth/signin", {
        state: { message: "회원가입이 완료되었습니다. 로그인해주세요." },
      });
    } catch (err) {
      console.error("회원가입 실패: ", err);
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "회원가입에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <VerificationInput
        type="email"
        placeholder="ssafy@gmail.com"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] w-[374px] max-md:w-full"
        id="email"
        aria-label="Email address"
        value={formData.email}
        onChange={handleChange}
        onVerify={handleEmailVerification}
        buttonText="인증번호 전송"
        name="email"
      />

      <VerificationInput
        type="text"
        placeholder="568349"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full"
        id="verification"
        aria-label="Verification code"
        value={formData.verificationCode}
        onChange={handleChange}
        onVerify={handleCodeVerification}
        buttonText="확인"
        disabled={!emailSent}
        name="verificationCode"
      />

      <SignupInput
        type="text"
        placeholder="닉네임을 입력해주세요"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full mb-4"
        id="nickname"
        aria-label="Nickname"
        value={formData.nickname}
        onChange={handleChange}
        name="nickname"
      />

      <SignupInput
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full"
        id="password"
        aria-label="Password"
        value={formData.password}
        onChange={handleChange}
        name="password"
      />

      <div className="mt-1.5 mb-1.5 text-xs font-light leading-5 text-zinc-400">
        비밀번호는 영문자(대,소문자), 숫자, 특수문자를 포함하여 최소 8자 이상
        작성해야 합니다.
      </div>

      <SignupInput
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] w-[533px] max-md:w-full"
        id="confirmPassword"
        aria-label="Confirm password"
        value={formData.confirmPassword}
        onChange={handleChange}
        name="confirmPassword"
      />

      <div className="mt-1.5 mb-1.5 text-xs font-light leading-5 text-zinc-400">
        {formData.password &&
          formData.confirmPassword &&
          (formData.password === formData.confirmPassword
            ? "비밀번호가 일치합니다."
            : "비밀번호가 일치하지 않습니다.")}
      </div>

      <button
        type="submit"
        disabled={isLoading || verificationStatus !== "success"}
        className="gap-3 w-full px-6 py-5 mt-9 text-xl font-semibold tracking-wide leading-none text-center text-white bg-violet-700 rounded-md hover:bg-violet-800 disabled:opacity-50"
      >
        {isLoading ? "가입 중..." : "회원가입하기"}
      </button>
    </form>
  );
};

export default SignUpForm;
