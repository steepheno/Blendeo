// src/components/login/LoginOptions.tsx
import SaveIdCheckbox from "./SaveIdCheckbox";
import ForgotPassword from "./ForgotPassword";

interface LoginOptionsProps {
  saveId: boolean;
  onSaveIdChange: (checked: boolean) => void;
}

export function LoginOptions({ saveId, onSaveIdChange }: LoginOptionsProps) {
  const handleSaveIdChange = (checked: boolean) => {
    onSaveIdChange(checked);
    if (!checked) {
      localStorage.removeItem("savedEmail");
    }
  };

  const handleForgotPassword = () => {
    // 비밀번호 찾기 로직 구현
    console.log("Forgot password clicked");
  };

  return (
    <div className="flex flex-wrap gap-10 justify-between items-center mt-2.5 w-full max-md:max-w-full">
      <SaveIdCheckbox checked={saveId} onChange={handleSaveIdChange} />
      <ForgotPassword onClick={handleForgotPassword} />
    </div>
  );
}

export default LoginOptions;
