// src/api/axios.ts
import axios from "axios";
import type { CustomAxiosInstance } from "@/types/api/axios";
import { useUserStore } from "@/stores/userStore";

const baseURL = "https://19b0-211-192-252-214.ngrok-free.app/api/v1";
// const baseURL = import.meta.env.VIDEO_API_URL || "/api/v1";

const videoAxiosInstance = axios.create({
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
  "/user/auth",
  "/project/get",
  "/user/follow/get-follow",
  "/user/get-user",
  "/comment/get-all",
  "/fork/hierarchy",
];

const noRedirectPaths = ["/", "/project/list"];

// Request Interceptor
videoAxiosInstance.interceptors.request.use(async (config) => {
  const isPublicAPI = publicPaths.some((path) => config.url?.includes(path));
  console.log("isthis?", isPublicAPI);

  if (!isPublicAPI) {
    const cookies = document.cookie.split(";");
    const accessToken = cookies
      .find((cookie) => cookie.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }
    // accessToken이 없는 경우 response interceptor에서 처리하도록 함
  }
  return config;
});

// Response Interceptor
videoAxiosInstance.interceptors.response.use(
  (response) => {
    // 로그인 응답에서 토큰 처리 - 서버가 Set-Cookie를 보내지 않는 경우에만 처리
    if (
      response.config.url?.includes("/user/auth/login") &&
      !response.headers["set-cookie"]
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
    if (!error?.config) {
      return Promise.reject(error);
    }

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

        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        await axios.post(
          `${baseURL}/user/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // 새로운 쿠키가 설정된 후의 accessToken 가져오기
        const newCookies = document.cookie.split(";");
        const newAccessToken = newCookies
          .find((cookie) => cookie.trim().startsWith("accessToken="))
          ?.split("=")[1];

        if (!newAccessToken) {
          throw new Error("New access token not found in cookies");
        }

        // 새로운 요청 시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return videoAxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 로그아웃 처리 함수 수정
const handleLogout = (currentPath: string = window.location.pathname) => {
  // 현재 경로가 noRedirectPaths에 포함되어 있다면 리다이렉트하지 않음
  const shouldRedirect = !noRedirectPaths.some(
    (path) => currentPath === path || currentPath.startsWith(path)
  );

  // 모든 쿠키 삭제
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
  useUserStore.getState().setCurrentUser(null);

  // 리다이렉트가 필요한 경우에만 수행
  if (shouldRedirect) {
    window.location.href = "/auth/signin";
  }
};

export default videoAxiosInstance;
