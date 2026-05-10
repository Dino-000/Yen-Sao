"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== "COMPANY_ADMIN" && user?.role !== "SUPER_ADMIN")) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!user || (user.role !== "COMPANY_ADMIN" && user.role !== "SUPER_ADMIN")) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Products</h2>
          <p className="text-gray-500">Manage your product catalog</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders</h2>
          <p className="text-gray-500">View and manage customer orders</p>
        </Link>

        <div className="bg-white border rounded-lg p-6 opacity-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h2>
          <p className="text-gray-500">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
