import * as React from "react";
import { SignupInputProps } from "@/types/components/Input";

const SignupInput = React.forwardRef<HTMLInputElement, SignupInputProps>(
  (
    {
      type,
      placeholder,
      className,
      id,
      "aria-label": ariaLabel,
      value,
      onChange,
      disabled,
      error,
      ...props
    },
    ref
  ) => (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          w-full
          px-4
          h-[60px]
          rounded-md
          transition-colors
          focus:outline-none
          focus:ring-2
          focus:ring-violet-500
          focus:border-transparent
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          ${className}
        `}
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
    </div>
  )
);

SignupInput.displayName = "SignupInput";

export default SignupInput;
