import axios from 'axios';
import { API_BASE_URL, API_URLS } from '@/constants/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Important for CSRF
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add a request interceptor to get CSRF token before each request
instance.interceptors.request.use(async (config) => {
  // Only get CSRF token for non-GET requests
  if (config.method !== 'get') {
    try {
      // Get CSRF token from cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      if (csrfToken) {
        // Set the token in the header
        config.headers['X-CSRFToken'] = csrfToken;
      } else {
        // If no token in cookie, get a new one
        const response = await axios.get(API_URLS.GET_CSRF_TOKEN);
        config.headers['X-CSRFToken'] = response.data.csrfToken;
      }
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }
  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 