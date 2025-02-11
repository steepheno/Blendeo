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
  "/project/info",
  "/project/list",
  "/project/list", // 이 경로 추가
  "/project/new",  // 필요한 경우 이것도 추가
  "/user/follow/get-follow",
  "/user/get-user",
  "/comment/get-all"
];

const noRedirectPaths = ["/", "/project/list"];

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
      return config;
    } else {
      // accessToken이 없는 경우 refresh 시도
      const refreshToken = cookies
        .find((cookie) => cookie.trim().startsWith("refreshToken="))
        ?.split("=")[1];

      if (refreshToken) {
        return axios
          .post(
            `${baseURL}/user/auth/refresh`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          )
          .then((response) => {
            if (!response) {
              throw new Error("No response from refresh token request");
            }

            const cookies = document.cookie.split(";");
            const newAccessToken = cookies
              .find((cookie) => cookie.trim().startsWith("accessToken="))
              ?.split("=")[1];

            if (newAccessToken) {
              config.headers.Authorization = `Bearer ${newAccessToken}`;
              return config;
            }
            throw new Error("New access token not found in cookies");
          })
          .catch((error) => {
            console.error("Token refresh failed:", error);
            handleLogout();
            throw error; // Promise.reject 대신 throw 사용
          });
      }

      handleLogout();
      throw new Error("No refresh token available");
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
        return axiosInstance(originalRequest);
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

export default axiosInstance;
