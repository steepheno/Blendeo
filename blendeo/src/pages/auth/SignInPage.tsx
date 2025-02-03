import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/login/LoginForm";

const SignInPage = () => {
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate("/auth/signup");
  };

  return (
    <div className="flex justify-center items-center mx-auto my-0 w-full bg-white max-w-[1920px] max-md:flex-col">
      <div className="pt-52 pr-0 pb-0 pl-20 w-[40%] max-md:px-5 max-md:py-10 max-md:w-full">
        <div className="mb-3 text-5xl font-extrabold text-slate-900 tracking-[2.13px] max-md:text-4xl">
          Blendeo
        </div>
        <div className="mb-11 text-lg text-gray-500">
          로그인하여 세상의 모든 음악에 섞여 보세요
        </div>

        <LoginForm />

        <div className="mt-4 text-center text-sm text-gray-500">
          또는 구글 계정으로 로그인
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          onClick={() => navigate("/")}
          className="flex gap-4 justify-center items-center p-4 mt-6 w-full rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        >
          <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
          <span className="text-sm font-medium tracking-wide text-slate-900">
            구글 계정으로 회원가입
          </span>
        </button>

        {/* 회원가입 링크 */}
        <div className="mt-7 text-base tracking-wide text-center">
          <span>계정이 없으신가요? </span>
          <button
            onClick={goToSignup}
            className="font-semibold text-violet-700 hover:underline"
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 로그인 이미지 */}
      <div className="flex justify-center items-center w-[60%] max-md:mt-10 max-md:w-full">
        <div className="flex justify-center items-center">
          <div className="bg-center bg-no-repeat bg-contain bg-[url('/src/assets/login_img.png')] h-[770px] w-[800px] max-md:w-full max-md:h-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
