import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const OrderTracking = ({ cartCount }) => {
  const [searchMethod, setSearchMethod] = useState("orderId");
  const [searchValue, setSearchValue] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchOrdersFromFirestore = async () => {
    setLoading(true);
    setSearched(true);

    try {
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(query(ordersRef, orderBy("createdAt", "desc")));

      const allOrders = [];
      querySnapshot.forEach((doc) => {
        const orderData = { id: doc.id, ...doc.data() };
        if (orderData.createdAt && orderData.createdAt.toDate) {
          orderData.date = orderData.createdAt.toDate();
        }
        allOrders.push(orderData);
      });

      let filteredOrders = [];

      if (searchMethod === "orderId") {
        filteredOrders = allOrders.filter((order) => order.orderId && order.orderId.toLowerCase().includes(searchValue.toLowerCase()));
      } else {
        filteredOrders = allOrders.filter((order) => order.customer?.email && order.customer.email.toLowerCase().includes(searchValue.toLowerCase()));
      }

      filteredOrders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.date);
        const dateB = b.createdAt?.toDate?.() || new Date(b.date);
        return dateB - dateA;
      });

      setOrders(filteredOrders);

      if (filteredOrders.length === 0) {
        toast.error("No orders found");
      } else {
        toast.success(`Found ${filteredOrders.length} order(s)`);
      }
    } catch (error) {
      console.error("Error searching orders:", error);
      toast.error("Failed to search orders. Please try again.");

      try {
        const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const localFiltered = localOrders.filter((order) =>
          searchMethod === "orderId" ? order.orderId?.toLowerCase().includes(searchValue.toLowerCase()) : order.customer?.email?.toLowerCase().includes(searchValue.toLowerCase()),
        );
        setOrders(localFiltered);
        if (localFiltered.length === 0) {
          toast.error("No orders found");
        } else {
          toast.success(`Found ${localFiltered.length} order(s) from backup`);
        }
      } catch (backupError) {
        console.error("Backup search also failed:", backupError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast.error("Please enter Order ID or Email");
      return;
    }

    if (searchMethod === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchValue)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    searchOrdersFromFirestore();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "fas fa-clock";
      case "processing":
        return "fas fa-cogs";
      case "shipped":
        return "fas fa-truck";
      case "delivered":
        return "fas fa-check-circle";
      case "cancelled":
        return "fas fa-times-circle";
      default:
        return "fas fa-box";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Your order has been placed and is awaiting processing.";
      case "processing":
        return "Your order is being processed and prepared for shipment.";
      case "shipped":
        return "Your order has been shipped and is on its way to you.";
      case "delivered":
        return "Your order has been delivered successfully. Thank you for shopping with us!";
      case "cancelled":
        return "Your order has been cancelled. Contact support for more information.";
      default:
        return "Order status unknown. Please contact support.";
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { name: "Order Placed", key: "placed", icon: "fas fa-shopping-cart" },
      { name: "Processing", key: "processing", icon: "fas fa-cogs" },
      { name: "Shipped", key: "shipped", icon: "fas fa-truck" },
      { name: "Delivered", key: "delivered", icon: "fas fa-home" },
    ];

    if (status === "cancelled") {
      return [
        { name: "Order Placed", key: "placed", completed: true, icon: "fas fa-shopping-cart" },
        { name: "Cancelled", key: "cancelled", completed: true, isError: true, icon: "fas fa-ban" },
      ];
    }

    if (status === "pending") {
      return steps.map((step, index) => ({ ...step, completed: index === 0 }));
    }
    if (status === "processing") {
      return steps.map((step, index) => ({ ...step, completed: index <= 1 }));
    }
    if (status === "shipped") {
      return steps.map((step, index) => ({ ...step, completed: index <= 2 }));
    }
    if (status === "delivered") {
      return steps.map((step) => ({ ...step, completed: true }));
    }
    return steps;
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString("en-IN");
  };

  const copyOrderDetails = (order) => {
    const details = `Order ID: ${order.orderId}\nStatus: ${order.status}\nTotal: ₹${formatPrice(order.total)}\nDate: ${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : new Date().toLocaleString()}`;
    navigator.clipboard.writeText(details);
    toast.success("Order details copied!");
  };

  return (
    <Layout cartCount={cartCount}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block p-2 sm:p-3 bg-amber-100 rounded-full mb-3 sm:mb-4">
            <i className="fas fa-truck text-2xl sm:text-3xl text-amber-600"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-sm sm:text-base text-gray-500 px-4">Enter your Order ID or Email to track your order status</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex gap-2 sm:gap-4 border-b border-gray-200">
              <button
                onClick={() => setSearchMethod("orderId")}
                className={`pb-2 sm:pb-3 px-2 sm:px-4 text-sm sm:text-base font-medium transition-all duration-200 ${
                  searchMethod === "orderId" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-hashtag mr-1 sm:mr-2"></i> Order ID
              </button>
              <button
                onClick={() => setSearchMethod("email")}
                className={`pb-2 sm:pb-3 px-2 sm:px-4 text-sm sm:text-base font-medium transition-all duration-200 ${
                  searchMethod === "email" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-envelope mr-1 sm:mr-2"></i> Email
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <i className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm ${searchMethod === "orderId" ? "fas fa-hashtag" : "fas fa-envelope"}`}></i>
                <input
                  type={searchMethod === "email" ? "email" : "text"}
                  placeholder={searchMethod === "orderId" ? "Order ID (e.g., ORD123...)" : "your@email.com"}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full border border-gray-300 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-amber-400 text-gray-950 px-5 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-amber-300 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <i className="fas fa-search text-xs sm:text-sm"></i> Track
              </button>
            </div>
          </div>
        </div>

        {searched && (
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-pulse text-2xl sm:text-3xl text-amber-400"></i>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">Searching orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-md mx-2 sm:mx-0">
                <i className="fas fa-box-open text-5xl sm:text-6xl text-gray-400 mb-3 sm:mb-4"></i>
                <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2 px-4">
                  {searchMethod === "email" ? "No orders found for this email address. Please check and try again." : "Please check your Order ID and try again"}
                </p>
                <Link to="/products" className="inline-block mt-4 text-amber-600 hover:text-amber-700 text-sm sm:text-base">
                  Continue Shopping <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Order ID</p>
                          <p className="font-mono font-semibold text-gray-800 text-xs sm:text-sm">{order.orderId}</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Date</p>
                          <p className="text-gray-800 text-xs sm:text-sm">
                            {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Total</p>
                          <p className="text-base sm:text-2xl font-bold text-amber-600">₹{formatPrice(order.total)}</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusBadgeClass(order.status)}`}>
                            <i className={`${getStatusIcon(order.status)} text-xs`}></i>
                            <span>{order.status?.toUpperCase()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <i className="fas fa-info-circle text-amber-500 mt-0.5 text-sm"></i>
                          <p className="text-gray-700 text-xs sm:text-sm">{getStatusMessage(order.status)}</p>
                        </div>
                      </div>

                      <div className="mb-4 sm:mb-6 overflow-x-auto">
                        <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                          <i className="fas fa-chart-line text-amber-500"></i>
                          Timeline
                        </h3>
                        <div className="min-w-70">
                          {getStatusSteps(order.status).map((step, index) => (
                            <div key={step.key} className="flex items-start mb-4 sm:mb-6 last:mb-0">
                              <div className="relative shrink-0">
                                <div
                                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    step.completed ? (step.isError ? "bg-red-500 text-white shadow-lg" : "bg-green-500 text-white shadow-lg") : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  <i className={`${step.icon} text-xs sm:text-sm`}></i>
                                </div>
                                {index < getStatusSteps(order.status).length - 1 && (
                                  <div className={`absolute top-7 sm:top-10 left-3 sm:left-5 w-0.5 h-8 sm:h-12 ${step.completed && !step.isError ? "bg-green-500" : "bg-gray-300"}`}></div>
                                )}
                              </div>
                              <div className="ml-3 sm:ml-4 flex-1">
                                <p className={`font-semibold text-sm sm:text-base ${step.completed ? "text-gray-800" : "text-gray-500"}`}>{step.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <i className="fas fa-boxes text-amber-500"></i>
                          Items
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-gray-100 last:border-0">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = "https://placehold.co/300x200/1f2937/6b7280?text=No+Image";
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-xs sm:text-sm line-clamp-2">{item.name}</p>
                                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-amber-600 text-xs sm:text-sm">₹{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && <p className="text-gray-500 text-xs text-center pt-1">+{order.items.length - 3} more items</p>}
                        </div>
                      </div>

                      <details className="mb-4 sm:mb-6">
                        <summary className="font-semibold text-gray-800 text-sm sm:text-base cursor-pointer flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-amber-500"></i>
                          Shipping Address
                        </summary>
                        <div className="mt-2 sm:mt-3 bg-gray-50 rounded-lg p-3 sm:p-4">
                          <p className="font-medium text-gray-800 text-xs sm:text-sm">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </p>
                          <p className="text-gray-600 text-xs sm:text-sm mt-1">{order.customer?.address}</p>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {order.customer?.city}, {order.customer?.state} - {order.customer?.zipCode}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-2 sm:mt-3 pt-2 border-t border-gray-200">
                            <p className="text-xs sm:text-sm text-gray-600">
                              <i className="fas fa-phone mr-1 sm:mr-2 text-amber-500"></i> {order.customer?.phone}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              <i className="fas fa-envelope mr-1 sm:mr-2 text-amber-500"></i> {order.customer?.email}
                            </p>
                          </div>
                        </div>
                      </details>
                    </div>

                    <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
                        <Link to="/products" className="text-center text-amber-600 hover:text-amber-700 font-medium text-xs sm:text-sm">
                          <i className="fas fa-shopping-bag mr-1"></i> Continue Shopping
                        </Link>
                        <div className="flex gap-2 sm:gap-3 justify-center">
                          <button onClick={() => copyOrderDetails(order)} className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm">
                            <i className="fas fa-copy mr-1"></i> Copy
                          </button>
                          <button onClick={() => window.print()} className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm">
                            <i className="fas fa-print mr-1"></i> Print
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="max-w-2xl mt-6 sm:mt-8 p-4 sm:p-6 bg-amber-50 rounded-lg border border-amber-200 sm:mx-auto">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <i className="fas fa-question-circle text-amber-500"></i>
              Need Help?
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Order ID is in your confirmation email. Contact <span className="text-amber-600">support@deepakshop.com</span> for assistance.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderTracking;
