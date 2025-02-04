import axiosInstance from "@/api/axios";
import { SignupRequest, SigninRequest, AuthResponse } from "@/types/api/auth";

export const signup = async (data: SignupRequest) => {
  return axiosInstance.post<AuthResponse>("/user/auth/signup", data);
};

export const signin = async (data: SigninRequest) => {
  const response = await axiosInstance.post<AuthResponse>(
    "/user/auth/login",
    data
  );

  // response가 직접 AuthResponse 타입이므로 .data 없이 사용
  if (response?.accessToken) {
    localStorage.setItem("token", response.accessToken);
    document.cookie = `accessToken=${response.accessToken}; path=/; secure; samesite=strict; max-age=3600`;
  }

  if (response?.refreshToken) {
    document.cookie = `refreshToken=${response.refreshToken}; path=/; secure; samesite=strict; max-age=86400`;
  }

  if (response) {
    localStorage.setItem("user", JSON.stringify(response));
  }

  return response;
};

export const logout = async () => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.post("/user/auth/logout", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // 로그아웃 성공 시 localStorage 클리어
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return response;
};

// 새로운 함수 추가
export const refresh = async () => {
  const token = localStorage.getItem("token");
  return axiosInstance.post("/user/auth/refresh", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUser = async (id: number) => {
  const token = localStorage.getItem("token");
  return axiosInstance.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
