"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle sign in logic
    console.log("Forgot-passwords:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Forgot Password! Kindly enter your email address below to reset your password"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-8 flex flex-col items-center"
      >
        {/* Email Input */}
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
          Sign In
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
