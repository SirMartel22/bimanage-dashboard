export type UserType = "new" | "existing";

export interface StatItem {
    inventory: number;
    sales: number;
    stock: number;
    todos: number
}

export interface Order {
    trackingNo: string;
    productName: string;
    price: number;
    totalOrder: number;
    totalAmount: number;
}

export interface TopProduct {
    name: string;
    price: number;
    rating: number
}

export interface UserProfile {
    name: string;
    stats: StatItem;
    analyticsPercent: number;
    orders: Order[];
    topProducts: TopProduct[]
}