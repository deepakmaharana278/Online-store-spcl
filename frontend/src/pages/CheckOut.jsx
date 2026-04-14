import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CheckOut = ({ cart, cartCount, clearCart }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "cod",
  });

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0);
  const shippingCost = cartTotal > 500 ? 0 : 50;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + shippingCost + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error("Please fill all required fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast.error("Please fill all shipping details");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        orderId: "ORD" + Date.now(),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity || 1,
          image_url: item.image_url,
        })),
        paymentMethod: formData.paymentMethod,
        subtotal: cartTotal,
        shipping: shippingCost,
        tax: tax,
        total: grandTotal,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, "orders"), orderData);

      console.log("Order saved to Firestore with ID:", docRef.id);

      // Also backup to localStorage for offline access
      const backupOrder = {
        ...orderData,
        id: docRef.id,
        date: new Date().toISOString(),
      };
      const existingBackup = JSON.parse(localStorage.getItem("backup_orders") || "[]");
      existingBackup.unshift(backupOrder);
      localStorage.setItem("backup_orders", JSON.stringify(existingBackup));

      clearCart();

      const orderDetails = {
        id: docRef.id,
        orderId: orderData.orderId,
        items: cart,
        total: grandTotal,
        customer: formData,
        date: new Date().toISOString(),
      };

      localStorage.setItem("lastOrder", JSON.stringify(orderDetails));

      toast.success("Order placed successfully!");
      navigate("/order-success", { state: { order: orderDetails, firestoreId: docRef.id } });
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout cartCount={cartCount}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <i className="fas fa-shopping-cart text-6xl text-gray-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
            <Link to="/products" className="inline-block bg-amber-400 text-gray-950 px-6 py-3 rounded-lg font-semibold hover:bg-amber-300 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout cartCount={cartCount}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-500 mb-8">Complete your purchase</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex mb-6">
                <div className={`flex-1 text-center ${step >= 1 ? "text-amber-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 1 ? "bg-amber-400 text-gray-950" : "bg-gray-200 text-gray-500"}`}>1</div>
                  <p className="text-sm mt-2">Personal Info</p>
                </div>
                <div className={`flex-1 text-center ${step >= 2 ? "text-amber-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 2 ? "bg-amber-400 text-gray-950" : "bg-gray-200 text-gray-500"}`}>2</div>
                  <p className="text-sm mt-2">Shipping</p>
                </div>
                <div className={`flex-1 text-center ${step >= 3 ? "text-amber-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 3 ? "bg-amber-400 text-gray-950" : "bg-gray-200 text-gray-500"}`}>3</div>
                  <p className="text-sm mt-2">Payment</p>
                </div>
              </div>

              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                          placeholder="Bhubaneswar"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                          placeholder="Odisha"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                          placeholder="400001"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Country *</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                        >
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-amber-400">
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} className="mr-3 text-amber-400" />
                      <div>
                        <i className="fas fa-money-bill-wave text-xl text-gray-600 mr-2"></i>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-amber-400">
                      <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} className="mr-3 text-amber-400" />
                      <div>
                        <i className="fas fa-credit-card text-xl text-gray-600 mr-2"></i>
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500 mt-1">Visa, Mastercard, RuPay</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-amber-400">
                      <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === "upi"} onChange={handleChange} className="mr-3 text-amber-400" />
                      <div>
                        <i className="fas fa-mobile-alt text-xl text-gray-600 mr-2"></i>
                        <span className="font-medium">UPI</span>
                        <p className="text-sm text-gray-500 mt-1">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button onClick={handlePrevStep} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <i className="fas fa-chevron-left mr-2"></i> Back
                  </button>
                )}
                {step < 3 ? (
                  <button onClick={handleNextStep} className="ml-auto px-6 py-2 bg-amber-400 text-gray-950 rounded-lg font-semibold hover:bg-amber-300 transition">
                    Continue <i className="fas fa-chevron-right ml-2"></i>
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="ml-auto px-6 py-2 bg-amber-400 text-gray-950 rounded-lg font-semibold hover:bg-amber-300 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-pulse mr-2"></i> Processing...
                      </>
                    ) : (
                      <>
                        Place Order <i className="fas fa-check ml-2"></i>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-amber-600">₹{(parseFloat(item.price) * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-amber-600">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckOut;
