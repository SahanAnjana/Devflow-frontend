// src/api/pm.js
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

// Document Management
export const getDocuments = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/documents`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getDocumentById = async (projectId, docId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/documents/${docId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const uploadDocument = async (projectId, documentData) => {
  try {
    const response = await pmApi.post(`/projects/${projectId}/documents`, documentData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteDocument = async (projectId, docId) => {
  try {
    const response = await pmApi.delete(`/projects/${projectId}/documents/${docId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Comments & Discussions
export const getComments = async (projectId, taskId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/tasks/${taskId}/comments`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addComment = async (projectId, taskId, commentData) => {
  try {
    const response = await pmApi.post(`/projects/${projectId}/tasks/${taskId}/comments`, commentData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateComment = async (projectId, taskId, commentId, commentData) => {
  try {
    const response = await pmApi.put(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteComment = async (projectId, taskId, commentId) => {
  try {
    const response = await pmApi.delete(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Webhooks & Events
export const registerWebhook = async (projectId, webhookData) => {
  try {
    const response = await pmApi.post(`/projects/${projectId}/webhooks`, webhookData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getActivityStream = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/activity`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getProjectEvents = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/events`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Project metrics
export const getTeamVelocity = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/metrics/velocity`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getBurndownData = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/metrics/burndown`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCompletionPercentage = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/metrics/completion`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getResourcesUtilizationMetrics = async (projectId) => {
  try {
    const response = await pmApi.get(`/projects/${projectId}/metrics/resource-utilization`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};