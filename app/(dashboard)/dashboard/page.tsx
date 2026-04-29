"use client";

import { useDashboard } from "./useDashboard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  MdMoreHoriz,
  MdKeyboardArrowRight,
  MdInventory2,
  MdStar,
  MdShoppingBag,
  MdChecklist,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdChat,
} from "react-icons/md";
import { useState, useEffect } from "react";

import Header from "@/components/header/Header"

// ── Sub Components ─────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBg: string;
}) => (
  <div className="flex items-center gap-1.5 md:gap-3">
    <div className="flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[14px] md:text-[22px] font-bold text-gray-900 leading-none truncate">
        {value}
      </span>
      <span className="text-[8px] md:text-[13px] text-gray-400 mt-1 font-medium truncate uppercase tracking-tighter">
        {label}
      </span>
    </div>
  </div>
);

const DonutChart = ({ percent }: { percent: number }) => {
  const size = 140;
  const strokeWidth = 18;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const segments = percent > 0 ? [
    { color: "#1e3a5f", pct: percent / 100 },
    { color: "#f3f4f6", pct: (100 - percent) / 100 },
  ] : [
    { color: "#f3f4f6", pct: 1 },
  ];

  let offset = 0;
  return (
    <div className="flex justify-center">
      <svg width={size} height={size}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {segments.map((s, i) => {
          const dash = circumference * s.pct;
          const gap = circumference - dash;
          const rotation = -90 + offset * 360;
          offset += s.pct;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="butt"
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
          );
        })}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#111827"
        >
          {percent}%
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280"
        >
          Transactions
        </text>
      </svg>
    </div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
    [key: string]: unknown;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 rounded-lg px-3 py-2 text-xs text-white shadow-lg border border-gray-700">
        <p className="font-semibold text-gray-200 mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <p className="m-0">
              {p.name}: {p.value}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Dashboard Page ─────────────────────────────────────────────────────────

const Dashboard = () => {
  const {
    userType,
    showOnboarding,
    profile,
    chartData,
    legendItems,
    onboardingSteps,
    toggleOnboarding,
    toggleUserType,
    loading,
    error,
    user
  } = useDashboard();

  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name.split(" ")[0]);
    } else {
      // Fallback to localStorage if hook hasn't loaded yet
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "[object Object]") {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.name) {
            setUserName(parsed.name.split(" ")[0]);
          }
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
  }, [user]);



  const formatStatValue = (val: number, hasK: boolean) => {
    if (!hasK) return val;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md text-center">
          <p className="font-bold mb-2">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 md:pb-6">
      {/* ── Topbar ── */}
      <Header user={user} />


      {/* ── Stats Strip ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-6 border-b border-gray-100 md:justify-around md:px-6">
        {[
          {
            icon: <MdInventory2 size={20} className="md:w-7 md:h-7 text-blue-500" />,
            value: profile.stats.inventory,
            label: "Inventory",
            iconBg: "#eff6ff",
            hasK: true,
          },
          {
            icon: <MdStar size={20} className="md:w-7 md:h-7 text-amber-500" />,
            value: profile.stats.sales,
            label: "Sales",
            iconBg: "#fffbeb",
            hasK: true,
          },
          {
            icon: <MdShoppingBag size={20} className="md:w-7 md:h-7 text-red-500" />,
            value: profile.stats.stock,
            label: "Stock",
            iconBg: "#fef2f2",
            hasK: false,
          },
          {
            icon: <MdChecklist size={20} className="md:w-7 md:h-7 text-purple-500" />,
            value: profile.stats.todos,
            label: "To-do task",
            iconBg: "#f5f3ff",
            hasK: false,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex-1 flex items-center justify-center cursor-pointer"
            onClick={() => {
              if (card.label === "Inventory" || card.label === "Stock" || card.label === "Sales") {
                window.location.href = "/inventory";
              } else if (card.label === "To-do task") {
                window.location.href = "/projects";
              }
            }}
          >
            <StatCard
              icon={card.icon}
              value={formatStatValue(card.value, card.hasK)}
              label={card.label}
              iconBg={card.iconBg}
            />
          </div>
        ))}
      </div>

      {/* ── Greeting ── */}
      <div className="px-6 pt-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Hello, {userName}</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* DEV ONLY — remove before production */}
      {/* <div className="flex items-center gap-2 mx-6 mt-4 mb-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg w-fit">
        <span className="text-xs text-yellow-700 font-medium">Testing:</span>
        <button
          onClick={toggleUserType}
          className={`text-xs px-3 py-1 rounded-md border transition-colors ${
            userType === "new"
              ? "bg-white text-gray-500 border-gray-200"
              : "bg-blue-500 text-white border-blue-500"
          }`}
        >
          {userType === "new"
            ? "Switch to Existing User"
            : "Switch to New User"}
        </button>
      </div> */}

      {/* ── BIGGER CONTAINER: flex-col, full width ── */}
      <div className="flex flex-col w-full px-6 py-5 gap-6">
        {profile.orders.length === 0 && (
          <div className="bg-gradient-to-br from-[#1e315f] to-[#2a457a] rounded-[24px] p-6 md:p-8 text-white relative overflow-hidden shadow-xl border-none">
            {/* Design accents */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/10 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <h2 className="text-xl md:text-3xl font-black mb-3">Let's get started!!</h2>
              <p className="text-white/80 text-xs md:text-sm max-w-lg mb-8 leading-relaxed font-medium">
                Ready to take your business to the next level? Add your first product, 
                track your inventory, and start making sales with ease.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => window.location.href = "/inventory?action=add"}
                  className="bg-white text-[#1e315f] px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-md border-none cursor-pointer"
                >
                  Add Product
                </button>
                <button 
                  onClick={() => window.location.href = "/inventory?action=stock-in"}
                  className="bg-[#3b82f6]/20 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                >
                  Stock In
                </button>
                <button 
                  onClick={() => window.location.href = "/inventory?action=sell"}
                  className="bg-[#3b82f6]/20 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                >
                  Sell Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ROW 1: Reports + Analytics ── */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Reports card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 w-full lg:w-1/2 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[15px] font-bold text-gray-900">
                Reports
              </span>
              <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors">
                <MdMoreHoriz size={20} />
              </button>
            </div>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="distribution"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Distribution"
                  />
                  <Line
                    type="monotone"
                    dataKey="returns"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Returns"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-6 justify-center">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Analytics card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 w-full lg:w-1/2 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[15px] font-bold text-gray-900">
                Analytics
              </span>
              <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors">
                <MdMoreHoriz size={20} />
              </button>
            </div>
            <DonutChart percent={profile.analyticsPercent} />
            <div className="flex gap-6 mt-8 items-center justify-center">
              {legendItems.map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: l.color }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 2: Recent Orders + (Onboarding + Top Products) ── */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Recent Orders card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 w-full lg:w-1/2 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[15px] font-bold text-gray-900">
                Recent Orders
              </span>
              <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors">
                <MdMoreHoriz size={20} />
              </button>
            </div>

            {profile.orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                  <MdChecklist size={32} className="text-blue-500" />
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  You have no recent orders yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[500px]">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="text-left pb-3 font-semibold">Tracking no</th>
                      <th className="text-left pb-3 font-semibold">Product Name</th>
                      <th className="text-left pb-3 font-semibold">Price</th>
                      <th className="text-left pb-3 font-semibold">Total Order</th>
                      <th className="text-left pb-3 font-semibold">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.orders.map((order, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 text-gray-500 font-medium">
                          {order.trackingNo}
                        </td>
                        <td className="py-4 text-gray-900 font-bold">
                          {order.productName}
                        </td>
                        <td className="py-4 text-gray-600">${order.price.toLocaleString()}</td>
                        <td className="py-4">
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
                            {order.totalOrder}
                          </span>
                        </td>
                        <td className="py-4 text-gray-900 font-bold">
                          ${order.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right sub-column: Onboarding + Top Products */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            {/* Onboarding card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[15px] font-bold text-gray-900">
                  Onboarding steps
                </span>
              </div>

              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">
                  {onboardingSteps.filter((s) => s.done).length} of{" "}
                  {onboardingSteps.length} complete
                </span>
                <button
                  onClick={toggleOnboarding}
                  className="flex items-center gap-0.5 text-xs font-bold text-blue-500 hover:text-blue-600 bg-transparent border-none cursor-pointer p-1 transition-colors"
                >
                  {showOnboarding ? "Show less" : "Show more"}
                  <MdKeyboardArrowRight
                    size={16}
                    style={{
                      transform: showOnboarding
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${(onboardingSteps.filter(s => s.done).length / onboardingSteps.length) * 100}%` }}
                />
              </div>

              {/* Dropdown steps */}
              <div
                className="transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: showOnboarding ? "500px" : "0px",
                  opacity: showOnboarding ? 1 : 0,
                  overflow: "hidden",
                }}
              >
                <div className="flex flex-col gap-3 pt-2">
                  {onboardingSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      {step.done ? (
                        <MdCheckCircle
                          size={18}
                          className="text-green-500 shrink-0"
                        />
                      ) : (
                        <MdRadioButtonUnchecked
                          size={18}
                          className="text-gray-300 shrink-0"
                        />
                      )}
                      <span
                        className={`text-xs font-medium ${step.done ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[15px] font-bold text-gray-900">
                  Top Products
                </span>
                <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-50 transition-colors">
                  <MdMoreHoriz size={20} />
                </button>
              </div>

              {profile.topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <MdShoppingBag size={28} className="text-amber-500" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium text-center">
                    You have no top selling products yet.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {profile.topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MdShoppingBag size={24} className="text-blue-500" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <MdStar 
                              key={i} 
                              size={12} 
                              className={i < product.rating ? "text-amber-400" : "text-gray-200"} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat FAB ── */}
      <div 
        onClick={() => window.location.href = "/messages"}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center cursor-pointer shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all z-40"
      >
        <MdChat size={24} color="#fff" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white">1</span>
      </div>
    </div>
  );
};


export default Dashboard;
