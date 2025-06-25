// src/api/mail.ts
import axiosInstance from "@/api/axios";

export const sendVerificationEmail = async (email: string) => {
  return axiosInstance.post<void>(
    `/user/auth/mail/check?email=${encodeURIComponent(email)}`
  );
};

export const verifyEmailCode = async (email: string, authCode: string) => {
  return axiosInstance.post<void>(
    `/user/auth/code/check?email=${encodeURIComponent(email)}&authCode=${authCode}`
  );
};
