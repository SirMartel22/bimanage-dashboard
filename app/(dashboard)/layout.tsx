"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MdSpaceDashboard,
  MdInventory,
  MdSubscriptions,
  MdFolder,
  MdStorefront,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SideBarLayoutProps {
  children: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <MdSpaceDashboard size={17} />,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: <MdInventory size={17} />,
  },
  {
    label: "Subscription",
    href: "/subscription",
    icon: <MdSubscriptions size={17} />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <MdFolder size={17} />,
  },
  {
    label: "Vendor",
    href: "/vendor",
    icon: <MdStorefront size={17} />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <MdSettings size={17} />,
  },
];

export default function SidebarLayout({ children }: SideBarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1f38]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* ─── DESKTOP SIDEBAR (hidden on mobile) ─── */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[200px] bg-[#0f1f38] flex-col z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 px-[18px] py-5 border-b border-white/[0.08]">
          <div className="w-[30px] h-[30px] bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono shrink-0">
            BiM
          </div>
          <span className="text-white text-[15px] font-bold tracking-wide">
            BiManage
          </span>
        </div>

        {/* Nav links */}
        <ul className="flex-1 flex flex-col gap-0.5 px-[10px] py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-[9px] px-3 py-[9px] text-[13px] font-medium no-underline transition-all duration-150",
                    isActive
                      ? "bg-white text-[#0f2952] font-semibold rounded-l-[10px] rounded-r-none -mr-[10px] pr-[22px]"
                      : "text-white/55 rounded-lg hover:text-white/85 hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-[10px] pb-4 pt-3 border-t border-white/[0.08]">
          {/* User */}
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="relative w-[30px] h-[30px] rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {user ? getInitials(user.name) : "U"}
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-[1.5px] border-[#0f1f38]"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11.5px] font-semibold truncate">
                {user?.name || "User"}
              </p>
              <p className="text-white/40 text-[10px] mt-0.5">{user?.role || "Member"}</p>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-[7px] w-full px-[10px] py-2 rounded-lg text-red-400 text-[12.5px] font-medium bg-transparent border-none cursor-pointer hover:bg-red-500/10 transition-colors duration-150 mt-0.5"
          >
            <MdLogout size={15} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ─── PAGE CONTENT ─── */}
      <main className="md:ml-[200px] flex-1 bg-white min-h-screen flex flex-col pb-[64px] md:pb-0">
        {children}
      </main>

      {/* ─── MOBILE BOTTOM NAV (hidden on desktop) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f1f38] border-t border-white/[0.08]">
        <ul className="flex items-center justify-around h-[64px] px-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.label} className="flex-1">
                <Link
                  href={item.href}
                  className={[
                    "flex flex-col items-center justify-center gap-[3px] py-2 px-1 no-underline transition-all duration-150",
                    isActive ? "text-white" : "text-white/40",
                  ].join(" ")}
                >
                  {/* Icon wrapper — highlight active with a pill background */}
                  <span
                    className={[
                      "flex items-center justify-center w-[36px] h-[22px] rounded-full transition-all duration-150",
                      isActive ? "bg-white/15" : "",
                    ].join(" ")}
                  >
                    {/* Re-render icon at mobile size */}
                    {item.href === "/dashboard" && (
                      <MdSpaceDashboard size={20} />
                    )}
                    {item.href === "/inventory" && <MdInventory size={20} />}
                    {item.href === "/subscription" && (
                      <MdSubscriptions size={20} />
                    )}
                    {item.href === "/projects" && <MdFolder size={20} />}
                    {item.href === "/vendor" && <MdStorefront size={20} />}
                    {item.href === "/settings" && <MdSettings size={20} />}
                  </span>

                  <span className="text-[10px] font-medium leading-none">
                    {/* Shorten "Subscription" to fit on small screens */}
                    {item.label === "Subscription" ? "Sub..." : item.label}
                  </span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-white mt-[1px]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Safe-area spacer for phones with home indicator */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
