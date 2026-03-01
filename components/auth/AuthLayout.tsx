import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  illustrationText?: string;
  illustrationSrc?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  illustrationText = "Grow Smart. Sell Smarter. Manage Everything with iManage.",
  illustrationSrc = "/illustrations/sign-up-illustration.svg",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.1)]">
      {/* Left Panel - Illustration (Hidden on mobile) */}
      <div className="absolute w-full hidden lg:block lg:w-1/2 bg-[url('/illustrations/auth-bg.jpg')] bg-cover bg-center items-center relative overflow-hidden rounded-bl-md rounded-tl-md rounded-tr-xl rounded-br-xl ">
        <div className="relative h-full bg-[#085AD9]/50 w-full pl-8 pb-8 flex items-center">
          <div className="relative z-10 text-white lg:flex flex-col items-center gap-20 w-full">
            <h1 className="text-5xl xl:text-4xl font-medium mb-4 leading-tight max-w-[90%]">
              {illustrationText}
            </h1>

            {/* Placeholder for illustration - we'll add the actual image later */}
            <div className="">
              <Image
                alt="illustration"
                src={illustrationSrc}
                width={500}
                height={500}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="mb-8 text-center ">
            <h2 className="text-[30px] font-bold text-gray-900 mb-4 ">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-[16px]">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
