// src/api/hr-management/positions.js
import axios from 'axios';

const API_URL = 'http://140.245.213.62:8001';

// Create axios instance with authorization header
const hrApi = axios.create({
  baseURL: API_URL
});

// Request interceptor to add the auth token
hrApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Position API calls
export const getPositions = async () => {
    try {
      const response = await hrApi.get('/positions/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch positions');
    }
  };
  
  export const getPositionById = async (id) => {
    try {
      const response = await hrApi.get(`/positions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch position');
    }
  };
  
  export const createPosition = async (positionData) => {
    try {
      const response = await hrApi.post('/positions/', positionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create position');
    }
  };
  
  export const updatePosition = async (id, positionData) => {
    try {
      const response = await hrApi.put(`/positions/${id}`, positionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update position');
    }
  };
  
  export const deletePosition = async (id) => {
    try {
      const response = await hrApi.delete(`/positions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete position');
    }
  };
  