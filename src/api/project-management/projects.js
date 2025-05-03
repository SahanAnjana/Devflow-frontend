// src/api/project-management/projects.js
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

// Project API calls
export const getProjects = async () => {
  try {
    const response = await pmApi.get('/projects');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await pmApi.post('/projects', projectData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const response = await pmApi.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await pmApi.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getProjectSettings = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/settings`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateProjectSettings = async (projectId, settingsData) => {
  try {
    const response = await pmApi.put(`/projects/${projectId}/settings`, settingsData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Project members API calls
export const getProjectMembers = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/members`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addProjectMember = async (projectId, memberData) => {
  try {
    const response = await pmApi.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateMemberRole = async (projectId, userId, roleData) => {
  try {
    const response = await pmApi.put(`/projects/${projectId}/members/${userId}/role`, roleData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const removeProjectMember = async (projectId, userId) => {
  try {
    const response = await pmApi.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
