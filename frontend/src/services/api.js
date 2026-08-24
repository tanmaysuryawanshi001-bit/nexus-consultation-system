import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Ensure protocol is always present
if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = `https://${rawUrl}`;
}

const api = axios.create({
  baseURL: rawUrl,
  withCredentials: true,
});

// Request interceptor to attach JWT token if present
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
};

export const consultantAPI = {
  getAll: (params) => api.get('/consultants', { params }),
  getById: (id) => api.get(`/consultants/${id}`),
};

export default api;