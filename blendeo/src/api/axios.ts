import axios from "axios";
import type { CustomAxiosInstance } from "@/types/api/axios";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // 쿠키 전송을 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

const publicPaths = [
  "/mail/check",
  "/mail/verify",
  "/user/auth/signup",
  "/user/auth/login",
  "/project/new",
  "/project/",
];

interface UserData {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  accessToken: string;
  refreshToken: string;
}

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] =
      "GET,PUT,POST,DELETE,PATCH,OPTIONS";

    const isPublicAPI = publicPaths.some((path) => config.url?.includes(path));

    if (import.meta.env.DEV) {
      console.log("Request config:", config);
      console.log("Is public API:", isPublicAPI);
    }

    if (!isPublicAPI) {
      // 1. 쿠키에서 토큰 추출 시도
      const cookies = document.cookie.split(";");
      const accessToken = cookies
        .find((cookie) => cookie.trim().startsWith("AccessToken="))
        ?.split("=")[1];

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        // 2. localStorage에서 토큰 추출 시도
        console.log("trying local...");

        const localData = localStorage.getItem("user");
        if (localData) {
          const userData: UserData = JSON.parse(localData);
          console.log("Access Token is:", userData.accessToken);
          config.headers.Authorization = `Bearer ${userData.accessToken}`;
        }
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
    if (
      error.config.url?.includes("/user/auth/logout") &&
      error.response?.status === 401
    ) {
      return Promise.resolve();
    }

    const isPublicAPI = publicPaths.some((path) =>
      error.config.url?.includes(path)
    );

    if (error.response?.status === 401 && !isPublicAPI) {
      // 인증 실패시 쿠키와 localStorage 모두 클리어
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      localStorage.removeItem("token");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
