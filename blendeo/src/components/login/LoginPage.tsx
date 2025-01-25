import * as React from 'react';
import { InputField } from './InputField';
import { SocialLoginButton } from './SocialLoginButton';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="overflow-hidden pb-36 pl-20 bg-white max-md:pb-24 max-md:pl-5">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-[36%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col self-stretch my-auto w-full max-md:mt-10 max-md:max-w-full">
            <div className="self-start text-5xl font-extrabold text-slate-900 tracking-[2.13px] max-md:text-4xl">
              Blendeo
            </div>
            <div className="self-start mt-3 text-lg text-gray-500">
              로그인하여 세상의 모든 음악에 섞여 보세요
            </div>
            
            <form onSubmit={handleSubmit}>
              <InputField
                id="email"
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                id="password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <div className="self-end mt-7 text-base tracking-wide leading-none text-right text-black">
                <button className="hover:underline">비밀번호를 잊으셨나요?</button>
              </div>
              
              <button type="submit" className="gap-3 px-48 py-5 mt-9 w-36 text-xl font-semibold tracking-wide leading-none text-center text-white bg-violet-700 rounded-md max-md:px-5">
                로그인하기
              </button>
            </form>

            <div className="flex flex-col mt-14 w-full max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-wrap gap-6 items-center w-full text-sm tracking-wide leading-none text-gray-500 max-md:max-w-full">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/78d88fc4a71dfca2344b5a5340be657ba8abdc345db01a75d5b035f89c9f81cb?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                  alt=""
                  className="object-contain shrink-0 self-stretch my-auto w-44 aspect-[90.91]"
                />
                <div className="flex flex-1 shrink gap-5 items-center self-stretch my-auto basis-0 min-w-[240px]">
                  <div className="self-stretch my-auto">
                    또는 SNS 계정으로 로그인
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b14e650042d2269374e88fdabebf1ab5718d83c465a9ee987de3785923f8e6af?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                    alt=""
                    className="object-contain shrink-0 self-stretch my-auto w-[168px]"
                  />
                </div>
              </div>
              
              <div className="flex flex-col self-center mt-16 max-w-full leading-none text-slate-900 w-[423px] max-md:mt-10">
                <SocialLoginButton
                  icon="https://cdn.builder.io/api/v1/image/assets/TEMP/4d0608112de1a3cdd8fad78fa127cb6595c8301310dc72f8ff5c1275a9fb0227?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                  text="구글로 로그인 하기"
                />
                
                <div className="mt-7 text-base tracking-wide text-center max-md:max-w-full">
                  <span>계정이 없으신가요? </span>
                  <button className="font-semibold text-violet-700 hover:underline">
                    회원가입하러 가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[64%] max-md:ml-0 max-md:w-full">
          <div className="flex shrink-0 max-w-full h-[931px] w-[960px] max-md:mt-10" />
        </div>
      </div>
    </div>
  );
};