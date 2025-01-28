import * as React from "react";
import SignupInput from "../signup/SignupInput";
import { VerificationInputProps } from "../../types/types";

const VerificationInput: React.FC<VerificationInputProps> = ({
  type,
  placeholder,
  className,
  id,
  "aria-label": ariaLabel,
  value,
  onChange,
  onVerify,
  buttonText,
}) => (
  <div className="flex items-center gap-2.5 mb-4 w-full">
    <SignupInput
      type={type}
      placeholder={placeholder}
      className={className}
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
    />
    <button
      onClick={onVerify}
      className="px-4 py-0 h-12 text-xl font-semibold text-white whitespace-nowrap bg-violet-700 rounded-3xl cursor-pointer border-[none]"
    >
      {buttonText}
    </button>
  </div>
);

export default VerificationInput;