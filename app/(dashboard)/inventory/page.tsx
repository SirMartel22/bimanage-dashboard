"use client";

import { useInventory } from "./useInventory";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AddProductSidebar from "@/components/inventory/AddProductSidebar";
import StockInModal from "@/components/inventory/StockInModal";
import SellProductModal from "@/components/inventory/SellProductModal";
import { FiFilter } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineAddCircleOutline, MdMoreHoriz } from "react-icons/md";
import Header from "@/components/header/Header";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { BsBoxSeam } from "react-icons/bs";

const ClipboardIllustration = () => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <svg width="84" height="106" viewBox="0 0 84 106" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="11" width="70" height="88" rx="4" fill="white" stroke="#F1F5F9" strokeWidth="2" />
      <rect x="14" y="28" width="56" height="2" rx="1" fill="#F1F5F9" />
      <rect x="14" y="38" width="56" height="2" rx="1" fill="#F1F5F9" />
      <rect x="14" y="48" width="36" height="2" rx="1" fill="#F1F5F9" />
      <path d="M28 0H56V11H28V0Z" fill="#1E3A5F" />
      <circle cx="42" cy="5" r="2" fill="white" />
      <rect x="0" y="20" width="70" height="86" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  </div>
);

const InventoryDashboard = () => {
  const {
    loading,
    error,
    user,
    stats,
    products,
    refreshData,
    soldProducts,
    deleteProduct
  } = useInventory();

  const searchParams = useSearchParams();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [activeTab, setActiveTab] = useState<"all" | "sold">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsMounted(true);
    const action = searchParams.get("action");
    if (action === "add") {
      setIsAddOpen(true);
    } else if (action === "stock-in") {
      setSelectedProductId(undefined);
      setIsStockInOpen(true);
    } else if (action === "sell") {
      setSelectedProductId(undefined);
      setIsSellOpen(true);
    }
  }, [searchParams]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsAddOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsAddOpen(false);
    setEditingProduct(null);
  };

  const stockTotal = stats.stockAvailability.available + stats.stockAvailability.lowStock + stats.stockAvailability.outOfStock;
  const availablePct = stockTotal > 0 ? (stats.stockAvailability.available / stockTotal) * 100 : 0;
  const lowPct = stockTotal > 0 ? (stats.stockAvailability.lowStock / stockTotal) * 100 : 0;
  const outPct = stockTotal > 0 ? (stats.stockAvailability.outOfStock / stockTotal) * 100 : 0;

  // We are a new user if there are literally no products in inventory
  const isNewUser = products.length === 0 && stats.totalProducts === 0;

  // Provide fallback chart data
  const chartData = !isNewUser && stats.productsByMonth.length > 0
    ? stats.productsByMonth.map(m => ({ name: m.name, v: m.value }))
    : [{ name: "1", v: 10 }, { name: "2", v: 25 }, { name: "3", v: 15 }, { name: "4", v: 40 }, { name: "5", v: 20 }, { name: "6", v: 35 }, { name: "7", v: 10 }];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10 font-sans">
      <Header user={user} />

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* Left Column: Stats & Chart & Table (8 cols) */}
          <div className="xl:col-span-8 space-y-6">

            {/* Top Stats */}
            <div className="flex gap-6">
              <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-[#ecfdf5] rounded-full flex items-center justify-center">
                  <BsBoxSeam size={20} className="text-[#10b981]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400">Total inventory</p>
                  <p className="text-2xl font-black text-gray-900">{isNewUser ? "0" : (stats.totalProducts >= 1000 ? `${(stats.totalProducts / 1000).toFixed(0)}k` : stats.totalProducts)}</p>
                  <p className="text-[10px] text-gray-400 font-medium">Completed Inventory</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-[#fff1f2] rounded-full flex items-center justify-center">
                  <HiOutlineShoppingBag size={20} className="text-[#f43f5e]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400">Total sales</p>
                  <p className="text-2xl font-black text-gray-900">${isNewUser ? "0" : (stats.totalSales >= 1000 ? `${(stats.totalSales / 1000).toFixed(1)}k` : stats.totalSales)}</p>
                  <p className="text-[10px] text-gray-400 font-medium">Completed Inventory</p>
                </div>
              </div>
            </div>

            {/* Wave Chart Section */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 min-h-[350px] flex items-center justify-center">
              <div className="h-[280px] w-full" style={{ minWidth: '100%' }}>
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorWave)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-gray-50 animate-pulse rounded-xl" />
                )}
              </div>
            </div>

            {/* Tabbed Products View */}
            <div className="bg-white rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden min-h-[450px] flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`text-lg font-black pb-2 border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                      activeTab === "all"
                        ? "text-gray-900 border-[#1e3a5f]"
                        : "text-gray-400 border-transparent hover:text-gray-600"
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setActiveTab("sold")}
                    className={`text-lg font-black pb-2 border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                      activeTab === "sold"
                        ? "text-gray-900 border-[#1e3a5f]"
                        : "text-gray-400 border-transparent hover:text-gray-600"
                    }`}
                  >
                    Product Sold
                  </button>
                </div>
                <button className="text-gray-300 hover:text-gray-500 bg-transparent border-none cursor-pointer">
                  <MdMoreHoriz size={24} />
                </button>
              </div>

              {activeTab === "all" ? (
                <>
                  <div className="px-6 py-4 bg-gray-50/40 border-b border-gray-50 flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search by product name or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  {products.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                      <ClipboardIllustration />
                      <p className="text-gray-500 font-bold mt-2">No products in inventory yet</p>
                      <p className="text-gray-400 text-xs mt-1 mb-8">Get started by creating your first product</p>
                      <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-[#1e3a5f] text-white px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-[#2a4a7f] transition-all border-none cursor-pointer shadow-md active:scale-95"
                      >
                        Add Product
                      </button>
                    </div>
                  ) : (() => {
                    const filtered = products.filter(
                      (p: any) =>
                        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                          <ClipboardIllustration />
                          <p className="text-gray-500 font-bold mt-2">No products match search query</p>
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50/30 text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                              <th className="px-6 py-5">Product Name</th>
                              <th className="px-6 py-5">Category</th>
                              <th className="px-6 py-5">Price</th>
                              <th className="px-6 py-5">Stock</th>
                              <th className="px-6 py-5 text-right pr-8">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {filtered.map((p: any) => {
                              const isLow = p.stockQuantity > 0 && p.stockQuantity <= 20;
                              const isOut = p.stockQuantity === 0;

                              return (
                                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {p.image ? (
                                          <img src={p.image} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">📦</div>
                                        )}
                                      </div>
                                      <div>
                                        <span className="font-bold text-gray-800 block leading-tight">{p.name}</span>
                                        <span className="text-[10px] text-gray-400 font-medium">{p.brand}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 font-semibold text-gray-500 text-xs">{p.category}</td>
                                  <td className="px-6 py-4 font-bold text-gray-700">${p.sellingPrice}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                                      isOut
                                        ? "bg-red-50 text-red-500 border border-red-100"
                                        : isLow
                                        ? "bg-amber-50 text-amber-500 border border-amber-100"
                                        : "bg-green-50 text-green-600 border border-green-100"
                                    }`}>
                                      {p.stockQuantity} {isOut ? "(Out of Stock)" : isLow ? "(Low Stock)" : ""}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right pr-8 space-x-1 whitespace-nowrap">
                                    <button
                                      onClick={() => {
                                        setSelectedProductId(p._id);
                                        setIsStockInOpen(true);
                                      }}
                                      className="px-2 py-1 bg-blue-50 text-[#3b82f6] hover:bg-blue-100 hover:text-blue-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer border-none bg-transparent active:scale-95"
                                    >
                                      Stock In
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedProductId(p._id);
                                        setIsSellOpen(true);
                                      }}
                                      className="px-2 py-1 bg-green-50 text-[#10b981] hover:bg-green-100 hover:text-green-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer border-none bg-transparent active:scale-95"
                                    >
                                      Sell
                                    </button>
                                    <button
                                      onClick={() => handleEdit(p)}
                                      className="px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer border-none bg-transparent active:scale-95"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                          deleteProduct(p._id);
                                        }
                                      }}
                                      className="px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer border-none bg-transparent active:scale-95"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </>
              ) : (
                soldProducts.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <ClipboardIllustration />
                    <p className="text-gray-500 font-bold mt-2">No product sold yet</p>
                    {isNewUser && (
                      <>
                        <p className="text-gray-400 text-xs mt-1 mb-8">You haven't add any product yet</p>
                        <button
                          onClick={() => setIsAddOpen(true)}
                          className="bg-[#1e3a5f] text-white px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-[#2a4a7f] transition-all border-none cursor-pointer shadow-md active:scale-95"
                        >
                          Add Product
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50/30 text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-5">Product Name</th>
                          <th className="px-6 py-5">Price</th>
                          <th className="px-6 py-5">No sold</th>
                          <th className="px-6 py-5">Stock</th>
                          <th className="px-6 py-5">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {soldProducts.map((p: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                  {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">📦</div>}
                                </div>
                                <span className="font-bold text-gray-800">{p.productName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-700">${p.price}</td>
                            <td className="px-6 py-4 font-bold text-gray-700">{p.noSold}</td>
                            <td className="px-6 py-4">
                              <span className="bg-[#e0f2fe] text-[#0369a1] px-3 py-1 rounded-md font-bold text-xs">
                                {p.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">${p.totalAmount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Column: Stock Availability & Sidebar (4 cols) */}
          <div className="xl:col-span-4 space-y-6">

            {/* Stock Availability Card */}
            <div className="bg-[#f8fafc] rounded-[24px] shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-gray-900">Stock Availability</h3>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    <HiOutlineShoppingBag size={18} />
                  </button>
                  <button className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    <FiFilter size={18} />
                  </button>
                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <MdOutlineAddCircleOutline size={20} />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-5xl font-black text-gray-900">{isNewUser ? "0" : stats.totalStock}</p>
                <p className="text-xs font-bold text-gray-400 mt-1">Total Stock</p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#10b981]" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#fbbf24]" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Low stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#f43f5e]" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">out of stock</span>
                </div>
              </div>

              <div className="h-7 flex rounded-lg overflow-hidden mb-10 border-4 border-white shadow-sm bg-gray-100">
                <div className="bg-[#10b981] h-full transition-all duration-1000" style={{ width: `${isNewUser ? 70 : availablePct}%` }} />
                <div className="bg-[#fbbf24] h-full transition-all duration-1000" style={{ width: `${isNewUser ? 20 : lowPct}%` }} />
                <div className="bg-[#f43f5e] h-full transition-all duration-1000" style={{ width: `${isNewUser ? 10 : outPct}%` }} />
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Low stock</p>
                {isNewUser ? (
                  <p className="text-center py-10 text-gray-400 text-sm font-bold">No records here</p>
                ) : (
                  stats.lowStockProducts.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm font-bold">No records here</p>
                  ) : (
                    stats.lowStockProducts.slice(0, 5).map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                          <span className="w-1 h-5 bg-[#fbbf24] rounded-full" />
                          <span className="text-sm font-bold text-gray-700">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm font-bold text-gray-900">{p.qty}</span>
                          <span className="text-sm font-bold text-gray-400 min-w-[60px] text-right">{p.brand}</span>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>

            {/* Bottom Right Card: Onboarding or Analytics */}
            {isNewUser ? (
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex flex-col min-h-[350px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-gray-900">Onboarding steps</h3>
                  <span className="text-[10px] font-bold text-gray-400">1 of 5 complete</span>
                </div>
                <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden mb-12">
                  <div className="bg-[#1e3a5f] h-full w-1/5" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ClipboardIllustration />
                  <p className="text-[11px] font-bold text-gray-500 mt-4">You have no top selling products yet.</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#f8fafc] rounded-[24px] shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-black text-gray-900 mb-1">Product analytics</h3>
                <p className="text-xs text-gray-400 font-bold mb-10">Manage your daily sales</p>

                <ul className="space-y-6 mb-12">
                  <li className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-gray-900" />
                    <span className="text-sm font-bold text-gray-700">Top product</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-gray-900" />
                    <span className="text-sm font-bold text-gray-700">Best selling product</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-gray-900" />
                    <span className="text-sm font-bold text-gray-700">Product sold</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-gray-900" />
                    <span className="text-sm font-bold text-gray-700">Most liked product</span>
                  </li>
                </ul>

                <button className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#2a4a7f] transition-all border-none cursor-pointer shadow-lg active:scale-95">
                  Product analytics
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <AddProductSidebar
        isOpen={isAddOpen}
        onClose={handleCloseSidebar}
        onSuccess={refreshData}
        product={editingProduct}
      />

      <StockInModal
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        onSuccess={refreshData}
        products={products}
        productId={selectedProductId}
      />

      <SellProductModal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
        onSuccess={refreshData}
        products={products}
        productId={selectedProductId}
      />
    </div>
  );
};

export default InventoryDashboard;
