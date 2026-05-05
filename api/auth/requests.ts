import { publicApi, BASE_API_URL } from "@/api/http";
import { apiClient } from "@/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  CurrentUserResponse,
} from "./types";

export const loginRequest = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await publicApi.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export const registerRequest = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const response = await publicApi.post<RegisterResponse>("/auth/register", payload);
  return response.data;
};

export const verifyEmailRequest = async (payload: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
  const response = await publicApi.post<VerifyEmailResponse>("/verify/email", payload);
  return response.data;
};

export const resendOtpRequest = async (payload: ResendOtpRequest): Promise<{ message: string }> => {
  const response = await publicApi.post<{ message: string }>("/verify/resend", payload);
  return response.data;
};

export const getCurrentUserRequest = async (): Promise<CurrentUserResponse> => {
  const response = await apiClient.get<CurrentUserResponse>("/auth/me");
  return response.data;
};

export const forgotPasswordRequest = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = await publicApi.post<ForgotPasswordResponse>("/auth/forgot-password", payload);
  return response.data;
};

export const verifyOtpRequest = async (payload: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const response = await publicApi.post<VerifyOtpResponse>("/auth/verify-otp", payload);
  return response.data;
};

export const resetPasswordRequest = async (payload: ResetPasswordRequest, resetToken: string): Promise<ResetPasswordResponse> => {
  const response = await publicApi.post<ResetPasswordResponse>("/auth/reset-password", payload, {
    headers: {
      Authorization: `Bearer ${resetToken}`,
    },
  });
  return response.data;
};

export const googleLoginRedirect = () => {
  window.location.href = `${BASE_API_URL}/auth/google`;
};
