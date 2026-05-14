"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import PasswordValidation from "@/components/authflow/PasswordValidation";
import Image from "next/image";
import AuthLayout from "@/components/authflow/AuthLayout";
import { useRegister, useGoogleLogin } from "@/api/auth/hooks";
import { getErrorMessage } from "@/api/types";

type SignUpFormState = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

const SignUpPage = () => {
  const registerMutation = useRegister();
  const googleLogin = useGoogleLogin();

  const [formData, setFormData] = useState<SignUpFormState>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isLoading = registerMutation.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: SignUpFormState) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev: Record<string, string>) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.acceptedTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (err) {
      const apiError = getErrorMessage(err);
      setError(apiError.message);
    }
  };

  return (
    <div className="lg:flex">
      <AuthLayout illustrationSrc="/illustrations/sign-up-illustration.svg"></AuthLayout>
      <div className="w-full lg:w-[50%] ">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-black text-2xl lg:text-4xl text-center py-6">
            <span className="text-blue-600 px-6 font-medium">
              <span className="border-b-4 border-blue">Sign</span> Up
            </span>
            <span className="font-normal text-xl lg:text-3xl">Sign in</span>
          </h1>
          <p className="font-sm text-center text-sm max-w-[80%] lg:text-lg lg:max-w-108">
            Join the all-in-one platform to handle your inventory, tasks, and
            billing without the chaos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 flex flex-col items-center justify-center py-8 px-8 lg:px-24 w-full"
        >
          <div className="w-full">
            <label htmlFor="name" className="block text-sm lg:text-[16px] font-medium text-gray-700 mb-2">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Sammy Jackson"
              className={`w-full text-sm lg:text-[16px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${fieldErrors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="username" className="block text-sm lg:text-[16px] font-medium text-gray-700 mb-2">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="simmexx"
              className={`w-full px-4 py-2 text-sm lg:text-[16px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${fieldErrors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="email" className="block text-sm lg:text-[16px] font-medium text-gray-700 mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Sammyjackson12@gmail.com"
              className={`w-full px-4 py-2 text-sm lg:text-[16px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${fieldErrors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="password" title="Password must be at least 8 characters" className="block text-sm lg:text-[16px] font-medium text-gray-700 mb-2 cursor-help">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                placeholder="Min.8 characters"
                className="w-full px-4 py-2 text-sm lg:text-[16px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordFocused && <PasswordValidation password={formData.password} />}
          </div>

          <div className="w-full">
            <label htmlFor="confirmPassword" title="Passwords must match" className="block text-sm lg:text-[16px] font-medium text-gray-700 mb-2 cursor-help">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setConfirmFocused(true)}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2 text-sm lg:text-[16px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12 ${fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmFocused && <PasswordValidation password={formData.password} confirmPassword={formData.confirmPassword} />}
            <div className="my-4 lg:my-3 flex items-center justify-center gap-1 text-sm lg:text-lg">
              <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} />
              <p>I agree to Terms & Conditions</p>
            </div>
          </div>

          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-[90%] lg:w-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or sign up with</span></div>
          </div>

          <div className="flex gap-8">
            <button type="button" onClick={googleLogin} className="flex items-center justify-center gap-3 px-4 lg:py-2 lg:px-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Image src="/illustrations/google-logo.svg" width={20} height={20} alt="google-icon" />
              <span className="text-gray-700 font-medium">Google</span>
            </button>
            <button type="button" disabled className="flex items-center justify-center gap-3 px-4 lg:py-2 lg:px-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed">
              <Image src="/illustrations/apple-logo.PNG" width={20} height={20} alt="apple icon" />
            </button>
          </div>

          <p className="text-center text-gray-600 mt-2 text-sm lg:text-lg">
            Already have an account? <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
