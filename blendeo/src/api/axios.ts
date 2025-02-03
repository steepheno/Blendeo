// src/api/axios.ts
import axios from "axios";
import type { CustomAxiosInstance } from "@/types/api/axios";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] =
      "GET,PUT,POST,DELETE,PATCH,OPTIONS";
    console.log("Request config:", config);
    const publicPaths = [
      "/mail/check",
      "/mail/verify",
      "/user/auth/signup",
      "/user/auth/login",
      "/api/v1/project/info",
    ];
    const isPublicAPI = publicPaths.some((path) => config.url?.includes(path));
    console.log("Is public API:", isPublicAPI);

    if (!isPublicAPI) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // 로그아웃 요청에서 401 에러가 발생한 경우는 정상적인 로그아웃으로 처리
    if (
      error.config.url?.includes("/user/auth/logout") &&
      error.response?.status === 401
    ) {
      return Promise.resolve(); // 성공으로 처리
    }

    const publicPaths = [
      "/mail/check",
      "/mail/verify",
      "/user/auth/signup",
      "/user/auth/login",
      "/api/v1/project/info",
    ];
    const isPublicAPI = publicPaths.some((path) =>
      error.config.url?.includes(path)
    );

    if (error.response?.status === 401 && !isPublicAPI) {
      localStorage.removeItem("token");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
