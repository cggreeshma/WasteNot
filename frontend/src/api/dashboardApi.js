import api from './axios';

export const getSellerStats = () => api.get('/dashboard/seller');
export const getBuyerStats = () => api.get('/dashboard/buyer');
