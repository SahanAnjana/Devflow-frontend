// src/api/hr-management/leaves.js
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

// Leave API calls
export const getLeaves = async (filters = {}) => {
    try {
      const response = await hrApi.get('/leaves/', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch leaves');
    }
  };
  
  export const getOwnLeaves = async () => {
    try {
      const response = await hrApi.get('/leaves/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch your leaves');
    }
  };
  
  export const getLeaveById = async (id) => {
    try {
      const response = await hrApi.get(`/leaves/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch leave');
    }
  };
  
  export const requestLeave = async (leaveData) => {
    try {
      const response = await hrApi.post('/leaves/', leaveData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to request leave');
    }
  };
  
  export const updateLeave = async (id, leaveData) => {
    try {
      const response = await hrApi.put(`/leaves/${id}`, leaveData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update leave');
    }
  };
  
  export const approveLeave = async (id) => {
    try {
      const response = await hrApi.post(`/leaves/${id}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to approve leave');
    }
  };
  
  export const rejectLeave = async (id) => {
    try {
      const response = await hrApi.post(`/leaves/${id}/reject`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to reject leave');
    }
  };
  
  export const deleteLeave = async (id) => {
    try {
      const response = await hrApi.delete(`/leaves/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete leave');
    }
  };
  