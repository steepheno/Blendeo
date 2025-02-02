// src/api/auth.ts
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
  if (response.token) {
    localStorage.setItem("token", response.token);
  }
  if (response) {
    localStorage.setItem("user", JSON.stringify(response));
  }
  return response;
};

export const logout = async () => {
  const token = localStorage.getItem("token");
  return axiosInstance.post("/user/auth/logout", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
