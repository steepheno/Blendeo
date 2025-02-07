import axios from "axios";
import type { CustomAxiosInstance } from "@/types/api/axios";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const axiosInstance = axios.create({
  baseURL,
  timeout: 300000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

interface UserData {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  accessToken: string;
  refreshToken: string;
}

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const publicPaths = [
    "/mail/check",
    "/mail/verify",
    "/user/auth/signup",
    "/user/auth/login",
    "/api/v1/project/info",
  ];

  const isPublicAPI = publicPaths.some((path) => config.url?.includes(path));

  if (!isPublicAPI) {
    const cookies = document.cookie.split(";");
    const accessToken = cookies
      .find((cookie) => cookie.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      const localData = localStorage.getItem("user");
      if (localData) {
        const userData: UserData = JSON.parse(localData);
        config.headers.Authorization = `Bearer ${userData.accessToken}`;
      } else {
        console.log("No authentication token found");
      }
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
    if (
      error.config.url?.includes("/user/auth/logout") &&
      error.response?.status === 401
    ) {
      return Promise.resolve();
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
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
