"use client";

// export const dynamic = "force-dynamic";

import React, { useState } from "react";
// import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import PasswordValidation from "@/components/authflow/PasswordValidation";
import { useRouter } from "next/navigation";
// import AuthLayout from "@/components/auth/AuthLayout";
import AuthLayout from "@/components/authflow/AuthLayout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors on change
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    const confirmError =
      formData.password !== formData.confirmPassword
        ? "Passwords do not match"
        : "";

    if (passwordError || confirmError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmError,
      });
      return;
    }

    // Handle password reset logic
    console.log("Resetting password");

    // Navigate to success page
    router.push("/auth/success");
  };

  return (
    <div className="lg:flex">
      <AuthLayout illustrationSrc="/illustrations/password-reset-illustration.svg"></AuthLayout>

      <div className="w-full lg:w-[50%] lg:px-24">
        <div className="flex flex-col items-center justify-center mt-24 mb-12 lg:mb-12">
          <h1 className="font-black text-2xl lg:text-4xl text-center py-6">
            Password Reset
          </h1>
          <p className="font-sm text-center text-sm max-w-[80%] lg:text-md lg:w-full">
            Create a new strong password to continue using iManage today
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6 lg:flex lg:flex-col lg:items-center lg:justify-center px-6 lg:px-0"
        >
          {/* New Password Input */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
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
                placeholder="Enter new password"
                className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12`}
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="w-full">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setConfirmFocused(true)}
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmFocused && (
              <PasswordValidation 
                password={formData.password} 
                confirmPassword={formData.confirmPassword} 
              />
            )}
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/2 bg-[#085AD9] cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm mb-8 mt-6 lg:mt-8"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
