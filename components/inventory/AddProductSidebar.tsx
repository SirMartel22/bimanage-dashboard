"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdClose, MdCloudUpload, MdDelete } from "react-icons/md";
import { useAuthStore } from "@/lib/store/auth-store";

interface AddProductSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any; // If provided, we are in Edit mode
}

const AddProductSidebar = ({ isOpen, onClose, onSuccess, product }: AddProductSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sellingPrice: "",
    category: "",
    description: "",
    stockQuantity: "",
    image: "" // This will store the existing image URL if in edit mode
  });

  // Load product data when in edit mode
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        sellingPrice: String(product.sellingPrice || ""),
        category: product.category || "",
        description: product.description || "",
        stockQuantity: String(product.stockQuantity || ""),
        image: product.image || ""
      });
      setPreviewUrl(product.image || "");
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        brand: "",
        sellingPrice: "",
        category: "",
        description: "",
        stockQuantity: "",
        image: ""
      });
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [product, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Clear manual image URL if a file is selected
      setFormData(prev => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const isEdit = !!product;
    const url = isEdit ? `/api/inventory/products/${product._id}` : "/api/inventory/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      // Step 1: Create or Update Product (excluding image file)
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            ...formData,
            sellingPrice: Number(formData.sellingPrice),
            stockQuantity: Number(formData.stockQuantity),
            // If we have a new image file, we send empty image string to be replaced in step 2
            // If we don't have a new file but have a URL in formData.image, we keep it
            image: imageFile ? "" : formData.image 
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Failed to ${isEdit ? "update" : "add"} product`);
      }

      const savedProduct = await res.json();
      const productId = isEdit ? product._id : (savedProduct._id || savedProduct.data?._id);

      // Step 2: Upload Image if selected
      if (imageFile && productId) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);

        const uploadRes = await fetch(`/api/upload/product/${productId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: uploadFormData
        });

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          console.error("Image upload failed:", uploadErr);
          // We don't throw here to avoid losing the product creation, but maybe alert
          alert("Product saved, but image upload failed.");
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{product ? "Edit Product" : "Add New Product"}</h2>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            >
              <MdClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Image Upload Placeholder */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Image</label>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-200 rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center gap-3 hover:border-blue-400 transition-all cursor-pointer bg-gray-50 overflow-hidden relative group`}
              >
                {previewUrl ? (
                   <>
                      <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                         <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                            <MdCloudUpload className="text-white text-2xl" />
                         </div>
                         <button 
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewUrl("");
                                setImageFile(null);
                                setFormData(prev => ({ ...prev, image: "" }));
                            }}
                            className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors border-none"
                         >
                            <MdDelete size={20} />
                         </button>
                      </div>
                   </>
                ) : (
                   <>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                       <MdCloudUpload size={24} />
                    </div>
                    <div className="text-center">
                       <p className="text-sm font-bold text-gray-900">Click to upload image</p>
                       <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                   </>
                )}
              </div>
              
              <div className="relative">
                <input 
                    type="text" 
                    placeholder="Or paste image URL here..."
                    className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({...formData, image: e.target.value});
                      setPreviewUrl(e.target.value);
                      setImageFile(null);
                    }}
                />
              </div>
            </div>


            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Product Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Nike Jordan 1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Brand</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Nike"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Shoes"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Selling Price ($)</label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the product..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-[#1e315f] text-white hover:bg-[#2a457a] transition-all shadow-lg active:scale-95 disabled:opacity-50 border-none cursor-pointer"
              >
                {loading ? (product ? "Updating..." : "Adding...") : (product ? "Update Product" : "Add Product")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductSidebar;
