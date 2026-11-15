import api from './axios';

export const getProducts = (params) =>
  api.get('/products', { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const getSellerProducts = () =>
  api.get('/products/seller/my-listings');

export const createProduct = (data) =>
  api.post('/products', data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

// Upload food image to Cloudinary
export const uploadFoodImage = (imageFile) => {
  const formData = new FormData();

  formData.append('image', imageFile);

  return api.post('/uploads/food-image', formData);
};