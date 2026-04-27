import React from 'react';
// import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  illustrationText?: string;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle,
  illustrationText = "Grow Smart. Sell Smarter. Manage Everything with Manage."
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
            {illustrationText}
          </h1>
          
          {/* Placeholder for illustration - we'll add the actual image later */}
          <div className="mt-8 flex items-center justify-center">
            <div className="w-80 h-80 bg-blue-400/20 rounded-lg flex items-center justify-center">
              <p className="text-sm opacity-70">Illustration Area</p>
            </div>
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}