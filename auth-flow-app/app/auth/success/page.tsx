'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Auto-redirect to sign in after 5 seconds
    const timer = setTimeout(() => {
      router.push('/auth/signin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AuthLayout 
      title="Success!" 
      subtitle=""
    >
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Password Reset Successfully!
          </h3>
          <p className="text-gray-600">
            Your password has been reset successfully.<br />
            You can now sign in with your new password.
          </p>
        </div>

        {/* Sign In Button */}
        <div className="pt-4">
          <Link 
            href="/auth/signin"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
          >
            Continue to Sign In
          </Link>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-sm text-gray-500">
          You will be redirected to sign in page in 5 seconds...
        </p>
      </div>
    </AuthLayout>
  );
}