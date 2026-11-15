import api from './axios';

export const createReservation = (data) => api.post('/reservations', data);
export const getMyReservations = () => api.get('/reservations/my');
export const getIncomingReservations = () => api.get('/reservations/incoming');
export const updateReservationStatus = (id, status) =>
  api.put(`/reservations/${id}/status`, { status });
