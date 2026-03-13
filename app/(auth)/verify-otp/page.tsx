"use client";
// export const dynamic = "force-dynamic";
import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
import { useRouter } from "next/navigation";
// import AuthLayout from "@/components/auth/AuthLayout";
import AuthLayout from "@/components/authflow/AuthLayout";

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
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 3);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length === 4) {
      //  Handle OTP verification logic
      console.log("Verifying OTP:", otpCode);

      // Navigate to reset password page
      router.push("/auth/reset-password");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
    //  Handle resend OTP logic
    console.log("Resending OTP...");
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="lg:flex">
      <AuthLayout illustrationSrc="/illustrations/enter-otp-illustration.svg"></AuthLayout>

      <div className="w-full lg:w-[50%] lg:px-24">
        <div className="flex flex-col items-center justify-center mt-24 lg:mb-16">
          <h1 className="font-black text-2xl lg:text-4xl text-center py-6">
            Enter OTP
          </h1>
          <p className="font-sm text-center text-sm max-w-[80%] lg:text-md lg:w-full">
            Enter the code sent to ad************12@gmail.com to reset your
            password.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="lg:space-y-6 flex flex-col items-center justify-center py-12"
        >
          {/* OTP Input Boxes */}
          <label className="w-full font-bold pl-16 lg:pl-0">Enter OTP</label>
          <div className="flex gap-2 lg:gap-18 justify-center items-center w-full">
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
                // placeholder="_"
                className=" w-12 h-14 text-center text-sm lg:text-2xl font-bold border-0 border-b-2 border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isComplete}
            className="w-2/3 lg:w-1/2 bg-[#085AD9] cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm mb-8 my-6"
          >
            Verify
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
          {/* <p className="text-xs text-gray-500 text-center">
            Code expires in 10:00
          </p> */}
        </form>
      </div>
    </div>
  );
}
