export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "COMPANY_ADMIN" | "SUPER_ADMIN";
  companyId?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  companyId: number;
  category: string;
  active: boolean;
}

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  userId: number;
  companyId: number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Payment {
  id: number;
  orderId: number;
  userId: number;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paymentMethod: string;
  createdAt: string;
}

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
