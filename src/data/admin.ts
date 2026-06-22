import { products } from "@/data/products";

export type AdminOrder = {
  id: string;
  databaseId?: string;
  customer: string;
  email?: string;
  phone?: string;
  item: string;
  items?: {
    productName: string;
    sku: string;
    quantity: number;
    total: string;
  }[];
  address?: string;
  total: string;
  payment: "Paid" | "COD" | "Pending";
  paymentMethod?: string;
  paymentStatus?: string;
  returnRequest?: {
    status: string;
    reason: string;
    notes: string;
  } | null;
  status:
    | "Pending"
    | "Confirmed"
    | "Processing"
    | "Packed"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Return requested"
    | "Returned";
  statusCode?: string;
  date: string;
};

export type InventoryItem = {
  sku: string;
  product: string;
  category: string;
  stock: number;
  reserved: number;
  reorderAt: number;
};

export const adminMetrics = [
  { label: "Revenue", value: "Rs. 4.82L", change: "+18.4%" },
  { label: "Open orders", value: "26", change: "+7 today" },
  { label: "Low stock", value: "4", change: "Needs review" },
  { label: "Conversion", value: "3.8%", change: "+0.6%" },
];

export const adminOrders: AdminOrder[] = [
  {
    id: "WL-1048",
    customer: "Aarav Sharma",
    item: "Walnut Dining Table",
    total: "Rs. 48,999",
    payment: "Paid",
    status: "Confirmed",
    date: "Jun 01",
  },
  {
    id: "WL-1047",
    customer: "Meera Kapoor",
    item: "Linen Sofa 3 Seater",
    total: "Rs. 69,999",
    payment: "Paid",
    status: "Processing",
    date: "May 31",
  },
  {
    id: "WL-1046",
    customer: "Kabir Malhotra",
    item: "Nordic Lounge Chair",
    total: "Rs. 24,999",
    payment: "COD",
    status: "Packed",
    date: "May 31",
  },
  {
    id: "WL-1045",
    customer: "Anika Rao",
    item: "Oak Coffee Table",
    total: "Rs. 18,999",
    payment: "Pending",
    status: "Shipped",
    date: "May 30",
  },
];

export const inventoryItems: InventoryItem[] = products.map((product, index) => {
  const stockLevels = [8, 18, 5, 26, 11];
  const reservedLevels = [3, 4, 2, 5, 1];

  return {
    sku: `WL-${String(index + 101).padStart(3, "0")}`,
    product: product.title,
    category: product.category,
    stock: stockLevels[index] ?? 12,
    reserved: reservedLevels[index] ?? 2,
    reorderAt: index === 2 ? 8 : 6,
  };
});

export const customerMessages = [
  {
    name: "Riya Mehta",
    topic: "Custom fabric request",
    priority: "High",
    received: "12 min ago",
  },
  {
    name: "Dev Arora",
    topic: "Delivery slot change",
    priority: "Medium",
    received: "42 min ago",
  },
  {
    name: "Sana Iqbal",
    topic: "Warranty question",
    priority: "Normal",
    received: "2 hr ago",
  },
];
