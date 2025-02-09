import axiosInstance from "@/api/axios";
import { SignupRequest, SigninRequest, AuthResponse } from "@/types/api/auth";

export const signup = async (data: SignupRequest) => {
  return axiosInstance.post<AuthResponse>("/user/auth/signup", data);
};

// src/api/auth.ts
export const signin = async (data: SigninRequest) => {
  const response = await axiosInstance.post<AuthResponse>(
    "/user/auth/login",
    data
  );

  if (response) {
    document.cookie = `accessToken=${response.accessToken}; path=/; secure; samesite=strict; max-age=3600`;
    document.cookie = `refreshToken=${response.refreshToken}; path=/; secure; samesite=strict; max-age=86400`;

    const userInfo = {
      id: response.id,
      email: response.email,
      nickname: response.nickname,
      profileImage: response.profileImage,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
  }

  return response;
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/user/auth/logout");

    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";

    localStorage.removeItem("user");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

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
