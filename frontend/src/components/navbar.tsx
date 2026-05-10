"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              Yen Sao
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
                  Cart
                  {totalItems() > 0 && (
                    <span className="absolute -top-2 -right-4 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems()}
                    </span>
                  )}
                </Link>
                <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
                {(user?.role === "COMPANY_ADMIN" || user?.role === "SUPER_ADMIN") && (
                  <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin
                  </Link>
                )}
                <span className="text-sm text-gray-500">
                  {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
