// src/api/project-management/resources.js
import axios from 'axios';

// Base API configuration
const pmApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://140.245.213.62:8003',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests when available
pmApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Error handling for all API calls
const handleApiError = (error) => {
    const errorMessage = error.response?.data?.detail || 'An error occurred with the project management service';
    throw new Error(errorMessage);
};

// Resource API calls
export const getResources = async (projectId) => {
    try {
      const response = await pmApi.get(`/resources/projects/${projectId}/resources`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getResourceById = async (projectId, resourceId) => {
    try {
      const response = await pmApi.get(`/resources/projects/${projectId}/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createResource = async (projectId, resourceData) => {
    try {
      const response = await pmApi.post(`/resources/projects/${projectId}/resources`, resourceData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateResource = async (projectId, resourceId, resourceData) => {
    try {
      const response = await pmApi.put(`/resources/projects/${projectId}/resources/${resourceId}`, resourceData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const deleteResource = async (projectId, resourceId) => {
    try {
      const response = await pmApi.delete(`/resources/projects/${projectId}/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getResourceAssignments = async (projectId) => {
    try {
      const response = await pmApi.get(`/resources/projects/${projectId}/resource-assignments`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createResourceAssignment = async (projectId, assignmentData) => {
    try {
      const response = await pmApi.post(`/resources/projects/${projectId}/resource-assignments`, assignmentData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateResourceAssignment = async (projectId, assignmentId, assignmentData) => {
    try {
      const response = await pmApi.put(`/resources/projects/${projectId}/resource-assignments/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const deleteResourceAssignment = async (projectId, assignmentId) => {
    try {
      const response = await pmApi.delete(`/resources/projects/${projectId}/resource-assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getResourceUtilization = async (projectId, resourceId) => {
    try {
      const response = await pmApi.get(`/resources/projects/${projectId}/resources/${resourceId}/utilization`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  