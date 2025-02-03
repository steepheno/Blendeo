// src/types/api/auth.ts
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  nickname: string | null;
  profileImage: string | null;
  token?: string; // 기존 token 필드도 유지
}

export interface EmailVerification {
  email: string;
  verificationCode: string;
}
