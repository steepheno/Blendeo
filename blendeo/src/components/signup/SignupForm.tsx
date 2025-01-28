import InputField from "../login/LoginInput";
import VerificationInput from "./VerificationInput";

const SignupForm = () => {
  const handleVerification = () => {
    // Verification logic here
  };

  return (
    <form className="w-full">
      <VerificationInput
        type="email"
        placeholder="ssafy@gmail.com"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] w-[374px] max-md:w-full"
        id="email"
        aria-label="Email address"
        onVerify={handleVerification}
        buttonText="인증번호 전송"
      />

      <VerificationInput
        type="text"
        placeholder="568349"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full"
        id="verification"
        aria-label="Verification code"
        onVerify={handleVerification}
        buttonText="확인"
      />

      <InputField
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full"
        id="password"
        aria-label="Password"
      />

      <div className="mt-1.5 mb-1.5 text-xs font-light leading-5 text-zinc-400">
        비밀번호는 영문자(대,소문자), 숫자, 특수문자를 포함하여 최소 8자 이상 작성 해야 합니다.
      </div>

      <InputField
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] w-[533px] max-md:w-full"
        id="confirmPassword"
        aria-label="Confirm password"
      />

      <div className="mt-1.5 mb-1.5 text-xs font-light leading-5 text-zinc-400">
        비밀번호가 일치합니다.
      </div>

      <button type="submit" className="gap-3 w-full px-6 py-5 mt-9 text-xl font-semibold tracking-wide leading-none text-center text-white bg-violet-700 rounded-md">
        회원가입하기
      </button>
    </form>
  );
};

export default SignupForm;