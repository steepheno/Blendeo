// src/components/login/ForgotPassword.tsx
import { sendVerificationEmail } from "@/api/mail";
import { useState } from "react";

interface ForgotPasswordProps {
  onClick: () => void;
}

function ForgotPassword({ onClick }: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      await sendVerificationEmail(email);
      setIsEmailSent(true);
      onClick();
    } catch (error) {
      console.error("Failed to send verification email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="text-center text-sm text-gray-600">
        이메일이 발송되었습니다. 메일함을 확인해주세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        className="p-2 border rounded"
      />
      <button
        onClick={handleForgotPassword}
        disabled={isLoading || !email}
        className="self-stretch my-auto text-base tracking-wide leading-none text-right text-black hover:text-gray-600 transition-colors disabled:opacity-50"
      >
        비밀번호를 잊으셨나요?
      </button>
    </div>
  );
}

export default ForgotPassword;
