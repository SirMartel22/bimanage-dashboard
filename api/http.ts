import axios from "axios";

export const BASE_API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://bimanage-backend.onrender.com/api"
).replace(/\/+$/, "");

const defaultConfig = {
  baseURL: BASE_API_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const publicApi = axios.create(defaultConfig);
