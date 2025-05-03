// src/api/hr-management/departments.js
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

// Department API calls
export const getDepartments = async () => {
    try {
      const response = await hrApi.get('/departments/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch departments');
    }
  };
  
  export const getDepartmentById = async (id) => {
    try {
      const response = await hrApi.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch department');
    }
  };
  
  export const createDepartment = async (departmentData) => {
    try {
      const response = await hrApi.post('/departments/', departmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create department');
    }
  };
  
  export const updateDepartment = async (id, departmentData) => {
    try {
      const response = await hrApi.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update department');
    }
  };
  
  export const deleteDepartment = async (id) => {
    try {
      const response = await hrApi.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete department');
    }
  };
  