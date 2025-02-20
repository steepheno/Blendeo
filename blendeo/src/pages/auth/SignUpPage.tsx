import { useNavigate } from "react-router-dom";
import SignUpForm from "@/components/signup/SignupForm";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    // Google OAuth 로그인 구현
    console.log("Google signup clicked");
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden mx-auto my-0 w-full bg-white max-w-[1920px] max-md:flex-col">
      <div className="h-full pt-12 pr-0 pb-0 pl-20 w-[36%] max-md:px-5 max-md:py-10 max-md:w-full min-w-[420px] transform scale-80">
        <div className="mb-3 text-5xl font-extrabold text-slate-900 tracking-[2.13px] max-md:text-4xl">
          환영합니다!
        </div>
        <div className="mb-11 text-lg text-gray-500">
          음악에 섞이다 - Blendeo
        </div>

        <SignUpForm />

        <div className="mt-7 text-base tracking-wide text-center">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => navigate("/auth/signin")}
            className="font-semibold text-violet-700 hover:underline"
          >
            로그인하기
          </button>
        </div>
      </div>

      {/* 로그인 이미지 */}
      <div className="h-full flex justify-center items-center w-full max-w-3xl mx-auto">
        <div className="w-full max-w-xl px-4 mt-40">
          <img
            src="/images/login_img.png"
            alt="로그인 이미지"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
