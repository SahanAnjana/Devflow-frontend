// src/api/hr-management/employees.js
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

// Employee API calls
export const getEmployees = async (filters = {}) => {
    try {
      const response = await hrApi.get('/employees/', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch employees');
    }
  };
  
  export const getEmployeeById = async (id) => {
    try {
      const response = await hrApi.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch employee');
    }
  };
  
  export const getOwnEmployeeProfile = async () => {
    try {
      const response = await hrApi.get('/employees/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch your profile');
    }
  };
  
  export const createEmployee = async (employeeData) => {
    try {
      const response = await hrApi.post('/employees/', employeeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create employee');
    }
  };
  
  export const updateEmployee = async (id, employeeData) => {
    try {
      const response = await hrApi.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update employee');
    }
  };
  
  export const deleteEmployee = async (id) => {
    try {
      const response = await hrApi.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete employee');
    }
  };
  