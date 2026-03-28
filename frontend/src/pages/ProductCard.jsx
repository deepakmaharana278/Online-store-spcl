import React, { useState } from "react";

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  };

  const handleAddToCart = () => {
    if (isAdding) return; 
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300">
      <div className="h-52 overflow-hidden bg-white">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://placehold.co/300x200/1f2937/6b7280?text=No+Image";
          }}
        />
      </div>

      <div className="p-4 border-t border-gray-800">
        <h3 className="font-semibold text-white text-base mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="text-amber-400 text-sm mb-4">{renderStars(product.rating)}</div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-amber-400">₹{parseFloat(product.price).toLocaleString("en-IN")}</span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`bg-amber-400 text-gray-950 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-lg transition-all duration-150 ${
              isAdding 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-amber-300 active:scale-95'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;