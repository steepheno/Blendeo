interface ForgotPasswordProps {
  onClick: () => void;
}

function ForgotPassword({ onClick }: ForgotPasswordProps) {
  return (
    <button
      onClick={onClick}
      className="self-stretch my-auto text-base tracking-wide leading-none text-right text-black"
    >
      비밀번호를 잊으셨나요?
    </button>
  );
}

export default ForgotPassword;