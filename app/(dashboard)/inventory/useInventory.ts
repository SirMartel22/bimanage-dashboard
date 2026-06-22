import { useState, useEffect, useCallback, useRef } from "react"
import { useAuthStore } from "@/lib/store/auth-store";

export interface InventoryStats {
  totalProducts: number;
  totalInventoryValue: number;
  totalSales: number;
  totalStock: number;
  stockAvailability: {
    available: number;
    lowStock: number;
    outOfStock: number;
  };
  lowStockProducts: Array<{ name: string; stockQuantity: number; brand: string }>;
  productsByMonth: Array<{ name: string; value: number }>;
}

export interface SoldProduct {
  productName: string;
  price: number;
  noSold: number;
  stock: number;
  totalAmount: number;
}

export const useInventory = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const { token } = useAuthStore();
    
    const [stats, setStats] = useState<InventoryStats>({
        totalProducts: 0,
        totalInventoryValue: 0,
        totalSales: 0,
        totalStock: 0,
        stockAvailability: { available: 0, lowStock: 0, outOfStock: 0 },
        lowStockProducts: [],
        productsByMonth: []
    });
    
    const [products, setProducts] = useState<any[]>([]);
    const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
    
    const isFetching = useRef(false);

    const fetchData = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        
        setLoading(true);
        setError(null);
        if (!token) {
            setLoading(false);
            isFetching.current = false;
            return;
        }

        try {
            const headers = { "Authorization": `Bearer ${token}` };

            // Fetch user first or in parallel, but handle its failure gracefully
            const userRes = await fetch("/api/auth/me", { headers }).catch(() => null);
            if (userRes && userRes.ok) {
                const userData = await userRes.json();
                const actualUser = userData.user || userData;
                if (actualUser && (actualUser.name || actualUser.email)) {
                    setUser(actualUser);
                    localStorage.setItem("user", JSON.stringify(actualUser));
                }
            }

            // Fetch stats, sold products, and all products
            const [statsRes, soldRes, productsRes] = await Promise.all([
                fetch("/api/inventory/stats", { headers }).catch(() => null),
                fetch("/api/inventory/products/sold", { headers }).catch(() => null),
                fetch("/api/inventory/products", { headers }).catch(() => null)
            ]);

            if (statsRes && statsRes.ok) {
                const statsData = await statsRes.json();
                console.log("Stats API Response:", statsData);
                const actualStats = statsData.data || statsData;
                setStats({
                    totalProducts: actualStats.totalProducts || 0,
                    totalInventoryValue: actualStats.totalInventoryValue || 0,
                    totalSales: actualStats.totalSales || 0,
                    totalStock: actualStats.totalStock || 0,
                    stockAvailability: actualStats.stockAvailability || { available: 0, lowStock: 0, outOfStock: 0 },
                    lowStockProducts: (actualStats.lowStockProducts || []).map((p: any) => ({
                        name: p.name,
                        qty: p.stockQuantity,
                        brand: p.brand || "N/A"
                    })),
                    productsByMonth: (actualStats.productsByMonth || []).map((m: any) => ({
                        name: m.month,
                        value: m.total
                    }))
                });
            }

            if (soldRes && soldRes.ok) {
                const soldData = await soldRes.json();
                console.log("Sold Products API Response:", soldData);
                const actualSold = Array.isArray(soldData.data) ? soldData.data : (Array.isArray(soldData) ? soldData : []);
                setSoldProducts(actualSold.map((s: any) => ({
                    productName: s.productName,
                    price: s.price,
                    noSold: s.noSold,
                    stock: s.stock,
                    totalAmount: s.totalAmount
                })));
            } else if (soldRes && soldRes.status === 404) {
                setSoldProducts([]);
            }

            if (productsRes && productsRes.ok) {
                const productsData = await productsRes.json();
                console.log("All Products API Response:", productsData);
                const actualProducts = Array.isArray(productsData.data) ? productsData.data : (Array.isArray(productsData) ? productsData : (productsData.products || []));
                setProducts(actualProducts);
            }

        } catch (err) {
            console.error("Inventory fetch error:", err);
            // Only set error if we have literally nothing to show
            if (stats.totalProducts === 0 && soldProducts.length === 0) {
                setError("Failed to connect to inventory service");
            }
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [stats.totalProducts, soldProducts.length, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const deleteProduct = async (productId: string) => {
        if (!token) return;
        try {
            const res = await fetch(`/api/inventory/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to delete product");
            }
            await fetchData();
        } catch (err: any) {
            console.error("Delete product error:", err);
            alert(err.message || "Failed to delete product");
        }
    };

    return {
        loading,
        error,
        user,
        stats,
        products,
        soldProducts,
        refreshData: fetchData,
        deleteProduct
    };
};

