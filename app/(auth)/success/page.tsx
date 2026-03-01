"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import AuthLayout from "@/components/authflow/AuthLayout";

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
    <div className="text-center bg-[#085AD9]/500 h-screen lg:px-16 px-6 flex flex-col items-center justify-center">
      <div className="text-center lg:p-12 pt-12 flex-flex-col justify-center items-center ">
        <div className=" w-full lg:bg-white lg:h-[80vh] lg:p-16 flex flex-col items-center justify-center py-12">
          {/* Success Message */}
          <div className="space-y-5">
            <h3 className=" text-white lg:text-gray-800 text-2xl font-medium lg:text-5xl font-bold text-gray-900">
              Success!!
            </h3>
            <p className=" text-white lg:text-gray-600 mb-5">
              Congratulations, Your password has been changed successfully, you
              can now login into your account
            </p>
          </div>

          {/* Sign In Button */}
          <div className="pt-4 lg:w-1/4 w-1/2">
            <Link
              href="/signin"
              className="inline-block w-full bg-[#fff]/500 lg:bg-blue-600 hover:bg-blue-700 lg:text-white font-semibold rounded-md lg:rounded-full transition-colors duration-200 shadow-sm p-2 lg:p-4"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
