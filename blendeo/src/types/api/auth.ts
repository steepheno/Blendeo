// src/types/api/auth.ts
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  instrumentIds: number[];
}
// 악기 정보를 위한 인터페이스
interface Instrument {
  instrument_id: number;
  instrument_name: string;
}

export interface SigninRequest {
  email: string;
  password: string;
  provider?: string; // 소셜 로그인을 위한 옵셔널 필드 추가
}

export interface AuthResponse {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  instruments?: Instrument[];
  accessToken: string;
  refreshToken: string;
}

export interface EmailVerification {
  email: string;
  verificationCode: string;
}
