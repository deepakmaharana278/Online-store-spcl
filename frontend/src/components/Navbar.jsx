import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategories } from "../services/api";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    updateCartCount();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const updateCartCount = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      } catch (error) {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to products page with search parameter
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/products?category=${categorySlug}`);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-950 border-b border-gray-800/60 shadow-lg shadow-black/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center shrink-0">
              <span className="text-white">Deepak</span>
              <span className="text-amber-400">Shop</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mb-0.5 ml-0.5" />
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-amber-400">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <div className="hidden md:flex items-center h-full">
              <Link
                to="/"
                className="h-full flex items-center px-4 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white border-b-2 border-transparent hover:border-amber-400 transition-all duration-200"
              >
                Home
              </Link>

              <div className="relative group h-full flex items-center">
                <button className="h-full flex items-center gap-1.5 px-4 text-xs font-semibold tracking-widest uppercase text-gray-400 group-hover:text-white border-b-2 border-transparent group-hover:border-amber-400 transition-all duration-200">
                  Categories
                  <i className="fas fa-chevron-down text-[10px] transition-transform duration-200 group-hover:rotate-180"></i>
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-gray-950 border border-gray-800 border-t-2 border-t-amber-400 min-w-52 shadow-xl shadow-black/40 py-1.5 z-50">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors duration-150 w-full text-left"
                    >
                      <span className="text-base w-5 text-center">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="/products"
                className="h-full flex items-center px-4 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white border-b-2 border-transparent hover:border-amber-400 transition-all duration-200"
              >
                Products
              </Link>
              <Link
                to="/track-order"
                className="h-full flex items-center px-4 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white border-b-2 border-transparent hover:border-amber-400 transition-all duration-200"
              >
                Track Order
              </Link>

              <Link
                to="/cart"
                className="h-full flex items-center px-4 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white border-b-2 border-transparent hover:border-amber-400 transition-all duration-200 relative"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-amber-400 text-gray-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <Link to="/cart" className="relative">
                <i className="fas fa-cart-shopping text-gray-400"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              <button className="flex flex-col gap-1.5 p-2 group" onClick={() => setIsMenuOpen(true)}>
                <i className="fas fa-bars text-gray-400 text-xl hover:text-amber-300"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 h-full bg-gray-950 border-l border-gray-800 shadow-2xl flex flex-col animate-slide-in-right">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <Link to="/" className="text-lg font-extrabold tracking-tight flex items-center" onClick={() => setIsMenuOpen(false)}>
                <span className="text-white">Deepak</span>
                <span className="text-amber-400">Shop</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center border border-gray-700 text-gray-400 hover:border-amber-400 hover:text-amber-400 transition-colors rounded-lg"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="px-6 pt-4 pb-2 border-b border-gray-800">
              <form onSubmit={handleMobileSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-amber-400">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto py-3">
              <Link
                to="/"
                className="flex items-center px-6 py-3 text-sm font-semibold text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="mr-3 fas fa-home"></i>
                Home
              </Link>

              <div className="py-2">
                <p className="px-6 pt-2 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 flex items-center">
                  <i className="fa-solid fa-bars-staggered mr-2"></i>
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/?category=${cat.slug}`}
                    className="flex items-center gap-3 px-6 pl-12 py-2.5 text-sm text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-base w-5 text-center">{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>

              <Link
                to="/products"
                className="flex items-center px-6 py-3 text-sm font-semibold text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-bag-shopping mr-3"></i>
                All Products
              </Link>

              <Link
                to="/track-order"
                className="flex items-center px-6 py-3 text-sm font-semibold text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-truck mr-3"></i>
                Track Order
              </Link>

              <Link
                to="/about"
                className="flex items-center px-6 py-3 text-sm font-semibold text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fa-solid fa-circle-info mr-3"></i>
                About
              </Link>

              <Link
                to="/contact"
                className="flex items-center px-6 py-3 text-sm font-semibold text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-envelope mr-3"></i>
                Contact
              </Link>

              <Link
                to="/cart"
                className="flex items-center justify-between px-6 py-3 text-sm font-semibold text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <i className="fa-solid fa-cart-shopping mr-3"></i>
                  Cart
                </div>
                {cartCount > 0 && <span className="bg-amber-400 text-gray-950 text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>}
              </Link>
            </div>
            <div className="px-6 py-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs text-center">© 2026 DeepakShop</p>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
