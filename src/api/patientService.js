import axios from 'axios';
import { tokenService } from './authService';

const API_URL = 'https://myavawebapi.azurewebsites.net/api';

// Create axios instance with authorization header
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const patientService = {
  // Get all patients
  getAllPatients: async () => {
    try {
      const response = await apiClient.get('/Patient/GetAllPatients');
      
      // API response contains data array with the actual data
      if (response.data && Array.isArray(response.data.data)) {
        return {
          items: response.data.data,
          totalCount: response.data.totalCount || response.data.data.length,
          pageNumber: response.data.pageNumber || 0,
          pageSize: response.data.pageSize || response.data.data.length,
          hasNextPage: response.data.hasNextPage || false,
          hasPreviousPage: response.data.hasPreviousPage || false
        };
      }
    } catch (error) {
      console.error('Error fetching all patients:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch patients',
        items: []
      };
    }
  },
  
  // Get patient by ID
  getPatientById: async (userId) => {
    try {
      const response = await apiClient.get(`/Patient/GetPatientById?userId=${userId}`);
      return { data: response.data || {} };
    } catch (error) {
      console.error(`Error fetching patient with ID ${userId}:`, error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch patient'
      };
    }
  },
  
  // Additional patient-related API methods can be added here
  
  // Create a new patient
  createPatient: async (patientData) => {
    try {
      const response = await apiClient.post('/Patient/CreatePatient', patientData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating patient:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create patient'
      };
    }
  },

  // Get patient profile options for dropdowns
  getPatientProfileOptions: async () => {
    try {
      const response = await apiClient.get('/OptionSet/PatientProfileOptions');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching patient profile options:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch patient profile options',
        // Default empty options for fallback
        data: {
          races: [],
          ethnicities: [],
          securityQuestions: [],
          genders: [],
          clients: [],
          subClients: [],
          countries: [],
          states: []
        }
      };
    }
  },
};

export default patientService; 