"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Image from "next/image";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic
    console.log("Sign up:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Join the all-in-one platform to handle your inventory, tasks, and billings without chaos"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5 flex flex-col items-center justify-center"
      >
        {/* Name Input */}
        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-[16px] font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Sammy Jackson"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Email Input */}
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-[16px] font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Sammyjackson12@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Username input */}
        <div className="w-full">
          <label
            htmlFor="username"
            className="block text-[16px] font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="simmexx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Password Input */}
        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-[16px] font-medium text-gray-700 mb-2"
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
              placeholder="Min.8 c haracters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="w-full">
          <label
            htmlFor="confirm-password"
            className="block text-[16px] font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
            />

            <div className="my-3 flex items-center justify-center gap-1">
              <input type="checkbox" />
              <p>I agree to Terms & Conditions</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-8">
          <button
            type="button"
            className=" flex items-center justify-center gap-3 py-2 px-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/illustrations/google-logo.svg"
              width={100}
              height={100}
              alt="google-icon"
            />

            {/* <span className="text-gray-700 font-black">Google</span> */}
          </button>

          <button
            type="button"
            className=" flex items-center justify-center gap-3 py-2 px-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/illustrations/apple-logo.PNG"
              width={100}
              height={100}
              alt="apple icon"
            />
            {/* <span className="text-gray-700 font-black">Apple</span> */}
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-2">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
