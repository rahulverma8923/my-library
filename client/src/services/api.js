import axios from 'axios';

export const getCustomApiUrl = () => {
  return localStorage.getItem('my_library_custom_api_url') || '';
};

export const setCustomApiUrl = (url) => {
  if (!url || !url.trim()) {
    localStorage.removeItem('my_library_custom_api_url');
  } else {
    localStorage.setItem('my_library_custom_api_url', url.trim());
  }
  api.defaults.baseURL = getApiBaseUrl();
};

export const getApiBaseUrl = () => {
  const custom = getCustomApiUrl();
  let url = custom || import.meta.env.VITE_API_URL || '';
  url = url.trim().replace(/\/+$/, ''); // Remove trailing slashes
  if (!url) return '/api';
  if (url.endsWith('/api')) return url;
  return `${url}/api`;
};

export const checkServerHealth = async (overrideUrl) => {
  let target = overrideUrl || getApiBaseUrl();
  target = target.trim().replace(/\/+$/, '');
  const healthUrl = target.endsWith('/api') ? `${target}/health` : (target.endsWith('/api/health') ? target : `${target}/api/health`);
  
  const response = await fetch(healthUrl, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Server returned HTTP status ${response.status}`);
  }
  const data = await response.json();
  return data;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 35000,
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
