"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length === 6) {
      // TODO: Handle OTP verification logic
      console.log("Verifying OTP:", otpCode);

      // Navigate to reset password page
      router.push("/auth/reset-password");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // TODO: Handle resend OTP logic
    console.log("Resending OTP...");
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <AuthLayout
      title="Enter OTP"
      subtitle="We've sent a 6-digit code to your email"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Back Button */}
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* OTP Input Boxes */}
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              placeholder="_"
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify OTP
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn&apos;t receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Resend OTP
          </button>
        </div>

        {/* Timer (Optional) */}
        <p className="text-xs text-gray-500 text-center">
          Code expires in 10:00
        </p>
      </form>
    </AuthLayout>
  );
}
