/**
 * Centralized API Configuration
 * This file contains all API endpoints, service URLs, and configuration constants
 * for easy maintenance and reusability across the application.
 */

// Environment-based configuration
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging'
};

// Current environment (you can change this based on your needs)
const CURRENT_ENV = ENV.DEVELOPMENT;

// Service URLs configuration
export const SERVICE_URLS = {
  [ENV.DEVELOPMENT]: {
    MAIN_API: 'http://192.168.1.3:8080/',
    EXTERNAL_API: 'https://tep.api.com',
    AUTH_SERVICE: 'http://192.168.1.3:8080/',
    USER_SERVICE: 'http://192.168.1.3:8080/',
    PAYMENT_SERVICE: 'http://192.168.1.3:8080/',
    NOTIFICATION_SERVICE: 'http://192.168.1.3:8080/'
  },
  [ENV.STAGING]: {
    MAIN_API: 'https://staging-api.tugservices.com/',
    EXTERNAL_API: 'https://staging-tep.api.com',
    AUTH_SERVICE: 'https://staging-auth.tugservices.com/',
    USER_SERVICE: 'https://staging-user.tugservices.com/',
    PAYMENT_SERVICE: 'https://staging-payment.tugservices.com/',
    NOTIFICATION_SERVICE: 'https://staging-notification.tugservices.com/'
  },
  [ENV.PRODUCTION]: {
    MAIN_API: 'https://api.tugservices.com/',
    EXTERNAL_API: 'https://tep.api.com',
    AUTH_SERVICE: 'https://auth.tugservices.com/',
    USER_SERVICE: 'https://user.tugservices.com/',
    PAYMENT_SERVICE: 'https://payment.tugservices.com/',
    NOTIFICATION_SERVICE: 'https://notification.tugservices.com/'
  }
};

// Get current service URLs based on environment
export const getServiceUrls = () => SERVICE_URLS[CURRENT_ENV];

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/Login',
    LOGOUT: '/api/Logout',
    REGISTER: '/api/Register',
    REFRESH_TOKEN: '/api/RefreshToken',
    FORGOT_PASSWORD: '/api/ForgotPassword',
    RESET_PASSWORD: '/api/ResetPassword',
    VERIFY_EMAIL: '/api/VerifyEmail',
    CHANGE_PASSWORD: '/api/ChangePassword'
  },

  // User management endpoints
  USER: {
    PROFILE: '/api/User/Profile',
    UPDATE_PROFILE: '/api/User/UpdateProfile',
    DELETE_ACCOUNT: '/api/User/DeleteAccount',
    UPLOAD_AVATAR: '/api/User/UploadAvatar',
    GET_USERS: '/api/User/GetUsers',
    GET_USER_BY_ID: '/api/User/GetUserById',
    UPDATE_USER_STATUS: '/api/User/UpdateStatus'
  },

  // Tug services endpoints
  TUG_SERVICES: {
    GET_ALL_SERVICES: '/api/TugServices/GetAll',
    GET_SERVICE_BY_ID: '/api/TugServices/GetById',
    CREATE_SERVICE: '/api/TugServices/Create',
    UPDATE_SERVICE: '/api/TugServices/Update',
    DELETE_SERVICE: '/api/TugServices/Delete',
    SEARCH_SERVICES: '/api/TugServices/Search',
    GET_SERVICES_BY_CATEGORY: '/api/TugServices/GetByCategory',
    GET_POPULAR_SERVICES: '/api/TugServices/GetPopular'
  },

  // Locations endpoints
  LOCATIONS: {
    GET_ALL: '/api/locations/all',
    GET_BY_ID: '/api/locations/GetById',
    CREATE: '/api/locations/Create',
    UPDATE: '/api/locations/Update',
  },

  // Vessels endpoints
  VESSELS: {
    GET_ALL: '/api/vessels/all',
    GET_BY_ID: '/api/vessels/GetById',
    CREATE: '/api/vessels/Create',
    UPDATE: '/api/vessels/Update',
  },

  // Listing endpoints
  LISTING: {
    GET_ALL: '/api/listing',
    GET_BY_ID: '/api/listing/GetById',
    CREATE: '/api/listing/Create',
    UPDATE: '/api/listing/Update',
  },

};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

