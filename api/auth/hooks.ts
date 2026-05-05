import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  loginRequest,
  registerRequest,
  verifyEmailRequest,
  resendOtpRequest,
  getCurrentUserRequest,
  forgotPasswordRequest,
  verifyOtpRequest,
  resetPasswordRequest,
  googleLoginRedirect,
} from "./requests";
import { useAuthStore } from "@/lib/store/auth-store";
import { getErrorMessage } from "@/api/types";
import type { 
  LoginRequest, 
  RegisterRequest, 
  VerifyEmailRequest, 
  ForgotPasswordRequest, 
  VerifyOtpRequest, 
  ResetPasswordRequest 
} from "./types";

export const useLogin = () => {
  const router = useRouter();
  const setAuthFromLogin = useAuthStore((s) => s.setAuthFromLogin);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setAuthFromLogin(data);
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (error: AxiosError) => {
      const err = getErrorMessage(error.response?.data);
      toast.error(err.title, { description: err.message });
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Registration successful");
      // New flow: redirect to verify-otp with email
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: AxiosError) => {
      const err = getErrorMessage(error.response?.data);
      toast.error(err.title, { description: err.message });
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();
  const setAuthFromLogin = useAuthStore((s) => s.setAuthFromLogin);

  return useMutation({
    mutationFn: verifyEmailRequest,
    onSuccess: (data) => {
      setAuthFromLogin({
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
      });
      toast.success("Email verified successfully");
      router.push("/dashboard");
    },
    onError: (error: AxiosError) => {
      const err = getErrorMessage(error.response?.data);
      toast.error(err.title, { description: err.message });
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtpRequest,
    onSuccess: (data) => {
      toast.success(data.message || "OTP resent successfully");
    },
    onError: (error: AxiosError) => {
      const err = getErrorMessage(error.response?.data);
      toast.error(err.title, { description: err.message });
    },
  });
};

export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserRequest,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Reset link sent");
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}&type=reset`);
    },
    onError: (error: AxiosError) => {
      const err = getErrorMessage(error.response?.data);
      toast.error(err.title, { description: err.message });
    },
  });
};

export const useVerifyOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: (data) => {
      localStorage.setItem("resetToken", data.resetToken);
      toast.success("OTP verified");
      router.push("/reset-password");
    },
    onError: (error: AxiosError) => {
      const err = getErrorMessage(error.response?.data);
      toast.error(err.title, { description: err.message });
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => {
      const resetToken = localStorage.getItem("resetToken") || "";
      return resetPasswordRequest(payload, resetToken);
    },
    onSuccess: () => {
      localStorage.removeItem("resetToken");
      toast.success("Password reset successful");
      router.push("/signin");
    },
    onError: (error: AxiosError) => {
      const err = getErrorMessage(error.response?.data);
      toast.error(err.title, { description: err.message });
    },
  });
};

export const useGoogleLogin = () => {
  return googleLoginRedirect;
};

export const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    clearAuth();
    router.push("/signin");
    toast.success("Logged out successfully");
  };
};
