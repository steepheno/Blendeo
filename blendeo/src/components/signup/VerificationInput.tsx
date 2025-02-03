import * as React from "react";
import SignupInput from "./SignupInput";
import { VerificationInputProps } from "@/types/components/Input";

const VerificationInput = React.forwardRef<
  HTMLInputElement,
  VerificationInputProps
>(
  (
    {
      type,
      placeholder,
      className,
      id,
      "aria-label": ariaLabel,
      value,
      onChange,
      onVerify,
      buttonText,
      disabled,
      ...props
    },
    ref
  ) => (
    <div className="flex items-center gap-2.5 mb-4 w-full">
      <SignupInput
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={className}
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <button
        onClick={onVerify}
        disabled={disabled}
        className="
          px-4 
          py-0 
          h-12 
          text-xl 
          font-semibold 
          text-white 
          whitespace-nowrap 
          bg-violet-700 
          rounded-3xl 
          cursor-pointer 
          border-[none]
          transition-colors
          hover:bg-violet-800
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
        type="button"
      >
        {buttonText}
      </button>
    </div>
  )
);

VerificationInput.displayName = "VerificationInput";

export default VerificationInput;
