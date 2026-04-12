import React from "react";
import Layout from "../components/Layout";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  const firestoreId = location.state?.firestoreId;

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <i className="fas fa-exclamation-triangle text-6xl text-amber-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Order Found</h2>
            <Link to="/products" className="inline-block bg-amber-400 text-gray-950 px-6 py-3 rounded-lg font-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-4xl text-green-600"></i>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-6">Thank you for your purchase</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-600">Order ID: <span className="font-bold text-gray-800">{order.orderId}</span></p>
            {firestoreId && (
              <p className="text-gray-600 mt-1">
                Reference ID: <span className="font-mono text-sm text-gray-600">{firestoreId}</span>
              </p>
            )}
            <p className="text-gray-600 mt-1">Order Date: {new Date(order.date).toLocaleString()}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-medium">₹{(parseFloat(item.price) * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-amber-600">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link to="/products" className="block w-full bg-amber-400 text-gray-950 px-6 py-3 rounded-lg font-semibold hover:bg-amber-300 transition">
              Continue Shopping
            </Link>
            <Link to="/" className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;