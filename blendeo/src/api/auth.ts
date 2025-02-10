import axiosInstance from "@/api/axios";
import { SignupRequest, SigninRequest, AuthResponse } from "@/types/api/auth";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";

export const signup = async (data: SignupRequest) => {
  return axiosInstance.post<AuthResponse>("/user/auth/signup", data);
};

export const signin = async (data: SigninRequest) => {
  const response = await axiosInstance.post<AuthResponse>(
    "/user/auth/login",
    data
  );

  if (response) {
    // 토큰은 쿠키에 저장 (현재 코드 유지)
    document.cookie = `accessToken=${response.accessToken}; path=/; secure; samesite=strict; max-age=3600`;
    document.cookie = `refreshToken=${response.refreshToken}; path=/; secure; samesite=strict; max-age=86400`;
  }

  return response;
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/user/auth/logout");

    // 쿠키 삭제
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";

    // Store 초기화
    useUserStore.getState().setCurrentUser(null);
    useAuthStore.getState().setUser(null);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const refresh = async () => {
  // 쿠키에서 refreshToken 읽기
  const refreshToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("refreshToken="))
    ?.split("=")[1];

  return axiosInstance.post("/user/auth/refresh", null, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};

export const getUser = async (id: number) => {
  // 쿠키에서 accessToken 읽기
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  return axiosInstance.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
