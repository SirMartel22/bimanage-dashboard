"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AuthUser,
  LoginResponse,
} from "@/api/auth/types";

type AuthStore = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuthFromLogin: (payload: LoginResponse) => void;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
};

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuthFromLogin: (payload) =>
        set({
          token: payload.token,
          user: payload.user || null,
          isAuthenticated: !!payload.token,
        }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      clearAuth: () => set(initialState),
    }),
    {
      name: "bimanage_auth_store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
