/**
 * API Services - Ready-to-use service functions for API calls
 * This file provides actual service functions that can be used throughout the application
 */

import axiosInstance from "./axiosConfig.js";
import {
  TUG_SERVICES,
  LOCATIONS,
  VESSELS,
  LISTING,
  TYPE_OF_SERVICES,
} from "./apiConfig.js";

// Tug Services API
export const tugService = {
  // Flexible method to get all services by endpoint
  getAllServices: async (endpoint = TUG_SERVICES.GET_ALL_SERVICES) => {
    try {
      console.log(endpoint);
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  },

  // Get service by ID
  getServiceById: async (serviceId,url=TUG_SERVICES.GET_SERVICE_BY_ID) => {
    try {
      const response = await axiosInstance.get(
        `${url}/${serviceId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
  },

  getfilesById: async (serviceId, url = TUG_SERVICES.GET_SERVICE_BY_ID) => {
    try {
      const response = await axiosInstance.get(`${url}/${serviceId}`, {
        responseType: "blob",
      });
      return response; // ✅ Return full response (not just data)
    } catch (error) {
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
  },

  deleteFileById: async (documentId, url = TUG_SERVICES.DELETE_UPLOADED_DOC_BY_ID) => {
    try {
      const response = await axiosInstance.delete(`${url}/${documentId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      const response = await axiosInstance.post(
        TUG_SERVICES.CREATE_SERVICE,
        serviceData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }
  },

  // Update service
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await axiosInstance.put(
        `${TUG_SERVICES.UPDATE_SERVICE}/${serviceId}`,
        serviceData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    try {
      const response = await axiosInstance.delete(
        `${TUG_SERVICES.DELETE_SERVICE}/${serviceId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete service: ${error.message}`);
    }
  },

  // Upload service
uploadService: async (payload) => {
  try {
    // Create FormData to handle files + metadata
    const formData = new FormData();

    // Append non-file fields
    formData.append("serviceId", payload.serviceId);
    formData.append("uploadedBy", payload.uploadedBy);

    // Append documents (single or multiple files)
    if (Array.isArray(payload.documents)) {
      payload.documents.forEach((file) => {
        formData.append("documents", file);
      });
    } else {
      formData.append("documents", payload.documents);
    }

    // API call
    const response = await axiosInstance.post(
      TUG_SERVICES.UPLOAD_DOC_BY_ID,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to upload documents: ${error.message}`);
  }
},


};

// Locations API
export const locationService = {
  // Get all locations
  getAllLocations: async () => {
    try {
      const response = await axiosInstance.get(LOCATIONS.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch locations: ${error.message}`);
    }
  },

  // Get location by ID
  getLocationById: async (locationId) => {
    try {
      const response = await axiosInstance.get(
        `${LOCATIONS.GET_BY_ID}/${locationId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error.message}`);
    }
  },

  // Create new location
  createLocation: async (locationData) => {
    try {
      const response = await axiosInstance.post(LOCATIONS.CREATE, locationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create location: ${error.message}`);
    }
  },
};

export const typeOfService = {
  getAllTypeOfServices: async () => {
    try {
      const response = await axiosInstance.get(TYPE_OF_SERVICES.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch typeOfServices: ${error.message}`);
    }
  },
};

// Vessels API
export const vesselService = {
  // Get all vessels
  getAllVessels: async () => {
    try {
      const response = await axiosInstance.get(VESSELS.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch vessels: ${error.message}`);
    }
  },

  // Get vessel by ID
  getVesselById: async (vesselId) => {
    try {
      const response = await axiosInstance.get(
        `${VESSELS.GET_BY_ID}/${vesselId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch vessel: ${error.message}`);
    }
  },

  // Create new vessel
  createVessel: async (vesselData) => {
    try {
      const response = await axiosInstance.post(VESSELS.CREATE, vesselData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create vessel: ${error.message}`);
    }
  },
};

// Generic service that can handle any endpoint directly
export const genericDataService = {
  // Universal method to save data by endpoint
  saveData: async (endpoint, data) => {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to save data: ${error.message}`);
    }
  },

  // Universal method to update data by endpoint
  updateData: async (endpoint, id, data) => {
    try {
      const response = await axiosInstance.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update data: ${error.message}`);
    }
  },
  // Universal method to get all data by endpoint
  getAllData: async (endpoint) => {
    try {
      const response = await axiosInstance.get(endpoint);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      };
    }
  },

  // Universal method to get data by ID using endpoint
  getDataById: async (endpoint, id) => {
    try {
      const fullEndpoint = `${endpoint}/${id}`;
      const response = await axiosInstance.get(fullEndpoint);
      return {
        success: true,
        data: response.data,
        id: id,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        id: id,
        status: error.response?.status || 500,
      };
    }
  },
};

export default {
  tugService,
  locationService,
  vesselService,
  genericDataService,
};
