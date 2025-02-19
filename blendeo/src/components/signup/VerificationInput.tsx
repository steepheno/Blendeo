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
    <div className="relative w-full">
      <div className="flex items-center w-full">
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
            absolute
            right-2
            top-1/2
            -translate-y-1
            px-4
            text-sm
            font-semibold
            text-violet-700
            bg-transparent
            rounded-md
            transition-colors
            hover:bg-violet-50
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:bg-transparent

          "
          type="button"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
);

VerificationInput.displayName = "VerificationInput";

export default VerificationInput;
