// src/types/components/auth/signup.ts
import { ChangeEvent } from "react";

export interface SignupInputProps {
  type: string;
  placeholder: string;
  className: string;
  id: string;
  "aria-label": string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface VerificationInputProps extends SignupInputProps {
  onVerify: () => void;
  buttonText: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
