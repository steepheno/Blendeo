// src/components/login/SocialLoginButton.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface SocialLoginButtonProps {
  onClick?: () => void;
}

const GOOGLE_ICON = "/icons/google.svg";

const SocialLoginButton = ({ onClick }: SocialLoginButtonProps) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // 여기에 Google 로그인 로직 구현
      // 현재는 onClick prop이 있으면 실행하고, 없으면 홈으로 이동
      if (onClick) {
        onClick();
      } else {
        navigate("/main");
      }
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex flex-col justify-center px-36 py-4 w-full text-sm font-medium tracking-wide rounded-md border border-gray-200 border-solid hover:bg-gray-50 transition-colors duration-200 max-md:px-5 max-md:max-w-full"
    >
      <div className="flex gap-4 items-center justify-center">
        <img
          loading="lazy"
          src={GOOGLE_ICON}
          alt="Google 로그인"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
        <span className="self-stretch my-auto">Google로 계속하기</span>
      </div>
    </button>
  );
};

export default SocialLoginButton;
