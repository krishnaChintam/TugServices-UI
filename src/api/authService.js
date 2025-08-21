import axiosInstance from './axiosConfig';

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
      const response = await axiosInstance.post('/api/Login', credentials);
      
      // Check if the login was successful
      if (!response.data.status) {
        throw new Error(response.data.errors?.[0] || 'Invalid credentials');
      }
      
      // Save token for authentication from the new response structure
      if (response.data.data?.token) {
        tokenService.setToken(response.data.data.token);
      }
      
      // Save user data from the new response structure
      if (response.data.data?.user) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data.user));
      }
      
      return {
        token: response.data.data?.token,
        userData: response.data.data?.user
      };
    } catch (error) {
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
    // return axiosInstance.post('/api/Logout');
  },
  
  // Get current user data from localStorage
  getCurrentUser: () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }
};

export default authService; 