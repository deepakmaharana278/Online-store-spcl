import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import { useEffect, useState } from "react";
import Products from "./pages/Products";
import CheckOut from "./pages/CheckOut";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import OrderTracking from "./pages/OrderTracking";

const App = () => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setAdminAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // console.log("App: Loading cart from localStorage:", parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart:", error);
        setCart([]);
      }
    }
    setIsInitialized(true);
  }, []);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Cart cleared successfully!");
  };

  useEffect(() => {
    if (isInitialized) {
      // console.log("App: Cart updated, saving to localStorage:", cart);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cart, isInitialized]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);

      let newCart;
      if (existingIndex !== -1) {
        newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: (newCart[existingIndex].quantity || 1) + 1,
        };
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      return newCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    console.log("App: Updating quantity for product:", productId, "to:", newQuantity);
    setCart((prev) => {
      if (newQuantity <= 0) {
        return prev.filter((item) => item.id !== productId);
      } else {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item));
      }
    });
  };

  const removeFromCart = (productId) => {
    // console.log("App: Removing product from cart:", productId);
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} cartCount={cartCount} />} />
          <Route path="/products" element={<Products onAddToCart={addToCart} />} />
          <Route path="/checkout" element={<CheckOut cart={cart} cartCount={cartCount} clearCart={() => setCart([])} />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track-order" element={<OrderTracking cartCount={cartCount} />} />
          <Route
            path="/admin"
            element={adminAuthenticated ? <AdminDashboard cartCount={cartCount} setAdminAuthenticated={setAdminAuthenticated} /> : <AdminLogin setAdminAuthenticated={setAdminAuthenticated} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
