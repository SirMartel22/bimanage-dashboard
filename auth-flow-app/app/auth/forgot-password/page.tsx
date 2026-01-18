"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle forgot password logic
    console.log("Reset password for:", email);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email address to reset your password"
      illustrationSrc="/illustrations/forgot-pass-illustration.svg"
    >
      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 flex flex-col items-center justify-center"
        >
          {/* Email Input */}
          <div className="w-full mt-8">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/2 bg-[#085AD9] cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm mb-8"
          >
            Submit
          </button>

          {/* Info Text */}
          <p className="text-sm text-gray-600 text-center mt-4">
            We&apos;ll send you an email with instructions to reset your
            password
          </p>
        </form>
      ) : (
        <div className="text-center space-y-4">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h3 className="text-xl font-semibold text-gray-900">
            Check your email
          </h3>
          <p className="text-gray-600">
            We&apos;ve sent a password reset link to
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>

          {/* Resend Link */}
          <div className="pt-4">
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Didn&apos;t receive the email? Resend
            </button>
          </div>

          {/* Back to Sign In */}
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 pt-4"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
