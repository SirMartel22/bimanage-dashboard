"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import PasswordValidation from "@/components/authflow/PasswordValidation";
import AuthLayout from "@/components/authflow/AuthLayout";
import Image from "next/image";
import { useLogin, useGoogleLogin } from "@/api/auth/hooks";

const SignInPage = () => {
  const loginMutation = useLogin();
  const googleLogin = useGoogleLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");

  const isLoading = loginMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      // Redirect is handled in the hook
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="lg:flex">
      <AuthLayout illustrationSrc="/illustrations/sign-in-illustration.svg"></AuthLayout>
      <div className="w-full lg:w-[50%] my-24 lg:my-0">
        <div className="flex flex-col items-center justify-center ">
          <h1 className="font-black text-2xl lg:text-4xl text-center py-6">
            <span className=" px-6 font-medium">
              <span className="font-normal text-xl lg:text-3xl">Sign Up</span>
            </span>
            <span className="border-b-4 border-blue text-blue-600 ">
              Sign in
            </span>
          </h1>
          <p className="font-sm text-center text-sm max-w-[80%] lg:text-lg lg:max-w-108">
            Welcome back!! Kindly login to continue running your business like a
            pro
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-5 flex flex-col items-center justify-center py-8 px-8 lg:px-24 w-full"
        >
          {/* Email Input */}
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm lg:text-[16px] font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full text-sm lg:text-[16px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm lg:text-[16px] font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                placeholder="Enter your password"
                className="w-full text-sm lg:text-[16px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordFocused && <PasswordValidation password={formData.password} />}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between space-x-12">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-[90%] lg:w-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Or sign in with
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-8 justify-center">
          <button
            type="button"
            onClick={googleLogin}
            className="flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/illustrations/google-logo.svg"
              width={20}
              height={20}
              alt="google-icon"
            />
            <span className="text-gray-700 font-medium">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
