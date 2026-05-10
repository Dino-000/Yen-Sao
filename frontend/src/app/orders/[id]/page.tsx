"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Order, Payment } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const orderRes = await api.get(`/orders/${id}`);
        setOrder(orderRes.data);
        try {
          const paymentRes = await api.get(`/payments/order/${id}`);
          setPayment(paymentRes.data);
        } catch {
          // No payment yet
        }
      } catch {
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated, router]);

  const handleCancel = async () => {
    try {
      const res = await api.post(`/orders/${id}/cancel`);
      setOrder(res.data);
    } catch {
      alert("Failed to cancel order");
    }
  };

  if (loading || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/orders")}
        className="text-primary-600 hover:text-primary-800 mb-6 inline-block"
      >
        &larr; Back to Orders
      </button>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[order.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status}
          </span>
        </div>

        <h2 className="text-lg font-semibold mb-3">Items</h2>
        <div className="space-y-3 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {payment && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Payment</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium">{payment.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span>{payment.paymentMethod}</span>
            </div>
            {payment.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-xs">{payment.transactionId}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {order.status === "PENDING" && (
        <button
          onClick={handleCancel}
          className="w-full border-2 border-red-600 text-red-600 py-3 rounded-md hover:bg-red-50"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
}
