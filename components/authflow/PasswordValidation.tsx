import React from "react";
import { Check, X } from "lucide-react";

interface PasswordValidationProps {
  password: string;
  confirmPassword?: string;
  isLogin?: boolean;
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
  confirmPassword,
  isLogin = false,
}) => {
  if (!password) return null;

  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least one number", met: /\d/.test(password) },
  ];

  if (confirmPassword !== undefined) {
    checks.push({
      label: "Passwords must match",
      met: password.length > 0 && password === confirmPassword,
    });
  }

  const allPassed = checks.every((c) => c.met);

  if (allPassed) return null;

  return (
    <div className="w-full mt-2 space-y-1">
      {checks.map((check, index) => (
        <div
          key={index}
          className={`flex items-center text-xs transition-colors duration-200 ${
            check.met ? "text-green-600" : "text-red-500"
          }`}
        >
          {check.met ? (
            <Check size={14} className="mr-2 shrink-0" />
          ) : (
            <X size={14} className="mr-2 shrink-0" />
          )}
          <span>{check.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordValidation;
