import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import ProductCard from "./ProductCard";
import { fetchFeaturedProducts } from "../services/api";
import toast from "react-hot-toast";
import { Link, useSearchParams  } from "react-router-dom";

const Home = ({ onAddToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    const data = await fetchFeaturedProducts(8);
    setFeaturedProducts(data);
    setLoading(false);
  };

  const handleAddToCart = useCallback(
    (product) => {
      if (onAddToCart) {
        onAddToCart(product);
        toast.success(`${product.name} added to cart!`);
      }
    },
    [onAddToCart],
  );

  return (
    <Layout>
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to <span className="text-amber-400">DeepakShop</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">Discover amazing products at unbeatable prices. Shop the latest trends in electronics, fashion, home appliances, and books.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="bg-amber-400 text-gray-900 px-8 py-3 rounded-lg font-semibold text-center">
                Shop Now
              </Link>
              <Link to="/about" className="border border-white text-white px-8 py-3 rounded-lg font-semibold text-center hover:bg-white hover:text-gray-900">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
            <p className="text-gray-500">Hand-picked just for you</p>
          </div>
          <Link to="/products" className="mt-4 sm:mt-0 text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2">
            View All Products 
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
            <p className="text-gray-500 mt-2">Loading featured products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Shop by Category</h2>
            <p className="text-gray-500">Find what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link to="/products?category=electronics" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600">Electronics</h3>
              </div>
            </Link>
            <Link to="/products?category=fashion" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mb-3">👕</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600">Fashion</h3>
              </div>
            </Link>
            <Link to="/products?category=home-appliances" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mb-3">🏠</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600">Home Appliances</h3>
              </div>
            </Link>
            <Link to="/products?category=books" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mb-3">📚</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-600">Books</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
