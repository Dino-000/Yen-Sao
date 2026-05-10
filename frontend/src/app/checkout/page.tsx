"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user || items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const orderRes = await api.post("/orders", {
        userId: user.id,
        companyId: items[0].productId,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      });

      await api.post("/payments", {
        orderId: orderRes.data.id,
        userId: user.id,
        amount: totalPrice(),
        paymentMethod: "CARD",
      });

      const paymentRes = await api.get(`/payments/order/${orderRes.data.id}`);
      await api.post(`/payments/${paymentRes.data.id}/process`);

      clearCart();
      router.push(`/orders`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span>
                {item.productName} x {item.quantity}
              </span>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${totalPrice().toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment</h2>
        <p className="text-gray-600 text-sm mb-4">
          This is a sandbox environment. No real payment will be processed.
        </p>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Payment Method: Card (Mock)</p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 px-8 rounded-md text-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${totalPrice().toFixed(2)}`}
      </button>
    </div>
  );
}
