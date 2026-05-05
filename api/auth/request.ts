import {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  RegisterResponse,
  LoginResponse,
  ForgotPasswordResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
  CurrentUserResponse,
  ErrorResponse,
} from './type';

const BASE_URL = 'https://bimanage-backend.onrender.com/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error');
  }
}

export const authApi = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get current user (requires auth token)
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const token = localStorage.getItem('token');
    return apiRequest<CurrentUserResponse>('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return apiRequest<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify OTP
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    return apiRequest<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reset password (requires reset token)
  resetPassword: async (data: ResetPasswordRequest, resetToken: string): Promise<ResetPasswordResponse> => {
    return apiRequest<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resetToken}`,
      },
      body: JSON.stringify(data),
    });
  },

  // Google OAuth redirect
  googleLogin: () => {
    window.location.href = `${BASE_URL}/auth/google`;
  },
};