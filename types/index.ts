export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  counts: {
    users: number;
    products: number;
    categories: number;
    orders: number;
    transactions: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category?: string | null;
  imageUrl: string | null;
  createdAt?: string; // ✅ Optional kora hoyeche
  updatedAt?: string; // ✅ Optional kora hoyeche
}

export interface Order {
  id: string;
  userId?: string | null; // ✅ Optional (guest order support)
  customerName?: string | null;
  customerEmail?: string | null;
  shippingAddress?: string | null;
  totalAmount: number;
  status: string;
  stripeSessionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string; // ✅ Required (database e required)
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
