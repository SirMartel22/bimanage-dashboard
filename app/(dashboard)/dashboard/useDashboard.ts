import { useState, useEffect, useCallback, useRef } from "react"
import { UserType, UserProfile, Order, TopProduct } from "./dashboard.types";
import { useAuthStore } from "@/lib/store/auth-store";
import { chartData as mockChartData, legendItems, onboardingSteps } from "./mockdata"

export const useDashboard = () => {
    const [userType, setUserType] = useState<UserType>("new");
    const [copied, setCopied] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuthStore();
    
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        stats: { inventory: 0, sales: 0, stock: 0, todos: 0 },
        analyticsPercent: 0,
        orders: [],
        topProducts: []
    });
    
    const [user, setUser] = useState<any>(null);
    const [chartData, setChartData] = useState(mockChartData);

    const url = "https://bimanage.com.ng";

    const isFetching = useRef(false);

    const fetchData = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        
        setLoading(true);
        setError(null);

        if (!token) {
            // Wait for hydration if needed, but if it's been some time and still no token, it's an error.
            // Actually, SidebarLayout handles the redirect if no token.
            // Here we just wait.
            setLoading(false);
            return;
        }

        try {
            const headers = { "Authorization": `Bearer ${token}` };

            // Fetch all required data in parallel
            const [statsRes, recentOrdersRes, tasksStatsRes, chartRes, userRes] = await Promise.all([
                fetch("/api/inventory/stats", { headers }),
                fetch("/api/orders/recent", { headers }),
                fetch("/api/tasks/stats", { headers }),
                fetch("/api/orders/chart?range=7days", { headers }),
                fetch("/api/auth/me", { headers })
            ]);

            const statsData = await statsRes.json();
            const recentOrdersData = await recentOrdersRes.json();
            const tasksStatsData = await tasksStatsRes.json();
            const chartDataResponse = await chartRes.json();
            const userData = await userRes.json();
            const actualUser = userData.user || userData;

            // Handle user data
            if (userRes.ok && actualUser && (actualUser.name || actualUser.email)) {
                setUser(actualUser);
                localStorage.setItem("user", JSON.stringify(actualUser));
            }


            const stats = statsData.data || statsData;
            const recentOrders = Array.isArray(recentOrdersData.data) ? recentOrdersData.data : (Array.isArray(recentOrdersData) ? recentOrdersData : []);
            const tasksStats = tasksStatsData.data || tasksStatsData;
            const chartDataItems = Array.isArray(chartDataResponse.data) ? chartDataResponse.data : (Array.isArray(chartDataResponse) ? chartDataResponse : []);

            // Determine if user is new or existing
            const isNew = (stats.totalProducts === 0 || !stats.totalProducts) && (recentOrders.length === 0);
            setUserType(isNew ? "new" : "existing");

            // Transform recent orders to match UI format
            const formattedOrders: Order[] = recentOrders.map((o: any) => ({
                id: o._id,
                status: o.status || "active",
                trackingNo: o._id?.slice(-6).toUpperCase() || "#000000",
                productName: o.productId?.name || "Unknown Product",
                price: o.productId?.sellingPrice || 0,
                totalOrder: o.quantity || 0,
                totalAmount: (o.productId?.sellingPrice || 0) * (o.quantity || 0)
            }));

            // Transform top selling products
            const formattedTopProducts: TopProduct[] = (stats.topSelling || []).map((p: any) => ({
                name: p.name,
                price: p.sellingPrice,
                rating: 5 // Default rating as API might not provide it
            }));

            // Calculate analytics percentage (e.g., completed orders vs total)
            const salesAnalytics = stats.salesAnalytics || { totalOrders: 0, completedOrders: 0 };
            const analyticsPercent = salesAnalytics.totalOrders > 0 
                ? Math.round((salesAnalytics.completedOrders / salesAnalytics.totalOrders) * 100)
                : 0;

            setProfile({
                name: actualUser?.name || "",
                stats: {
                    inventory: stats.totalProducts || 0,
                    sales: stats.totalSales || 0,
                    stock: stats.totalStock || 0,
                    todos: tasksStats.total || 0
                },
                analyticsPercent,
                orders: formattedOrders,
                topProducts: formattedTopProducts
            });

            if (chartDataItems.length > 0) {
                setChartData(chartDataItems);
            } else if (isNew) {
                // Create empty chart data for new users
                const emptyChart = mockChartData.map(item => ({
                    ...item,
                    sales: 0,
                    distribution: 0,
                    returns: 0
                }));
                setChartData(emptyChart);
            }


        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
            isFetching.current = false;
        }

    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const cancelOrder = async (orderId: string) => {
        if (!token) return;
        try {
            const res = await fetch(`/api/orders/${orderId}/cancel`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to cancel order");
            }
            await fetchData();
        } catch (err: any) {
            console.error("Cancel order error:", err);
            alert(err.message || "Failed to cancel order");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleOnboarding = () => setShowOnboarding((prev) => !prev)
    const toggleUserType = () => setUserType((prev) => (prev === "new" ? "existing" : "new"))

    return {
        // state
        userType, copied, showOnboarding, profile, url, loading, error, user,
        
        // Data
        chartData, legendItems, onboardingSteps,

        // handlers
        handleCopy, toggleOnboarding, toggleUserType, refreshData: fetchData, cancelOrder
    };
};
