import React, { useState, useEffect } from "react";
import { fetchCategories } from "../services/api";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const handleCategoryChange = (slug) => {
    onFilterChange({ category: filters.category === slug ? "" : slug });
  };

  const handlePriceChange = () => {
    onFilterChange({
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
  };

  const handleRatingChange = (rating) => {
    const newRating = selectedRating === rating ? "" : rating;
    setSelectedRating(newRating);
    onFilterChange({ minRating: newRating });
  };

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedRating("");
    onFilterChange({
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      ordering: ""
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button onClick={clearFilters} className="text-blue-600 text-sm">
          Clear All
        </button>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Categories</h4>
        {categories.map(cat => (
          <label key={cat.id} className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.category === cat.slug}
              onChange={() => handleCategoryChange(cat.slug)}
              className="mr-2"
            />
            <span>{cat.icon} {cat.name}</span>
          </label>
        ))}
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
            onBlur={handlePriceChange}
            className="border rounded px-2 py-1 w-full"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
            onBlur={handlePriceChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3">Rating</h4>
        {[4, 3, 2].map(rating => (
          <label key={rating} className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedRating === rating}
              onChange={() => handleRatingChange(rating)}
              className="mr-2"
            />
            <span className="text-yellow-500">
              {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
            </span>
            <span className="ml-1">& up</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;