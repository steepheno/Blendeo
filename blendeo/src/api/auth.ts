import axiosInstance from "@/api/axios";
import { SignupRequest, SigninRequest, AuthResponse } from "@/types/api/auth";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";

export const signup = async (data: SignupRequest) => {
  return axiosInstance.post<AuthResponse>("/user/auth/signup", data);
};

export const signin = async (data: SigninRequest) => {
  return axiosInstance.post<AuthResponse>("/user/auth/login", data);
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
  // localStorage에 id 저장
  localStorage.setItem("userId", id.toString());
  console.log("localStorage 저장 후: ", localStorage.getItem("userId"));

  // 쿠키에서 accessToken 읽기
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  return axiosInstance.get(`/user/get-user/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
