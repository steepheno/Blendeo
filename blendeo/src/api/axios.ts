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

    // accessToken이 만료된 경우
    if (error.response?.status === 403 && !isPublicAPI && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken으로 새로운 accessToken 발급 시도
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
                Authorization: `Bearer ${refreshToken}`
              }
            }
          );

          // 새로운 요청 시도
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // refresh 실패 시 로그아웃 처리
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