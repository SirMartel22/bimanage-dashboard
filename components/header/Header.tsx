import Image from "next/image"
import { useDashboard } from "@/app/(dashboard)/dashboard/useDashboard"
import { useAuthStore } from "@/lib/store/auth-store";
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
  avatar?: string;
}

interface HeaderProps {
  user?: User | any | null;
}

const Header = ({ user: propUser }: HeaderProps) => {
    const storeUser = useAuthStore((s) => s.user);
    const [user, setUser] = useState<User | any | null>(null);
    const {
        url,
        handleCopy,
        copied
    } = useDashboard();

    useEffect(() => {
        if (propUser) {
            setUser(propUser);
        } else if (storeUser) {
            setUser(storeUser);
        } else {
            // Try to get user from localStorage first for instant display
            const storedUser = localStorage.getItem("user");
            if (storedUser && storedUser !== "undefined" && storedUser !== "[object Object]") {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user in Header", e);
                }
            }
        }
    }, [propUser, storeUser]);

    const getInitials = (name: string) => {
      if (!name) return "U";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
    };
    
  return (
    <div>
            {/* ── Topbar ── */}
            <header className="flex md:flex sticky top-0 z-30 bg-white items-center justify-around gap-2.5 px-6 py-4 md:py-8  border-b border-gray-100">
              <Image
                src="/illustrations/bimanage-mobile-logo.png"
                width={100}
                height={100}
                alt="Logo"
                className=" md:hidden"
              />
              <div className="hidden md:flex items-center gap-1.5 px-3 py-2 font-medium text-sm text-gray-700">
                <span className="text-gray-900 font-bold">
                  Website url:
                </span>
                <a href={url} className="text-blue-500 underline decoration-blue-500/30">
                  {url}
                </a>
              </div>
      
              <button
                onClick={handleCopy}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-[#1e3a5f] text-white hover:bg-[#2a4a7f] transition-all border-none cursor-pointer shadow-sm"
              >
                <MdCopyAll size={18} />
                {copied ? "Copied!" : "Copy"}
              </button>
      
              <button 
                onClick={handleCopy}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-[#1e3a5f] text-white hover:bg-[#2a4a7f] transition-all border-none cursor-pointer shadow-sm"
              >
                <MdShare size={18} />
                Share
              </button>
      
              <div className="ml-auto flex items-center gap-3.5">
                <button 
                  onClick={() => window.location.href = "/notifications"}
                  className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex relative"
                >
                  <MdNotifications size={22} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
                </button>
                <button 
                  onClick={() => window.location.href = "/messages"}
                  className="hidden md:flex text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  <MdEmail size={22} />
                </button>

                <div className="group relative flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[11px] font-bold text-white border border-gray-100">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user ? getInitials(user.name) : "U"
                    )}
                  </div>
                  <span className="hidden md:block text-[13px] font-semibold text-gray-700">
                    {user?.name || "User"}
                  </span>
                  <MdKeyboardArrowDown size={17} className="text-gray-400" />
                  
                  {/* Logout Dropdown */}
                  <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors rounded-lg border-none bg-transparent cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </header>
      
    </div>
  );
}

export default Header;
