import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getOrders, updateOrderStatus, deleteOrder, getOrderStats, getRecentOrders, clearAllOrders } from "../services/adminService";
import toast from "react-hot-toast";

const AdminDashboard = ({ cartCount, setAdminAuthenticated }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadOrders(), loadStats(), loadRecentOrders()]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
    setFilteredOrders(data);
  };

  const loadStats = async () => {
    const data = await getOrderStats();
    setStats(data);
  };

  const loadRecentOrders = async () => {
    const data = await getRecentOrders();
    setRecentOrders(data);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "processing",
      processing: "shipped",
      shipped: "delivered",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    return statusFlow[currentStatus];
  };

  const getAvailableActions = (currentStatus) => {
    const actions = [];

    if (currentStatus === "pending") {
      actions.push({ label: "Process", nextStatus: "processing", color: "blue" });
      actions.push({ label: "Cancel", nextStatus: "cancelled", color: "red" });
    } else if (currentStatus === "processing") {
      actions.push({ label: "Ship", nextStatus: "shipped", color: "blue" });
      actions.push({ label: "Cancel", nextStatus: "cancelled", color: "red" });
    } else if (currentStatus === "shipped") {
      actions.push({ label: "Deliver", nextStatus: "delivered", color: "green" });
    }

    return actions;
  };

  const handleUpdateStatus = async (orderId, currentStatus, newStatus) => {
    setUpdating(orderId);
    const result = await updateOrderStatus(orderId, newStatus);

    if (result.success) {
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
      loadAllData();
    } else {
      toast.error("Failed to update order status");
    }
    setUpdating(null);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const result = await deleteOrder(orderId);
      if (result.success) {
        toast.success("Order deleted successfully");
        loadAllData();
      } else {
        toast.error("Failed to delete order");
      }
    }
  };

  const handleClearAllOrders = async () => {
    if (window.confirm("⚠️ WARNING: This will delete ALL orders. Are you sure?")) {
      const result = await clearAllOrders();
      if (result.success) {
        toast.success("All orders cleared");
        loadAllData();
      } else {
        toast.error("Failed to clear orders");
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      const results = orders.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredOrders(results);
      setLoading(false);
    } else {
      if (activeTab === "all") {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(orders.filter((order) => order.status === activeTab));
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === tab);
      setFilteredOrders(filtered);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setAdminAuthenticated(false);
    toast.success("Logged out successfully");
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

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <Layout cartCount={cartCount}>
        <div className="container mx-auto px-3 sm:px-4 py-8">
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-pulse text-3xl text-amber-400"></i>
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout cartCount={cartCount}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500">Manage customer orders</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleClearAllOrders} className="flex-1 sm:flex-none bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm">
              <i className="fas fa-trash-alt mr-1 sm:mr-2"></i> Clear All
            </button>
            <button onClick={handleLogout} className="flex-1 sm:flex-none bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm">
              <i className="fas fa-sign-out-alt mr-1 sm:mr-2"></i> Logout
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">Processing</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.processing || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">Shipped</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.shipped || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">Delivered</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.delivered || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">Revenue</p>
              <p className="text-base sm:text-xl font-bold text-amber-600">₹{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by Order ID, Email, or Name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value === "") {
                    if (activeTab === "all") {
                      setFilteredOrders(orders);
                    } else {
                      setFilteredOrders(orders.filter((order) => order.status === activeTab));
                    }
                  }
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
              <button onClick={handleSearch} className="bg-amber-400 text-gray-950 px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-300 text-sm">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <div className="flex gap-2 flex-wrap overflow-x-auto pb-1">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${activeTab === "all" ? "bg-amber-400 text-gray-950" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => handleTabChange("pending")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${activeTab === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Pending ({orders.filter((o) => o.status === "pending").length})
              </button>
              <button
                onClick={() => handleTabChange("processing")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${activeTab === "processing" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Processing ({orders.filter((o) => o.status === "processing").length})
              </button>
              <button
                onClick={() => handleTabChange("shipped")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${activeTab === "shipped" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Shipped ({orders.filter((o) => o.status === "shipped").length})
              </button>
              <button
                onClick={() => handleTabChange("delivered")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${activeTab === "delivered" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Delivered ({orders.filter((o) => o.status === "delivered").length})
              </button>
              <button
                onClick={() => handleTabChange("cancelled")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${activeTab === "cancelled" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Cancelled ({orders.filter((o) => o.status === "cancelled").length})
              </button>
            </div>
          </div>
        </div>

        {recentOrders.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Recent Orders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 cursor-pointer hover:shadow-lg transition" onClick={() => handleViewOrder(order)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500 font-mono">{order.orderId?.slice(-8)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusBadgeClass(order.status)}`}>
                      <i className={getStatusIcon(order.status)}></i>
                      <span className="hidden sm:inline">{order.status}</span>
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">₹{formatPrice(order.total)}</p>
                  <p className="text-xs text-gray-400 mt-2">{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-md">
            <i className="fas fa-box-open text-5xl sm:text-6xl text-gray-400 mb-3 sm:mb-4"></i>
            <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="block sm:hidden">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500 font-mono">{order.orderId}</span>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusBadgeClass(order.status)}`}>
                      <i className={getStatusIcon(order.status)}></i>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{order.customer?.email}</p>
                  <p className="text-sm font-bold text-amber-600 mt-1">₹{formatPrice(order.total)}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {getAvailableActions(order.status).map((action) => (
                      <button
                        key={action.nextStatus}
                        onClick={() => handleUpdateStatus(order.id, order.status, action.nextStatus)}
                        disabled={updating === order.id}
                        className={`px-3 py-1 rounded text-xs font-semibold text-white transition ${
                          action.color === "blue" ? "bg-blue-500 hover:bg-blue-600" : action.color === "green" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {updating === order.id ? <i className="fas fa-spinner fa-pulse"></i> : action.label}
                      </button>
                    ))}
                    <button onClick={() => handleViewOrder(order)} className="px-3 py-1 bg-gray-500 text-white rounded text-xs font-semibold hover:bg-gray-600">
                      View
                    </button>
                    <button onClick={() => handleDeleteOrder(order.id)} className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4 text-sm font-mono text-gray-600">{order.orderId}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-37.5 lg:max-w-none">{order.customer?.email}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm font-bold text-amber-600">₹{formatPrice(order.total)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                          <i className={getStatusIcon(order.status)}></i>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {getAvailableActions(order.status).map((action) => (
                            <button
                              key={action.nextStatus}
                              onClick={() => handleUpdateStatus(order.id, order.status, action.nextStatus)}
                              disabled={updating === order.id}
                              className={`px-2 lg:px-3 py-1 rounded text-xs font-semibold text-white transition ${
                                action.color === "blue" ? "bg-blue-500 hover:bg-blue-600" : action.color === "green" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                              }`}
                            >
                              {updating === order.id ? <i className="fas fa-spinner fa-pulse"></i> : action.label}
                            </button>
                          ))}
                          <button onClick={() => handleViewOrder(order)} className="px-2 lg:px-3 py-1 bg-gray-500 text-white rounded text-xs font-semibold hover:bg-gray-600">
                            View
                          </button>
                          <button onClick={() => handleDeleteOrder(order.id)} className="px-2 lg:px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-lg sm:text-xl"></i>
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Order Information</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Order ID: <span className="font-mono">{selectedOrder.orderId}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Date: {selectedOrder.date ? new Date(selectedOrder.date).toLocaleString() : "N/A"}</p>
                  <p className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-2">
                    Status:
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                      <i className={getStatusIcon(selectedOrder.status)}></i>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Payment: {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : selectedOrder.paymentMethod}</p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Customer Details</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">{selectedOrder.customer?.email}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{selectedOrder.customer?.phone}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.zipCode}
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs sm:text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">₹{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span className="text-sm sm:text-base">Total Amount</span>
                    <span className="text-amber-600 text-lg sm:text-xl">₹{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-2">
                {getAvailableActions(selectedOrder.status).map((action) => (
                  <button
                    key={action.nextStatus}
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, selectedOrder.status, action.nextStatus);
                      setShowModal(false);
                    }}
                    className={`flex-1 text-white py-2 rounded-lg font-semibold transition text-sm ${
                      action.color === "blue" ? "bg-blue-500 hover:bg-blue-600" : action.color === "green" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    handleDeleteOrder(selectedOrder.id);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
