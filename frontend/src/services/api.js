import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = `https://${rawUrl}`;
}

const api = axios.create({
  baseURL: rawUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const consultantAPI = {
  getAll: (params) => api.get('/consultants', { params }),
  getById: (id) => api.get(`/consultants/${id}`),
  updateProfile: (data) => api.put('/consultants/profile', data),
};

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/my-bookings'),
  getConsultantBookings: () => api.get('/bookings/consultant-bookings'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

export { api };
export default api;