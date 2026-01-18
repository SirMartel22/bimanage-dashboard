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
  illustrationText = "Grow Smart. Sell Smarter. Manage Everything with Manage.",
  illustrationSrc = "/illustrations/sign-up-illustration.svg",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.1)]">
      {/* Left Panel - Illustration (Hidden on mobile) */}
      <div className="w-full hidden lg:flex lg:w-1/2 bg-[#085AD9] items-center relative overflow-hidden rounded-bl-md rounded-tl-md rounded-tr-xl rounded-br-xl pt-24 pl-8 pb-8">
        <div className="relative z-10 text-white lg:flex flex-col items-center gap-20 w-full">
          <h1 className="text-5xl xl:text-5xl font-medium mb-4 leading-tight">
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

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="mb-8 text-center ">
            <h2 className="text-[30px] font-bold text-gray-900 mb-8 ">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-[12px]">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
