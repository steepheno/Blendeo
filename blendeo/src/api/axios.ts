// src/api/axios.ts
import axios from "axios";
import type { CustomAxiosInstance } from "@/types/api/axios";
import { useUserStore } from "@/stores/userStore";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const axiosInstance = axios.create({
  baseURL,
  timeout: 300000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

const publicPaths = [
  "/mail/check",
  "/mail/verify",
  "/user/auth/signup",
  "/user/auth/login",
  "/api/v1/project/info",
];

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const isPublicAPI = publicPaths.some((path) => config.url?.includes(path));

  if (!isPublicAPI) {
    const cookies = document.cookie.split(";");
    const accessToken = cookies
      .find((cookie) => cookie.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log("No authentication token found");
    }
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // 로그인 응답에서 토큰 처리 - 서버가 Set-Cookie를 보내지 않는 경우에만 처리
    if (
      response.config.url?.includes("/user/auth/login") &&
      !response.headers["set-cookie"] // 서버가 Set-Cookie를 보내지 않는 경우에만
    ) {
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        // 기존 토큰 삭제
        document.cookie =
          "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";

        // 새 토큰 설정
        document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict; max-age=3600`;
        document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict; max-age=86400`;
      }
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.config.url?.includes("/user/auth/logout") &&
      error.response?.status === 403
    ) {
      return Promise.resolve();
    }

    const isPublicAPI = publicPaths.some((path) =>
      error.config.url?.includes(path)
    );

    if (
      error.response?.status === 403 &&
      !isPublicAPI &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const cookies = document.cookie.split(";");
        const refreshToken = cookies
          .find((cookie) => cookie.trim().startsWith("refreshToken="))
          ?.split("=")[1];

        if (refreshToken) {
          const response = await axios.post(
            `${baseURL}/user/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          if (response.data.accessToken) {
            // 새로운 accessToken 저장
            document.cookie =
              "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
            document.cookie = `accessToken=${response.data.accessToken}; path=/; secure; samesite=strict; max-age=3600`;

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        document.cookie.split(";").forEach((cookie) => {
          document.cookie = cookie
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        useUserStore.getState().setCurrentUser(null);
        window.location.href = "/auth/signin";
        console.log(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
