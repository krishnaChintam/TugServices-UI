import axiosInstance from './axiosConfig.js';
import { AUTH } from './apiConfig.js';

// Token management helper functions
const TOKEN_KEY = 'token';
const USER_DATA_KEY = 'userData';

export const tokenService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem('rememberMe');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post(AUTH.LOGIN, credentials);
      
      // Check if the response is successful (status 200)
      if (response.status === 200) {
        // Handle different response structures
        if (typeof response.data === 'string' && response.data === 'Login successful!') {
          // Simple string response indicating success
          return {
            success: true,
            message: response.data,
            token: null, // No token provided in this response structure
            userData: null // No user data provided in this response structure
          };
        } else if (response.data && typeof response.data === 'object') {
          // Object response structure
          if (response.data.status !== 200) {
            throw new Error(response.data.errors?.[0] || 'Invalid credentials');
          }
          
          // Save token for authentication
          if (response.data.data?.token) {
            tokenService.setToken(response.data.data.token);
          }
          
          // Save user data
          if (response.data.data?.user) {
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data.user));
          }
          
          return {
            success: true,
            token: response.data.data?.token,
            userData: response.data.data?.user,
            message: response.data.message || 'Login successful'
          };
        } else {
          // Unexpected response structure
          throw new Error('Unexpected response format from server');
        }
      } else {
        throw new Error('Login failed with status: ' + response.status);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle both network errors and API response errors
      if (error.response?.data) {
        throw new Error(error.response.data.errors?.[0] || 'Login failed');
      }
      throw error;
    }
  },

  logout: () => {
    // Clear all authentication data
    tokenService.clearToken();    
    // Optionally, you could make a logout API call here if needed
    // return axiosInstance.post(AUTH.LOGOUT);
  },
  
  // Get current user data from localStorage
  getCurrentUser: () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }
};

export default authService; 