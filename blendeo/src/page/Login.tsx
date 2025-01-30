import * as React from 'react';
// import SocialLoginButton from '../components/login/SocialLoginButton';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/login/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  
  const goToSignup = () => {
    navigate('/signup');
  }

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
        
        {/* 소셜로그인 */}
        <div className="flex flex-col mt-14 w-full max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-wrap gap-6 items-center w-full text-sm tracking-wide leading-none text-gray-500 max-md:max-w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/78d88fc4a71dfca2344b5a5340be657ba8abdc345db01a75d5b035f89c9f81cb?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
              alt=""
              className="object-contain shrink-0 w-auto flex-grow max-w-full"
            />
            <div className="flex flex-1 gap-5 items-center justify-center my-auto">
              <div className="whitespace-nowrap flex justify-center items-center">
                또는 구글 계정으로 로그인
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b14e650042d2269374e88fdabebf1ab5718d83c465a9ee987de3785923f8e6af?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
              alt=""
              className="object-contain shrink-0 w-auto flex-grow max-w-full"
            />
          </div>
        </div>
        
        <div className="flex gap-4 justify-center items-center p-4 mt-6 rounded-md border border-gray-200 border-solid cursor-pointer w-[423px] max-md:w-full">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f095d799dfcd30076a73387a5484c8f056ccb01f3b63dad2b3eef2b1bd05a98d?apiKey=b682f36019fa47c8ad11d631a8d9d40b&" alt="Google" />
          <div className="text-sm font-medium tracking-wide text-slate-900">
            구글 계정으로 회원가입
          </div>
        </div>
        <div className="mt-7 text-base tracking-wide text-center max-md:max-w-full">
          <span>계정이 없으신가요? </span>
          <button onClick={goToSignup} className="font-semibold text-violet-700 hover:underline">
            회원가입
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center w-[60%] max-md:mt-10 max-md:w-full">
        <div className="flex justify-center items-center">
          <div className="bg-center bg-no-repeat bg-contain bg-[url('/src/assets/login_img.png')] h-[770px] w-[800px] max-md:w-full max-md:h-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Login;