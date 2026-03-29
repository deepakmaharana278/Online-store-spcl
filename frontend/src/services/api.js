import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories/`);
  return response.data;
};

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('min_price', filters.minPrice);
  if (filters.maxPrice) params.append('max_price', filters.maxPrice);
  if (filters.minRating) params.append('min_rating', filters.minRating);
  if (filters.search) params.append('search', filters.search);
  if (filters.ordering) params.append('ordering', filters.ordering);
  
  const response = await axios.get(`${API_BASE_URL}/products/?${params}`);
  return response.data;
}

export const fetchFeaturedProducts = async (limit = 8) => {
  const response = await axios.get(`${API_BASE_URL}/products/featured/?limit=${limit}`);
  return response.data;
};