"use client";

import React, { useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BsBoxSeam } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdFilterList } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { BsBagCheck } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiCircle } from "react-icons/fi";
import {
  MdCopyAll,
  MdShare,
  MdNotifications,
  MdEmail,
  MdKeyboardArrowDown,
} from "react-icons/md";

const areaData = [
  { name: "Jan", value: 300 },
  { name: "Feb", value: 600 },
  { name: "Mar", value: 450 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
  { name: "Jul", value: 400 },
  { name: "Aug", value: 600 },
  { name: "Sep", value: 300 },
  { name: "Oct", value: 500 },
];

const lowStockItems = [
  { name: "Trouser pant", qty: 10, brand: "Nike" },
  { name: "Trouser pant", qty: 10, brand: "Nike" },
  { name: "Trouser pant", qty: 10, brand: "Nike" },
  { name: "Trouser pant", qty: 10, brand: "Nike" },
];

const productSold = [
  {
    img: "📷",
    name: "Camera Lens",
    price: "$178",
    sold: 5,
    stock: 325,
    total: "$146,660",
  },
  {
    img: "👗",
    name: "Black Sleep Dress",
    price: "$14",
    sold: 30,
    stock: 53,
    total: "$46,660",
  },
  {
    img: "🧴",
    name: "Argan Oil",
    price: "$21",
    sold: 50,
    stock: 78,
    total: "$3,46,678",
  },
  {
    img: "🌸",
    name: "EAU DE Parfum",
    price: "$32",
    sold: 32,
    stock: 98,
    total: "$3,46,981",
  },
];

const stockPercent = { available: 70, low: 20, out: 10 };

const Dashboard = () => {
  const [copied, setCopied] = useState(false);
  const url = "https://imanage.com.ng";

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(true), 2000);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      {/* ── Topbar (sticky so it stays visible while scrolling) ── */}
      <header className="sticky top-0 z-30 bg-white flex items-center gap-2.5 px-6 py-3 border-b border-gray-100 mb-6">
        {/* URL pill */}
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

        {/* Right side */}
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

      {/* MAIN ROW: Left (stats + chart) + Right (stock availability) */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT COLUMN: Stats row + Chart */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Stats Row */}
          <div className="flex flex-row gap-4">
            {/* Total Inventory */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <BsBoxSeam className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total inventory</p>
                <p className="text-2xl font-bold text-gray-800">198k</p>
                <p className="text-xs text-gray-400">Completed inventory</p>
              </div>
            </div>

            {/* Total Sales */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <HiOutlineShoppingBag className="text-pink-500 text-xl" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total sales</p>
                <p className="text-2xl font-bold text-gray-800">$2.4k</p>
                <p className="text-xs text-gray-400">Completed inventory</p>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={areaData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c7d2fe" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Stock Availability */}
        <div className="bg-white rounded-2xl shadow-sm p-4 w-full md:w-72">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Stock Availability</h3>
            <div className="flex gap-2 text-gray-400">
              <BsBagCheck className="text-lg cursor-pointer" />
              <MdFilterList className="text-lg cursor-pointer" />
              <IoAddOutline className="text-lg cursor-pointer" />
            </div>
          </div>

          <p className="text-2xl font-bold text-gray-800">1500</p>
          <p className="text-xs text-gray-400 mb-3">Total Stock</p>

          {/* Legend */}
          <div className="flex gap-3 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{" "}
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />{" "}
              Low stock
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{" "}
              out of stock
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex rounded-full overflow-hidden h-4 mb-4">
            <div
              className="bg-green-500"
              style={{ width: `${stockPercent.available}%` }}
            />
            <div
              className="bg-yellow-400"
              style={{ width: `${stockPercent.low}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${stockPercent.out}%` }}
            />
          </div>

          {/* Low Stock List */}
          <p className="text-xs font-medium text-gray-500 mb-2">Low stock</p>
          <div className="space-y-2">
            {lowStockItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-yellow-400 rounded-full inline-block" />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="text-gray-500">{item.qty}</span>
                <span className="text-gray-500">{item.brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Product Sold + Product Analytics */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Product Sold */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Product sold</h3>
            <HiDotsHorizontal className="text-gray-400 cursor-pointer" />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b">
                <th className="text-left pb-2 font-medium">Product Name</th>
                <th className="text-left pb-2 font-medium">Price</th>
                <th className="text-left pb-2 font-medium">No sold</th>
                <th className="text-left pb-2 font-medium">Stock</th>
                <th className="text-left pb-2 font-medium">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {productSold.map((p, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 flex items-center gap-2">
                    <span className="text-lg">{p.img}</span>
                    <span className="text-gray-700 font-medium">{p.name}</span>
                  </td>
                  <td className="py-2 text-gray-600">{p.price}</td>
                  <td className="py-2 text-gray-600">{p.sold}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${p.stock > 100 ? "bg-blue-400" : p.stock > 60 ? "bg-teal-400" : "bg-orange-400"}`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Analytics */}
        <div className="bg-white rounded-2xl shadow-sm p-4 w-full md:w-64">
          <h3 className="font-semibold text-gray-700">Product analytics</h3>
          <p className="text-xs text-gray-400 mb-4">Manage your daily sales</p>

          <ul className="space-y-3 mb-6">
            {[
              "Top product",
              "Best selling product",
              "Product sold",
              "Most liked product",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <FiCircle className="text-gray-800 text-xs" />
                {item}
              </li>
            ))}
          </ul>

          <button className="w-full bg-[#0f172a] text-white text-sm py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-medium">
            Product analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
