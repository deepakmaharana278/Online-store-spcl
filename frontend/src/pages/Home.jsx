import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../services/api";
import toast from "react-hot-toast";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Products</h1>
      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Home;
