import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/login/LoginForm";

const SignInPage = () => {
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate("/auth/signup");
  };

  return (
    <div className="flex justify-center items-center mx-auto my-0 w-full bg-white max-w-[1920px] max-lg:flex-col">
      <div className="mt-48 mr-20 mb-0 ml-20 w-[50%] max-md:px-5 max-md:py-1 w-full md:w-2/3 lg:w-1/2 min-w-50">
        <div className="mb-3 text-5xl font-extrabold text-slate-900 tracking-[2.13px] max-md:text-4xl">
          Blendeo
        </div>
        <div className="mb-11 text-lg text-gray-500">
          로그인하여 세상의 모든 음악에 섞여 보세요
        </div>

        <LoginForm />

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
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-center items-center w-full">
          <div className="mt-40 bg-center bg-no-repeat bg-contain bg-[url('/images/login_img.png')] w-full h-[60vh] md:h-[70vh]" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
