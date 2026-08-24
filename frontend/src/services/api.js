import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
});

// export default API;

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const consultantAPI = {
  getAll: (params) => API.get('/consultants', { params }),
  apply: (data) => API.post('/consultants/apply', data),
};

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
};

export default API;