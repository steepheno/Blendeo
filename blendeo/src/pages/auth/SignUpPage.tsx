import { useNavigate } from "react-router-dom";
import SignUpForm from "@/components/signup/SignUpForm";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    // Google OAuth 로그인 구현
    console.log("Google signup clicked");
  };

  return (
    <div className="flex justify-center items-center mx-auto my-0 w-full bg-white max-w-[1920px] max-md:flex-col">
      <div className="pt-52 pr-0 pb-0 pl-20 w-[36%] max-md:px-5 max-md:py-10 max-md:w-full">
        <div className="mb-3 text-5xl font-extrabold text-slate-900 tracking-[2.13px] max-md:text-4xl">
          환영합니다!
        </div>
        <div className="mb-11 text-lg text-gray-500">
          음악에 섞이다 - Blendeo
        </div>

        <SignUpForm />

        <div className="flex flex-col mt-14 w-full max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-wrap gap-6 items-center w-full text-sm tracking-wide leading-none text-gray-500 max-md:max-w-full">
            <div className="h-[1px] bg-gray-200 flex-grow" />
            <div className="flex-shrink-0">또는 구글 계정으로 회원가입</div>
            <div className="h-[1px] bg-gray-200 flex-grow" />
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="flex gap-4 justify-center items-center p-4 mt-6 rounded-md border border-gray-200 border-solid cursor-pointer w-[423px] max-md:w-full hover:bg-gray-50 transition-colors"
        >
          <img
            src="/google-icon.png"
            alt="Google"
            className="w-6 h-6"
            onError={(e) => {
              // 이미지 로드 실패시 대체 텍스트 표시
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-sm font-medium tracking-wide text-slate-900">
            구글 계정으로 회원가입
          </span>
        </button>

        <div className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => navigate("/auth/signin")}
            className="text-violet-700 hover:text-violet-800 font-medium"
          >
            로그인하기
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center w-[64%] max-md:mt-10 max-md:w-full">
        <div className="flex justify-center items-center">
          <div className="bg-center bg-no-repeat bg-contain bg-[url('/src/assets/login_img.png')] h-[770px] w-[800px] max-md:w-full max-md:h-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
