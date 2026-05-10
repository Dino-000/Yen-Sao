"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="text-primary-600 hover:text-primary-800 mb-6 inline-block"
      >
        &larr; Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400 text-8xl">📦</span>
          )}
        </div>

        <div>
          <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded mb-4">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-3xl font-bold text-primary-600 mt-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 mt-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary-600 text-white py-3 px-8 rounded-md text-lg hover:bg-primary-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
