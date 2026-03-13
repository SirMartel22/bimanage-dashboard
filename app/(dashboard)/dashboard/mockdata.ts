import { UserProfile } from "./dashboard.types";
// import { UserType } from "./dashboard.types";

export const userProfiles: Record<string, UserProfile> = {
  new: {
    name: "Evan",
    stats: { inventory: 0, sales: 0, stock: 0, todos: 0 },
    analyticsPercent: 0,
    orders: [],
    topProducts: []
  },
  existing: {
    name: "Evan",
    stats: { inventory: 198000, sales: 2400, stock: 300, todos: 20 },
    analyticsPercent: 80,
    orders: [
      { trackingNo: "#876364", productName: "Camera Lens", price: 178, totalOrder: 325, totalAmount: 146660 },
      { trackingNo: "#876368", productName: "Black Sleep Dress", price: 14, totalOrder: 53, totalAmount: 46660 },
      { trackingNo: "#876412", productName: "Argan Oil", price: 21, totalOrder: 70, totalAmount: 3445678 },
      { trackingNo: "#876621", productName: "EAU DE Parfum", price: 32, totalOrder: 98, totalAmount: 3246981 },
    ],
    topProducts: [
      { name: "Nike Shoes Black Pattern", price: 87, rating: 4 },
      { name: "iPhone 12", price: 987, rating: 4 },
    ]
  }
};

export const chartData = [
  { time: "12am", sales: 55, distribution: 70, returns: 40 },
  { time: "1am", sales: 65, distribution: 50, returns: 60 },
  { time: "2am", sales: 45, distribution: 65, returns: 55 },
  { time: "3am", sales: 70, distribution: 45, returns: 70 },
  { time: "4am", sales: 60, distribution: 80, returns: 50 },
  { time: "5am", sales: 80, distribution: 60, returns: 65 },
  { time: "6am", sales: 55, distribution: 75, returns: 45 },
  { time: "7am", sales: 90, distribution: 55, returns: 80 },
  { time: "8am", sales: 70, distribution: 90, returns: 60 },
  { time: "9am", sales: 85, distribution: 70, returns: 75 },
];

export const legendItems = [
   { label: "Sale", color: "#1e315f" },
   { label: "Distribute", color: "#f5c842" },
   { label: "Return", color: "#e85d4a" },
]

export const onboardingSteps = [
   { label: "Set up your profile", done: true },
   { label: "Add your first product", done: true },
   { label: "Connect payment method", done: false },
   { label: "Make your first sale", done: false },
   { label: "Invite team members", done: true },
]