
import Image from "next/image"

import {useDashboard} from "@/app/(dashboard)/dashboard/useDashboard"


import {
  MdCopyAll,
  MdShare,
  MdNotifications,
  MdEmail,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
}

const Header = () => {

    const {
        url,
        handleCopy,
        copied
    } = useDashboard();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Try to get user from localStorage first for instant display
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }

        // Then fetch fresh data
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
            } catch (err) {
                console.error("Failed to sync user in header", err);
            }
        };

        fetchUser();
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    
  return (
    <div>
            {/* ── Topbar ── */}
            <header className="flex md:flex sticky top-0 z-30 bg-white flex items-center justify-around gap-2.5 px-6 py-4 md:py-8  border-b border-gray-100">
              <Image
                src="/illustrations/bimanage-mobile-logo.png"
                width={100}
                height={100}
                alt="Logo"
                className=" md:hidden"
              />
              <div className="hidden md:flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-[5px] font-mono text-xs text-gray-700">
                <span className="font-sans text-[11px] text-gray-400 mr-0.5">
                  Website url:
                </span>
                {url}
              </div>
      
              <button
                onClick={handleCopy}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors border-none cursor-pointer"
              >
                <MdCopyAll size={14} />
                {copied ? "Copied!" : "Copy"}
              </button>
      
              <button className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors border-none cursor-pointer">
                <MdShare size={14} />
                Share
              </button>
      
              <div className="ml-auto flex items-center gap-3.5">
                <button className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex">
                  <MdNotifications size={20} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex">
                  <MdEmail size={20} />
                </button>
                <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[11px] font-bold text-white">
                    {user ? getInitials(user.name) : "U"}
                  </div>
                  <span className="hidden md:block text-[13px] font-semibold text-gray-700">
                    {user?.name || "User"}
                  </span>
                  <MdKeyboardArrowDown size={17} className="text-gray-400" />
                </div>
              </div>
            </header>
      
    </div>
  );
}

export default Header;
