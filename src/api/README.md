# API Configuration Documentation

This directory contains centralized API configuration and services for the TugServices application.

## Files Overview

### Core Configuration Files

1. **`apiConfig.js`** - Main configuration file containing:
   - Service URLs for different environments (development, staging, production)
   - All API endpoints organized by feature
   - HTTP methods, status codes, and headers
   - Helper functions for URL generation
   - Simplified imports and commonly used constants
   - Pre-built API endpoint objects
   - Direct API URLs for common operations

2. **`axiosConfig.js`** - Axios instance configuration:
   - Base configuration using centralized URLs
   - Request/response interceptors
   - Token management
   - Error handling

3. **`authService.js`** - Authentication service:
   - Login/logout functionality
   - Token management
   - User data handling

4. **`apiServices.js`** - Ready-to-use API service functions:
   - Tug services (getAllServices, getServiceById, createService, etc.)
   - Location services (getAllLocations, getLocationById, createLocation)
   - Vessel services (getAllVessels, getVesselById, createVessel)
   - Listing services (getAllListings, getListingById, createListing)
   - Generic data service for flexible API calls

5. **`README.md`** - This documentation file:
   - Usage examples and best practices
   - Configuration guide
   - API endpoint documentation

## Usage Examples

### Basic Import and Usage

```javascript
// Import specific endpoints
import { AUTH, USER, TUG_SERVICES } from './api/apiConfig.js';

// Import service URLs
import { MAIN_API, AUTH_SERVICE } from './api/apiConfig.js';

// Import helper functions
import { API_HELPERS } from './api/apiConfig.js';

// Import pre-built URLs
import { API_URLS } from './api/apiConfig.js';
```

### Using API Endpoints

```javascript
import axiosInstance from './api/axiosConfig.js';
import { TUG_SERVICES, LOCATIONS, VESSELS, LISTING } from './api/apiConfig.js';

// Make API calls using centralized endpoints
const response = await axiosInstance.get(TUG_SERVICES.GET_ALL_SERVICES);
const service = await axiosInstance.get(`${TUG_SERVICES.GET_SERVICE_BY_ID}/123`);

// Using specific endpoints
const locations = await axiosInstance.get(LOCATIONS.GET_ALL);
const vessels = await axiosInstance.get(VESSELS.GET_ALL);
const listings = await axiosInstance.get(LISTING.GET_ALL);
```

### Using Direct API Calls

```javascript
import axiosInstance from './api/axiosConfig.js';
import { LOCATIONS, VESSELS, LISTING, TUG_SERVICES } from './api/apiConfig.js';

// Get different types of data using direct endpoints
const locations = await axiosInstance.get(LOCATIONS.GET_ALL);
const vessels = await axiosInstance.get(VESSELS.GET_ALL);
const listings = await axiosInstance.get(LISTING.GET_ALL);
const tugServices = await axiosInstance.get(TUG_SERVICES.GET_ALL_SERVICES);
```

### Using API Services (Recommended)

```javascript
import { tugService, locationService, vesselService, listingService } from './api/apiServices.js';

// Use ready-to-use service functions
const services = await tugService.getAllServices();
const service = await tugService.getServiceById(123);
const newService = await tugService.createService(serviceData);

const locations = await locationService.getAllLocations();
const vessels = await vesselService.getAllVessels();
const listings = await listingService.getAllListings();
```

### Using Helper Functions

```javascript
import { API_HELPERS } from './api/apiConfig.js';

// Generate full URLs
const authUrl = API_HELPERS.getAuthUrl('/api/Login');
const userUrl = API_HELPERS.getUserUrl('/api/User/Profile');
const mainApiUrl = API_HELPERS.getMainApiUrl('/api/Services');
```

### Using Pre-built URLs

```javascript
import { API_URLS } from './api/apiConfig.js';
import axiosInstance from './api/axiosConfig.js';

// Use pre-built full URLs
const response = await axiosInstance.get(API_URLS.GET_ALL_SERVICES);
const loginResponse = await axiosInstance.post(API_URLS.LOGIN, credentials);
```

### Creating Custom Services

```javascript
import axiosInstance from './api/axiosConfig.js';
import { TUG_SERVICES } from './api/apiConfig.js';

export const customService = {
  async getServices() {
    try {
      const response = await axiosInstance.get(TUG_SERVICES.GET_ALL_SERVICES);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  },

  async createService(serviceData) {
    try {
      const response = await axiosInstance.post(TUG_SERVICES.CREATE_SERVICE, serviceData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }
  }
};
```

## Environment Configuration

The configuration supports multiple environments:

- **Development**: `http://192.168.1.3:8080/`
- **Staging**: `https://staging-api.tugservices.com/`
- **Production**: `https://api.tugservices.com/`

To change the environment, modify the `CURRENT_ENV` variable in `apiConfig.js`:

```javascript
const CURRENT_ENV = ENV.PRODUCTION; // Change to desired environment
```

## Adding New Endpoints

### 1. Add to apiConfig.js

```javascript
// In API_ENDPOINTS object
NEW_FEATURE: {
  GET_ALL: '/api/NewFeature/GetAll',
  CREATE: '/api/NewFeature/Create',
  UPDATE: '/api/NewFeature/Update',
  DELETE: '/api/NewFeature/Delete'
}
```

### 2. Use in your service

```javascript
import { NEW_FEATURE } from './api/apiConfig.js';

const response = await axiosInstance.get(NEW_FEATURE.GET_ALL);
```

## Best Practices

1. **Always use centralized endpoints** instead of hardcoded URLs
2. **Use appropriate service URLs** for different API types
3. **Handle errors consistently** across all services
4. **Use helper functions** for complex URL generation
5. **Keep services focused** on specific features
6. **Export services** for easy importing in components

## Error Handling

The axios configuration includes automatic error handling:

- **401 Unauthorized**: Automatically clears tokens
- **Network errors**: Properly propagated with meaningful messages
- **API errors**: Extracted from response data

## Token Management

Authentication tokens are automatically managed:

- **Request interceptor**: Adds Bearer token to requests
- **Response interceptor**: Handles 401 errors and clears tokens
- **Token service**: Provides utility functions for token management

## File Upload

For file uploads, use the UPLOAD endpoints:

```javascript
import { UPLOAD } from './api/apiConfig.js';

const formData = new FormData();
formData.append('file', file);

const response = await axiosInstance.post(UPLOAD.UPLOAD_FILE, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

This centralized configuration makes it easy to maintain, update, and reuse API endpoints throughout your application.
