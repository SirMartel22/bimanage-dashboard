import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './request';
import { User, CurrentUserResponse } from './type';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const initRef = useRef(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const token = localStorage.getItem('token');
    let authToken = token;

    // Check for token in cookies (from Google OAuth callback)
    if (!authToken) {
      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      if (cookieToken) {
        localStorage.setItem('token', cookieToken);
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        authToken = cookieToken;
      }
    }

    // Single setState call
    setAuthState({
      user: null,
      token: authToken || null,
      isLoading: false,
      isAuthenticated: !!authToken,
    });
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.login({ email, password });
      const { token, user } = response;

      localStorage.setItem('token', token);
      setAuthState({
        user: user ?? null,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      router.push('/dashboard');
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [router]);

  // Register function
  const register = useCallback(async (name: string, username: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.register({ name, username, email, password });
      const { token, user } = response;

      localStorage.setItem('token', token);
      setAuthState({
        user: user ?? null,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      router.push('/dashboard');
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [router]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push('/signin');
  }, [router]);

  // Google login
  const googleLogin = useCallback(() => {
    authApi.googleLogin();
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    googleLogin,
  };
}

// Hook for fetching current user data
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response: CurrentUserResponse = await authApi.getCurrentUser();
      setUser(response.user);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}

// Hook for password reset flow
export function usePasswordReset() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.forgotPassword({ email });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyOtp({ email, otp });
      localStorage.setItem('resetToken', response.resetToken);
      router.push('/reset-password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const resetPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);

    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      setError('Reset token not found');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.resetPassword({ password }, resetToken);
      localStorage.removeItem('resetToken');
      router.push('/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    forgotPassword,
    verifyOtp,
    resetPassword,
    isLoading,
    error,
  };
}