// API Response Status Codes
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAILED: 'failed',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  VALIDATION_ERROR: 'validation_error'
};

// Common API Headers
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent'
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded'
};

// API Configuration Constants
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
};

// Helper function to get full URL for an endpoint
export const getFullUrl = (service, endpoint) => {
  const serviceUrls = getServiceUrls();
  const baseUrl = serviceUrls[service] || serviceUrls.MAIN_API;
  return `${baseUrl}${endpoint}`;
};

// Helper function to get API endpoint with service
export const getApiEndpoint = (service, endpoint) => {
  return getFullUrl(service, endpoint);
};

// Export current environment for reference
export { CURRENT_ENV, ENV };

// Export service URLs for easy access (from apiConstants.js)
export const { MAIN_API, AUTH_SERVICE, USER_SERVICE, PAYMENT_SERVICE, NOTIFICATION_SERVICE } = getServiceUrls();

// Export commonly used endpoints (from apiConstants.js)
export const {
  AUTH,
  USER,
  TUG_SERVICES,
  LOCATIONS,
  VESSELS,
  LISTING,
  BOOKING,
  PAYMENT,
  NOTIFICATION,
  REVIEW,
  CATEGORY,
  DASHBOARD,
  UPLOAD
} = API_ENDPOINTS;

// Helper functions for common API operations (from apiConstants.js)
export const API_HELPERS = {
  // Get full URL for authentication endpoints
  getAuthUrl: (endpoint) => getFullUrl('AUTH_SERVICE', endpoint),
  
  // Get full URL for user endpoints
  getUserUrl: (endpoint) => getFullUrl('USER_SERVICE', endpoint),
  
  // Get full URL for main API endpoints
  getMainApiUrl: (endpoint) => getFullUrl('MAIN_API', endpoint),
  
  // Get full URL for payment endpoints
  getPaymentUrl: (endpoint) => getFullUrl('PAYMENT_SERVICE', endpoint),
  
  // Get full URL for notification endpoints
  getNotificationUrl: (endpoint) => getFullUrl('NOTIFICATION_SERVICE', endpoint)
};

// Common API endpoints as full URLs for direct use (from apiConstants.js)
export const API_URLS = {
  // Authentication URLs
  LOGIN: API_HELPERS.getAuthUrl(AUTH.LOGIN),
  LOGOUT: API_HELPERS.getAuthUrl(AUTH.LOGOUT),
  REGISTER: API_HELPERS.getAuthUrl(AUTH.REGISTER),
  REFRESH_TOKEN: API_HELPERS.getAuthUrl(AUTH.REFRESH_TOKEN),
  
  // User URLs
  USER_PROFILE: API_HELPERS.getUserUrl(USER.PROFILE),
  UPDATE_PROFILE: API_HELPERS.getUserUrl(USER.UPDATE_PROFILE),
  
  // Tug Services URLs
  GET_ALL_SERVICES: API_HELPERS.getMainApiUrl(TUG_SERVICES.GET_ALL_SERVICES),
  CREATE_SERVICE: API_HELPERS.getMainApiUrl(TUG_SERVICES.CREATE_SERVICE),
};

// Default export with all configurations
export default {
  SERVICE_URLS,
  API_ENDPOINTS,
  HTTP_METHODS,
  API_STATUS,
  API_HEADERS,
  CONTENT_TYPES,
  API_CONFIG,
  getServiceUrls,
  getFullUrl,
  getApiEndpoint,
  CURRENT_ENV,
  ENV,
  // Additional exports from apiConstants
  MAIN_API,
  AUTH_SERVICE,
  USER_SERVICE,
  PAYMENT_SERVICE,
  NOTIFICATION_SERVICE,
  AUTH,
  USER,
  TUG_SERVICES,
  LOCATIONS,
  VESSELS,
  LISTING,
  BOOKING,
  PAYMENT,
  NOTIFICATION,
  REVIEW,
  CATEGORY,
  DASHBOARD,
  UPLOAD,
  API_HELPERS,
  API_URLS
};
