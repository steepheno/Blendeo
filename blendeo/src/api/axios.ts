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
    console.log("Request config:", config);
    const publicPaths = [
      "/mail/check",
      "/mail/verify",
      "/user/auth/signup",
      "/user/signin",
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
    const publicPaths = [
      "/mail/check",
      "/mail/verify",
      "/user/auth/signup",
      "/user/auth/login",
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
