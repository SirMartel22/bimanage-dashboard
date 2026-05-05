// API Response Types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user?: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  resetToken: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}

// Request Body Types
export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  password: string;
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
}