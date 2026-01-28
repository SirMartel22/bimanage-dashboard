import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  illustrationSrc: string;
}

// <div className="relative h-full bg-[#085AD9]/50 w-full pl-8 pb-8 flex items-center">

const AuthLayout = ({ illustrationSrc }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen absolute w-full hidden lg:block lg:w-1/2 bg-[url('/illustrations/auth-bg.jpg')] bg-cover bg-center items-center relative overflow-hidden">
      <div className="flex flex-col items-center justify-start gap-12 relative h-full bg-[#085AD9]/50 w-full pl-8 pt-20 flex items-center pl-4 pr-2">
        <div className="illustration-text ">
          <h1 className="text-5xl xl:text-4xl font-medium mb-4 leading-tight max-w-[90%] text-white">
            {" "}
            Grow Smart. Sell Smarter. Manage Everything with iManage
          </h1>
        </div>

        <div className="illustration-image w-{90%]">
          <Image
            alt="illustration"
            src={illustrationSrc}
            width={300}
            height={300}
            className="w-full"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
