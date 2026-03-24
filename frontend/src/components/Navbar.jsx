import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/api";

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  return (
<>
  <nav className="bg-gray-950 border-b border-gray-800/60 shadow-lg shadow-black/30">
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center h-16">

        <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center">
          <span className="text-white">Deepak</span>
          <span className="text-amber-400">Shop</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mb-0.5 ml-0.5" />
        </Link>

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
            <div className="absolute top-full left-0 hidden group-hover:block bg-gray-950 border border-gray-800 border-t-2 border-t-amber-400 min-w-50 shadow-xl shadow-black/40 py-1.5 z-50">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/?category=${cat.slug}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors duration-150"
                >
                  <span className="text-base w-5 text-center">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/about"
            className="h-full flex items-center px-4 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white border-b-2 border-transparent hover:border-amber-400 transition-all duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="h-full flex items-center px-4 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white border-b-2 border-transparent hover:border-amber-400 transition-all duration-200"
          >
            Contact
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 group"
          onClick={() => setIsMenuOpen(true)}
        >
          <span className="block w-5 h-px bg-gray-400 group-hover:bg-amber-400 transition-colors" />
          <span className="block w-5 h-px bg-gray-400 group-hover:bg-amber-400 transition-colors" />
          <span className="block w-3 h-px bg-gray-400 group-hover:bg-amber-400 transition-colors" />
        </button>

      </div>
    </div>
  </nav>

  {isMenuOpen && (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsMenuOpen(false)}
      />
      <div className="fixed top-0 right-0 w-72 h-full bg-gray-950 border-l border-gray-800 shadow-2xl flex flex-col">

        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <Link to="/" className="text-base font-extrabold tracking-tight flex items-center" onClick={() => setIsMenuOpen(false)}>
            <span className="text-white">Deepak</span>
            <span className="text-amber-400">Shop</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center border border-gray-700 text-gray-400 hover:border-amber-400 hover:text-amber-400 transition-colors text-base"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <Link
            to="/"
            className="flex items-center px-6 py-3 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <div className="py-2">
            <p className="px-6 pt-2 pb-1 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600">
              Categories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/?category=${cat.slug}`}
                className="flex items-center gap-3 px-6 pl-9 py-2.5 text-sm text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-sm w-4 text-center">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>

          <Link
            to="/about"
            className="flex items-center px-6 py-3 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="flex items-center px-6 py-3 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 border-l-2 border-transparent hover:border-amber-400 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  )}
</>
  );
};

export default Navbar;
