import LoginInput from "../login/LoginInput";
import SaveIdCheckbox from "./SaveIdCheckbox";
import ForgotPassword from "./ForgotPassword";

const LoginForm = () => {
  return (
    <form className="w-full">
      <LoginInput
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full"
        id="password"
        aria-label="Password"
      />

      <LoginInput
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] w-[533px] max-md:w-full"
        id="confirmPassword"
        aria-label="Confirm password"
      />
      
      <div className="flex items-center justify-between mt-7 text-base leading-none text-black">
        <div className="flex gap-2.5 justify-center items-center self-stretch my-auto">
          <label className="flex items-center cursor-pointer">
            <SaveIdCheckbox />
          </label>
        </div>
        <ForgotPassword />
      </div>

      <button type="submit" className="gap-3 w-full px-6 py-5 mt-9 text-xl font-semibold tracking-wide leading-none text-center text-white bg-violet-700 rounded-md">
        로그인하기
      </button>
    </form>
  );
};

export default LoginForm;