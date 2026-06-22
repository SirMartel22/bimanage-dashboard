"use client";

import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useAuthStore } from "@/lib/store/auth-store";

interface Product {
  _id: string;
  name: string;
  brand: string;
  sellingPrice: number;
  stockQuantity: number;
}

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: Product[];
  productId?: string;
}

const SellProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  products,
  productId
}: SellProductModalProps) => {
  const { token } = useAuthStore();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedProductId(productId || (products[0]?._id || ""));
      setQuantity("");
      setError(null);
    }
  }, [isOpen, productId, products]);

  if (!isOpen) return null;

  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const currentStock = selectedProduct?.stockQuantity || 0;
  const inputQuantity = parseInt(quantity, 10) || 0;
  const isOutOfStock = currentStock <= 0;
  const isInsufficent = inputQuantity > currentStock;
  const totalAmount = (selectedProduct?.sellingPrice || 0) * inputQuantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setError("Please select a product");
      return;
    }
    if (inputQuantity <= 0) {
      setError("Please enter a valid quantity greater than 0");
      return;
    }
    if (isInsufficent) {
      setError(`Insufficient stock. Only ${currentStock} units available.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedProductId,
          quantity: inputQuantity
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to record sale");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Sell Product</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer"
            >
              <MdClose size={22} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Select Product
              </label>
              <select
                disabled={!!productId}
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="" disabled>Select a product...</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (${p.sellingPrice})
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-500 block uppercase tracking-wider">Available Stock</span>
                    <span className={`text-sm font-black ${isOutOfStock ? "text-red-500" : "text-gray-800"}`}>
                      {currentStock} units
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-500 block uppercase tracking-wider">Selling Price</span>
                    <span className="text-sm font-black text-gray-800">${selectedProduct.sellingPrice}</span>
                  </div>
                </div>

                {inputQuantity > 0 && (
                  <div className="flex justify-between items-center border-t border-gray-200/60 pt-3">
                    <span className="font-bold text-gray-700 uppercase tracking-wider">Total Sales Value</span>
                    <span className="text-base font-black text-[#10b981]">${totalAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Quantity to Sell
              </label>
              <input
                required
                type="number"
                min="1"
                disabled={isOutOfStock}
                placeholder={isOutOfStock ? "Out of Stock" : "e.g. 5"}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm ${
                  isInsufficent 
                    ? "border-red-300 focus:ring-red-500" 
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* Footer */}
            <div className="flex gap-4 pt-4 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedProductId || isOutOfStock || isInsufficent}
                className="flex-1 py-3.5 rounded-xl font-bold bg-[#1e315f] text-white hover:bg-[#2a457a] transition-all shadow-lg active:scale-95 disabled:opacity-50 border-none cursor-pointer text-sm"
              >
                {loading ? "Recording..." : "Record Sale"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SellProductModal;
