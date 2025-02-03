// src/types/components/auth/login.ts
export interface SocialLoginButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

export interface LoginInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SaveIdCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
