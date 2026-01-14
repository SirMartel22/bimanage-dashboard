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
  illustrationSrc = "/illustrations/sign-up-illustration.svg"
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.1)]">
      {/* Left Panel - Illustration (Hidden on mobile) */}
      <div className="w-full hidden lg:flex lg:w-1/2 bg-[#085AD9] items-center justify-start p-12 relative overflow-hidden rounded-bl-md rounded-tl-md rounded-tr-xl rounded-br-xl">
        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
            {illustrationText}
          </h1>

          {/* Placeholder for illustration - we'll add the actual image later */}
          <div className="mt-8 flex items-center justify-center">
            {/* <div className="w-80 h-80 bg-blue-400/20 rounded-lg flex items-center justify-center">
              <p className="text-sm opacity-70">Illustration Area</p>
            </div> */}
            <Image
              alt="illustration"
              src={illustrationSrc}
              width={300}
              height={300}
              className="w-full max-w-sm"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8 ">{title}</h2>
            {subtitle && <p className="text-gray-600 ">{subtitle}</p>}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
