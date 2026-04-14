import { db } from "../firebase/config";
import { 
  collection, getDocs, updateDoc, deleteDoc, doc, 
  query, orderBy, where, serverTimestamp, addDoc, getDoc
} from "firebase/firestore";

// Get all orders from Firestore
export const getOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().createdAt?.toDate?.() || new Date()
      });
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

// Update order status in Firestore
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
      statusHistory: serverTimestamp()
    });
    
    console.log(`Order ${orderId} status updated to: ${newStatus}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: error.message };
  }
};

// Delete order from Firestore
export const deleteOrder = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await deleteDoc(orderRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: error.message };
  }
};

// Get order statistics from Firestore
export const getOrderStats = async () => {
  try {
    const orders = await getOrders();
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      todayOrders: orders.filter(o => {
        if (!o.createdAt) return false;
        const orderDate = o.createdAt.toDate().toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
      }).length
    };
    
    return stats;
  } catch (error) {
    console.error("Error getting stats:", error);
    return null;
  }
};

// Get recent orders
export const getRecentOrders = async () => {
  const orders = await getOrders();
  return orders.slice(0, 5);
};

// Search orders
export const searchOrders = async (searchTerm) => {
  const orders = await getOrders();
  const term = searchTerm.toLowerCase();
  
  return orders.filter(order => 
    order.orderId?.toLowerCase().includes(term) ||
    order.customer?.email?.toLowerCase().includes(term) ||
    order.customer?.firstName?.toLowerCase().includes(term) ||
    order.customer?.lastName?.toLowerCase().includes(term)
  );
};

// Clear all orders
export const clearAllOrders = async () => {
  try {
    const orders = await getOrders();
    for (const order of orders) {
      if (order.id) {
        await deleteDoc(doc(db, "orders", order.id));
      }
    }
    return { success: true };
  } catch (error) {
    console.error("Error clearing orders:", error);
    return { success: false, error: error.message };
  }
};