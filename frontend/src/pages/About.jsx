import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              About <span className="text-amber-400">DeepakShop</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Your trusted destination for quality products since 2024
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              DeepakShop was founded in 2024 with a simple mission: to provide high-quality products at affordable prices. What started as a small online store has grown into a trusted destination for thousands of satisfied customers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe that everyone deserves access to quality products without breaking the bank. That's why we carefully curate our collection, working directly with manufacturers to bring you the best value for your money.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we offer a wide range of products across electronics, fashion, home appliances, and books. But our core values remain the same: quality, affordability, and exceptional customer service.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              To empower customers by providing a seamless shopping experience with:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-semibold text-gray-800 mb-2">Quality Products</h3>
                <p className="text-gray-500 text-sm">Carefully selected items that meet our high standards</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
                <p className="text-gray-500 text-sm">Competitive pricing without compromising on quality</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">❤️</div>
                <h3 className="font-semibold text-gray-800 mb-2">Customer First</h3>
                <p className="text-gray-500 text-sm">Dedicated support and hassle-free returns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Why Choose DeepakShop?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Wide Selection</h3>
                  <p className="text-gray-500 text-sm">Thousands of products across multiple categories</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className=" shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Secure Shopping</h3>
                  <p className="text-gray-500 text-sm">Your transactions are safe and encrypted</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className=" shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Fast Delivery</h3>
                  <p className="text-gray-500 text-sm">Quick shipping to your doorstep</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className=" shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Easy Returns</h3>
                  <p className="text-gray-500 text-sm">30-day return policy for peace of mind</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className=" shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">24/7 Support</h3>
                  <p className="text-gray-500 text-sm">Always here to help with any questions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className=" shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Best Value</h3>
                  <p className="text-gray-500 text-sm">Quality products at the best prices</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-amber-400 to-amber-500 rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-900 mb-6">Join thousands of happy customers who shop with us every day</p>
          <Link
            to="/products"
            className="inline-block bg-gray-950 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default About;