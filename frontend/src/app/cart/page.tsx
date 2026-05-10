"use client";

import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-500 mb-8">Your cart is empty.</p>
        <Link
          href="/products"
          className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border rounded-lg p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {item.productName}
                </h3>
                <p className="text-primary-600 font-medium">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center border rounded-md">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 border-x">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <p className="font-semibold text-gray-900 w-24 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeItem(item.productId)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
