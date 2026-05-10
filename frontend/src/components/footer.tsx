export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Yen Sao. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
