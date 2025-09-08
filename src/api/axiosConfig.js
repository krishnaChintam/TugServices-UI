import axios from 'axios';
import { getServiceUrls, API_HEADERS, CONTENT_TYPES, API_CONFIG } from './apiConfig.js';

// Token key constant - must match with authService.js
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
    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    
    // Log token status for debugging (remove in production)
    console.log('Token status:', token ? 'Present' : 'Missing');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      console.error('Authentication error (401):', error.response.data);
      
      // Clear token on authentication error
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      
      // Let the component handle the redirect - don't do it here
      // This allows the component to show appropriate error messages
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 