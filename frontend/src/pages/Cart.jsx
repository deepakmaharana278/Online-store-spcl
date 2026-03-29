import React from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";

const Cart = ({ cart, updateQuantity, removeFromCart, cartCount }) => {
  // console.log("Cart component rendering with cart:", cart);
  const navigate = useNavigate()
  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);


  if (!cart || cart.length === 0) {
    return (
      <Layout cartCount={cartCount}>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart!</p>
          <Link 
            to="/" 
            className="inline-block bg-amber-400 text-gray-950 px-6 py-3 rounded-lg hover:bg-amber-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout cartCount={cartCount}>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-500 text-sm md:text-base">{cart.length} item(s) in your cart</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="lg:w-2/3">
            <div className="hidden md:block bg-gray-50 rounded-t-lg p-4 mb-2 border border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-gray-600 text-sm font-semibold">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
            </div>
            
            {cart.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md mb-4 p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
              
                <div className="flex flex-col md:hidden gap-4">
                  <div className="flex gap-4">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain rounded bg-gray-100"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/300x200/1f2937/6b7280?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-amber-600 font-bold text-lg">₹{parseFloat(item.price).toLocaleString("en-IN")}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-gray-700 font-medium">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-amber-600 text-lg">₹{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded bg-gray-100"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/300x200/1f2937/6b7280?text=No+Image";
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 hover:text-amber-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-gray-700 font-medium">₹{parseFloat(item.price).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-gray-700 font-medium">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-bold text-amber-600 text-lg">₹{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-6">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors text-sm md:text-base"
              >
                <i className="fa-regular fa-circle-left"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-20 border border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Order Summary</h2>
              
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-gray-200 pt-3 md:pt-4">
                  <div className="flex justify-between text-gray-800 font-bold text-lg md:text-xl">
                    <span>Total</span>
                    <span className="text-amber-600">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={()=> navigate('/checkout')} className="w-full bg-amber-400 text-gray-950 py-2.5 md:py-3 rounded-lg hover:bg-amber-300 transition-colors font-semibold text-sm md:text-base mb-3">
                Proceed to Checkout
              </button>
              
              <p className="text-center text-gray-500 text-xs md:text-sm">
                Secure payment methods accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>

  );
};

export default Cart;