"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/authflow/AuthLayout";
import { useVerifyEmail, useVerifyOtp, useResendOtp } from "@/api/auth/hooks";
import { getErrorMessage } from "@/api/types";

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const verifyEmailMutation = useVerifyEmail();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"register" | "reset">("register");
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setEmail(searchParams.get("email") || "");
    const typeParam = searchParams.get("type");
    if (typeParam === "reset") setType("reset");
  }, [searchParams]);

  const isLoading = type === "register" ? verifyEmailMutation.isPending : verifyOtpMutation.isPending;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (!email) {
      console.error("Email is required for OTP verification.");
      return;
    }

    if (otpCode.length === 6) {
      setError(null);
      try {
        if (type === "register") {
          await verifyEmailMutation.mutateAsync({ email, otp: otpCode });
        } else {
          await verifyOtpMutation.mutateAsync({ email, otp: otpCode });
        }
      } catch (err) {
        const apiError = getErrorMessage(err);
        setError(apiError.message);
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    
    try {
      await resendOtpMutation.mutateAsync({ email });
    } catch (err) {
      // Handled by hook
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="lg:flex">
      <AuthLayout illustrationSrc="/illustrations/enter-otp-illustration.svg"></AuthLayout>
      <div className="w-full lg:w-[50%] lg:px-24">
        <div className="flex flex-col items-center justify-center mt-24 lg:mb-16">
          <h1 className="font-black text-2xl lg:text-4xl text-center py-6">Enter OTP</h1>
          <p className="font-sm text-center text-sm max-w-[80%] lg:text-md lg:w-full">
            Enter the code sent to <span className="font-bold">{email || "your email"}</span> to {type === "register" ? "verify your account" : "reset your password"}.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="lg:space-y-6 flex flex-col items-center justify-center py-12">
          <label className="w-full font-bold pl-16 lg:pl-0">Enter OTP</label>
          <div className="flex gap-2 lg:gap-4 justify-center items-center w-full">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-10 h-12 lg:w-12 lg:h-14 text-center text-sm lg:text-2xl font-bold border-0 border-b-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <button
            type="submit"
            disabled={!isComplete || isLoading}
            className="w-2/3 lg:w-1/2 bg-[#085AD9] hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm mb-8 my-6"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <button type="button" onClick={handleResend} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
