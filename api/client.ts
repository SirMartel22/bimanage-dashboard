"use client";

import axios, {
  AxiosHeaders,
  AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { BASE_API_URL } from "@/api/http";
import { useAuthStore } from "@/lib/store/auth-store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const SIGNIN_PATH = "/signin";

const AUTH_PAGES = ["/signin", "/signup", "/forgot-password", "/verify-otp", "/reset-password"];

const isPublicAuthPage = () => {
  if (typeof window === "undefined") return false;
  return AUTH_PAGES.some((page) => window.location.pathname.startsWith(page));
};

const redirectToSignin = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== SIGNIN_PATH) {
    window.location.href = SIGNIN_PATH;
  }
};

const setAuthHeader = (config: RetryableRequestConfig, token: string) => {
  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
    return;
  }

  const headers = new AxiosHeaders(config.headers);
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
};

export const apiClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: Infinity,
  headers: {
    "Content-Type": "application/json",
  },
});

const applyInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      setAuthHeader(config as RetryableRequestConfig, token);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;
      const status = error.response?.status;

      if (!originalRequest || status !== 401) {
        return Promise.reject(error);
      }

      if (
        originalRequest._retry ||
        isPublicAuthPage()
      ) {
        return Promise.reject(error);
      }

      const store = useAuthStore.getState();

      // Since we don't have refresh token logic in docs.md yet, 
      // we'll just clear auth on 401 if not a public page.
      store.clearAuth();
      redirectToSignin();
      return Promise.reject(error);
    },
  );
};

applyInterceptors(apiClient);
