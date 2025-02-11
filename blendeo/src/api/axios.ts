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
              throw new Error('No response from refresh token request');
            }
            
            const cookies = document.cookie.split(";");
            const newAccessToken = cookies
              .find((cookie) => cookie.trim().startsWith("accessToken="))
              ?.split("=")[1];

            if (newAccessToken) {
              config.headers.Authorization = `Bearer ${newAccessToken}`;
              return config;
            }
            throw new Error('New access token not found in cookies');
          })
          .catch((error) => {
            console.error('Token refresh failed:', error);
            handleLogout();
            throw error; // Promise.reject 대신 throw 사용
          });
      }
      
      handleLogout();
      throw new Error('No refresh token available');
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
          throw new Error('New access token not found in cookies');
        }

        // 새로운 요청 시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 로그아웃 처리 함수
const handleLogout = () => {
  // 모든 쿠키 삭제
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
  useUserStore.getState().setCurrentUser(null);
  window.location.href = "/auth/signin";
};

export default axiosInstance;