"use client";

import Link from "next/link";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-4xl">📦</span>
        )}
      </div>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700"
          >
            Add to Cart
          </button>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}
