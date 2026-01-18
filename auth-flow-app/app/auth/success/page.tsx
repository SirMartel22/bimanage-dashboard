"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Auto-redirect to sign in after 5 seconds
    // const timer = setTimeout(() => {
    //   router.push("/auth/signin");
    // }, 5000);
    // return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="text-center space-y-6 bg-[#085AD9]/500 h-screen ">
      <div className=" bg-white-300">
        {/* Success Message */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">Success!!</h3>
          <p className="text-gray-600">
            Congratulations, Your password has been changed successfully, you
            can now login into your account
          </p>
        </div>

        {/* Sign In Button */}
        <div className="pt-4">
          <Link
            href="/auth/signin"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
