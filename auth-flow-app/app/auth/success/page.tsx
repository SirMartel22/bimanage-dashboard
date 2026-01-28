"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/authflow/AuthLayout";

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
    <div className="text-center bg-[#085AD9]/500 h-screen px-16">
      <div className="text-center p-12 flex-flex-col justify-center items-center ">
        <div className=" bg-white h-[80vh] p-16 flex flex-col items-center justify-center">
          {/* Success Message */}
          <div className="space-y-5">
            <h3 className="text-2xl font-medium lg:text-5xl font-bold text-gray-900">
              Success!!
            </h3>
            <p className="text-gray-600 mb-5">
              Congratulations, Your password has been changed successfully, you
              can now login into your account
            </p>
          </div>

          {/* Sign In Button */}
          <div className="pt-4 w-1/4">
            <Link
              href="/auth/signin"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors duration-200 shadow-sm p-4"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
