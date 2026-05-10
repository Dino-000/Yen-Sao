import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Welcome to Yen Sao
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-primary-100">
              Your multi-tenant e-commerce marketplace. Discover products from
              multiple vendors in one place.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/products"
                className="bg-white text-primary-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100"
              >
                Browse Products
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Yen Sao?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold mb-2">Multiple Vendors</h3>
              <p className="text-gray-600">
                Shop from multiple trusted vendors on a single platform.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Your transactions are protected with enterprise-grade security.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Track your orders in real-time from purchase to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
