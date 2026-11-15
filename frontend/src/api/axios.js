import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Axios automatically handles:
// JSON requests as application/json
// FormData requests as multipart/form-data

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;