// src/components/login/LoginInput.tsx
import * as React from "react";
import { SigninRequest } from "@/types/api/auth";

interface LoginInputProps {
  id: keyof SigninRequest; // "email" | "password" 만 허용
  type: "email" | "password";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
}

const LoginInput: React.FC<LoginInputProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  return (
    <div
      className={`flex shrink-0 mt-4 rounded-md border ${
        error ? "border-red-300" : "border-gray-200"
      } border-solid h-[60px] max-md:max-w-full`}
    >
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        className={`w-full h-full px-4 rounded-md bg-transparent
          focus:outline-none focus:ring-2
          ${
            error
              ? "focus:ring-red-500 border-red-300"
              : "focus:ring-violet-500 border-transparent"
          }
          disabled:bg-gray-50 disabled:text-gray-500
          transition-colors duration-200`}
        aria-label={placeholder}
        aria-invalid={error}
      />
    </div>
  );
};

export default LoginInput;
