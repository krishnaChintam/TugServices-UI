import axios from 'axios';
import { getServiceUrls, API_HEADERS, CONTENT_TYPES, API_CONFIG } from './apiConfig.js';

// Token key constants - must match with authService.js
const TOKEN_KEY = 'token';
const USER_DATA_KEY = 'userData';

// Get service URLs from centralized configuration
const serviceUrls = getServiceUrls();

// Create the axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: serviceUrls.MAIN_API,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    [API_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
  },
});

// Add a request interceptor for handling tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    // Debugging log (remove in production)
    console.log('Token status:', token ? 'Present' : 'Missing');

    // ✅ Only attach Authorization header if token exists
    if (token) {
      config.headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Authentication error (401):', error.response.data);

      // Clear token and user data on authentication error
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);

      // Do not redirect here — let the component handle it
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;