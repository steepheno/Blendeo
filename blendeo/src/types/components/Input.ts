import { InputHTMLAttributes } from "react";

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  "aria-label": string;
  error?: boolean;
}

export interface SignupInputProps extends BaseInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface VerificationInputProps extends SignupInputProps {
  onVerify: () => void;
  buttonText: string;
  disabled?: boolean;
}
