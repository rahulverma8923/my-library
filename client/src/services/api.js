import axios from 'axios';

const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || '';
  url = url.trim().replace(/\/+$/, ''); // Remove trailing slashes
  if (!url) return '/api';
  if (url.endsWith('/api')) return url;
  return `${url}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthenticated 401 responses and HTML responses
api.interceptors.response.use(
  (response) => {
    // If backend returned HTML (e.g. Vercel SPA 404 fallback instead of JSON)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      const error = new Error('Backend API endpoint returned HTML. Please check your backend URL connection.');
      error.isHtmlFallback = true;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local storage
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
