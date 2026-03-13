"use client";

// export const dynamic = "force-dynamic";

import React, { useState } from "react";

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
  MdCopyAll,
  MdShare,
  MdNotifications,
  MdEmail,
  MdKeyboardArrowDown,
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

// ── Sub Components ─────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  value,
  label,
  iconBg,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconBg: string;
}) => (
  <div className="flex items-center gap-3">
    <div
      className="w-[44px] h-[44px] rounded-[9px] flex items-center justify-center shrink-0"
      style={{ background: iconBg }}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[22px] font-bold text-gray-900 leading-none">
        {value}
      </span>
      <span className="text-[13px] text-gray-500 mt-0.5">{label}</span>
    </div>
  </div>
);

const DonutChart = () => {
  const size = 140;
  const strokeWidth = 18;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { color: "#1e3a5f", pct: 0.4 },
    { color: "#f5c842", pct: 0.35 },
    { color: "#e85d4a", pct: 0.25 },
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
          0%
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
      <div className="bg-gray-800 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <p className="font-semibold text-gray-200 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="m-0">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Dashboard Page ─────────────────────────────────────────────────────────

const Dashboard = () => {
  // const [copied, setCopied] = useState(false);
  // const [showOnboarding, setShowOnboarding] = useState(false);
  // const completedSteps = onboardingSteps.filter((s) => s.done).length;
  // const url = "https://imanage.com.ng";

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(url);
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  // };

  const {
    userType,
    copied,
    showOnboarding,
    profile,
    url,
    chartData,
    legendItems,
    onboardingSteps,
    handleCopy,
    toggleOnboarding,
    toggleUserType,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-30 bg-white flex items-center gap-2.5 px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-[5px] font-mono text-xs text-gray-700">
          <span className="font-sans text-[11px] text-gray-400 mr-0.5">
            Website url:
          </span>
          {url}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors border-none cursor-pointer"
        >
          <MdCopyAll size={14} />
          {copied ? "Copied!" : "Copy"}
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors border-none cursor-pointer">
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
              SA
            </div>
            <span className="text-[13px] font-semibold text-gray-700">
              Samuel Adebayo
            </span>
            <MdKeyboardArrowDown size={17} className="text-gray-400" />
          </div>
        </div>
      </header>

      {/* ── Stats Strip ── */}
      <div className="flex items-center justify-around gap-4 px-6 py-5 border-b border-gray-100">
        {[
          {
            icon: <MdInventory2 size={28} color="#3b82f6" />,
            value: profile.stats.inventory,
            label: "Inventory",
            iconBg: "#eff6ff",
          },
          {
            icon: <MdStar size={28} color="#f59e0b" />,
            value: profile.stats.sales,
            label: "Sales",
            iconBg: "#fffbeb",
          },
          {
            icon: <MdShoppingBag size={28} color="#ef4444" />,
            value: profile.stats.stock,
            label: "Stock",
            iconBg: "#fef2f2",
          },
          {
            icon: <MdChecklist size={28} color="#8b5cf6" />,
            value: profile.stats.todos,
            label: "To-do task",
            iconBg: "#f5f3ff",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-gray-50 rounded-xl flex items-center justify-center px-6 py-4 w-[200px]"
          >
            <StatCard
              icon={card.icon}
              value={card.value}
              label={card.label}
              iconBg={card.iconBg}
            />
          </div>
        ))}
      </div>

      {/* ── Greeting ── */}
      <div className="px-6 pt-5">
        <p className="text-[16px] font-bold text-gray-900">Hello, Evan</p>
      </div>

      {/* DEV ONLY — remove before production */}
      <div className="flex items-center gap-2 mx-6 mb-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg w-fit">
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
      </div>

      {/* ── BIGGER CONTAINER: flex-col, full width ── */}
      <div className="flex flex-col w-full px-6 py-5 gap-6">
        {/* ── ROW 1: Reports + Analytics ── */}
        {/* flex-col on small, flex-row on md+ */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Reports card — equal half width */}
          <div className="bg-white rounded-2xl w-full md:w-1/2 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-bold text-gray-900">
                Reports
              </span>
              <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 flex">
                <MdMoreHoriz size={18} />
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
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    name="Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="distribution"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    name="Distribution"
                  />
                  <Line
                    type="monotone"
                    dataKey="returns"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={false}
                    name="Returns"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />{" "}
                Sales
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />{" "}
                Distribution
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />{" "}
                Returns
              </div>
            </div>
          </div>

          {/* Analytics card — equal half width */}
          <div className="bg-white rounded-2xl w-full md:w-1/2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-bold text-gray-900">
                Analytics
              </span>
              <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 flex">
                <MdMoreHoriz size={18} />
              </button>
            </div>
            <DonutChart />
            <div className="flex gap-4 mt-6 items-center justify-center">
              {legendItems.map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-2 text-xs text-gray-500"
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
        {/* flex-col on small, flex-row on md+ */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Recent Orders card — equal half width */}
          <div className="bg-white rounded-2xl w-full md:w-1/2 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-gray-900">
                Recent Orders
              </span>
              <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 flex">
                <MdMoreHoriz size={18} />
              </button>
            </div>

            {/* <div className="flex flex-col items-center justify-center gap-2.5 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <MdChecklist size={44} className="text-gray-300" />
              <p className="text-xs text-gray-400">
                You have no recent orders yet
              </p>
            </div> */}

            {profile.orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2.5 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <MdChecklist size={44} className="text-gray-300" />
                <p className="text-xs text-gray-400">
                  You have no recent orders yet
                </p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Tracking no</th>
                    <th className="text-left pb-2 font-medium">Product Name</th>
                    <th className="text-left pb-2 font-medium">Price</th>
                    <th className="text-left pb-2 font-medium">Total Order</th>
                    <th className="text-left pb-2 font-medium">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.orders.map((order) => (
                    <tr
                      key={order.trackingNo}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2.5 text-gray-400">
                        {order.trackingNo}
                      </td>
                      <td className="py-2.5 text-gray-700 font-medium">
                        {order.productName}
                      </td>
                      <td className="py-2.5 text-gray-600">${order.price}</td>
                      <td className="py-2.5">
                        <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-semibold">
                          {order.totalOrder}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-700">
                        ${order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Right sub-column: Onboarding + Top Products — equal half width */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            {/* Onboarding card */}
            <div className="bg-white rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] font-bold text-gray-900">
                  Onboarding steps
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {/* {completedSteps} of {onboardingSteps.length} complete */}

                  {onboardingSteps.filter((s)=> s.done).length} of {onboardingSteps.length} complete
                </span>
                <button
                  // onClick={() => setShowOnboarding((prev) => !prev)}
                  onClick={toggleOnboarding}
                  className="flex items-center gap-0.5 text-[11px] text-blue-500 hover:text-blue-600 bg-transparent border-none cursor-pointer p-0 transition-colors"
                >
                  {showOnboarding ? "Show less" : "Show more"}
                  <MdKeyboardArrowRight
                    size={13}
                    style={{
                      transform: showOnboarding
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
              </div>

              {/* Dropdown steps */}
              <div
                style={{
                  maxHeight: showOnboarding
                    ? `${onboardingSteps.length * 36}px`
                    : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <div className="flex flex-col gap-2 pt-3">
                  {onboardingSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {step.done ? (
                        <MdCheckCircle
                          size={16}
                          className="text-blue-500 shrink-0"
                        />
                      ) : (
                        <MdRadioButtonUnchecked
                          size={16}
                          className="text-gray-300 shrink-0"
                        />
                      )}
                      <span
                        className={`text-xs ${step.done ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products card */}
            <div className="bg-white rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold text-gray-900">
                  Top Products
                </span>
                <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 flex">
                  <MdMoreHoriz size={18} />
                </button>
              </div>

              {/* <div className="flex flex-col items-center justify-center gap-2.5 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <MdShoppingBag size={36} className="text-gray-300" />
                <p className="text-[11px] text-gray-400 text-center">
                  You have no top selling products yet.
                </p>
              </div> */}

              {profile.topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2.5 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <MdShoppingBag size={36} className="text-gray-300" />
                  <p className="text-[11px] text-gray-400 text-center">
                    You have no top selling products yet.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {profile.topProducts.map((product) => (
                    <div
                      key={product.name}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <MdShoppingBag size={20} className="text-gray-400" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-yellow-400">
                          {"★".repeat(product.rating)}
                          {"☆".repeat(5 - product.rating)}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        ${product.price}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ── End Bigger Container ── */}

      {/* ── Chat FAB ── */}
      <div className="fixed bottom-5 right-5 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center cursor-pointer shadow-lg">
        <MdChat size={20} color="#fff" />
      </div>
    </div>
  );
};

export default Dashboard;
