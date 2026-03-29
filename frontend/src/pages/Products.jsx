import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";
import { fetchProducts } from "../services/api";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    search: "",
    ordering: ""
  });

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const minRating = searchParams.get("min_rating");
    const ordering = searchParams.get("ordering");
    
    setFilters(prev => ({ 
      ...prev, 
      category: category || "",
      search: search || "",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      minRating: minRating || "",
      ordering: ordering || ""
    }));
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams();
    if (updatedFilters.category) params.set("category", updatedFilters.category);
    if (updatedFilters.search) params.set("search", updatedFilters.search);
    if (updatedFilters.minPrice) params.set("min_price", updatedFilters.minPrice);
    if (updatedFilters.maxPrice) params.set("max_price", updatedFilters.maxPrice);
    if (updatedFilters.minRating) params.set("min_rating", updatedFilters.minRating);
    if (updatedFilters.ordering) params.set("ordering", updatedFilters.ordering);
    
    setSearchParams(params);
    setShowMobileFilters(false);
  };

  const handleSortChange = (ordering) => {
    handleFilterChange({ ordering });
  };

  const handleAddToCart = useCallback((product) => {
    if (onAddToCart) {
      onAddToCart(product);
      toast.success(`${product.name} added to cart!`, {
        duration: 2000,
        position: 'top-right',
      });
    }
  }, [onAddToCart]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    return count;
  };

  const clearAllFilters = () => {
    handleFilterChange({
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      search: "",
      ordering: ""
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">All Products</h1>
          <p className="text-gray-500">Browse our complete collection</p>
        </div>

        {filters.search && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-amber-800">
                Search results for: <strong>"{filters.search}"</strong>
              </p>
              <button
                onClick={() => handleFilterChange({ search: "" })}
                className="text-amber-600 hover:text-amber-800 text-sm"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-white rounded-lg shadow-md p-3 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2">
              <i className="fas fa-sliders-h text-gray-600"></i>
              <span className="font-medium text-gray-700">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <span className="bg-amber-400 text-gray-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </div>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <p className="text-gray-600 text-sm sm:text-base">
                  {products.length} <span className="hidden sm:inline">products</span> found
                </p>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm sm:text-base bg-white focus:outline-none focus:border-amber-400 w-full sm:w-auto"
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Rating: High to Low</option>
                </select>
              </div>
            </div>
            
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    Category: {filters.category}
                    <button onClick={() => handleFilterChange({ category: "" })} className="ml-1 text-gray-500 hover:text-gray-700">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    Price: ₹{filters.minPrice || "0"} - ₹{filters.maxPrice || "∞"}
                    <button onClick={() => handleFilterChange({ minPrice: "", maxPrice: "" })} className="ml-1 text-gray-500 hover:text-gray-700">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {filters.minRating && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    Rating: {filters.minRating}+ <i className="fas fa-star text-amber-400 text-xs"></i>
                    <button onClick={() => handleFilterChange({ minRating: "" })} className="ml-1 text-gray-500 hover:text-gray-700">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-amber-600 text-xs hover:text-amber-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-pulse text-3xl text-amber-400"></i>
                <p className="text-gray-500 mt-2">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <i className="fas fa-search text-6xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  <i className="fas fa-times text-gray-500"></i>
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </Layout>
  );
};

export default Products;