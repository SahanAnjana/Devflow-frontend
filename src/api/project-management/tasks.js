// src/api/project-management/tasks.js
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
  
// Task API calls
export const getTasks = async (projectId) => {
    try {
      const response = await pmApi.get(`/tasks/projects/${projectId}/tasks`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getTaskById = async (projectId, taskId) => {
    try {
      const response = await pmApi.get(`/tasks/projects/${projectId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createTask = async (projectId, taskData) => {
    try {
      const response = await pmApi.post(`/tasks/projects/${projectId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateTask = async (projectId, taskId, taskData) => {
    try {
      const response = await pmApi.put(`/tasks/projects/${projectId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const deleteTask = async (projectId, taskId) => {
    try {
      const response = await pmApi.delete(`/tasks/projects/${projectId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateTaskStatus = async (projectId, taskId, statusData) => {
    try {
      const response = await pmApi.put(`/tasks/projects/${projectId}/tasks/${taskId}/status`, statusData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateTaskAssignee = async (projectId, taskId, assigneeData) => {
    try {
      const response = await pmApi.put(`/tasks/projects/${projectId}/tasks/${taskId}/assignee`, assigneeData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // Board API calls
  export const getProjectBoard = async (projectId) => {
    try {
      const response = await pmApi.get(`/tasks/projects/${projectId}/board`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createBoardColumn = async (projectId, columnData) => {
    try {
      const response = await pmApi.post(`/tasks/projects/${projectId}/board/columns`, columnData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateBoardColumn = async (projectId, columnId, columnData) => {
    try {
      const response = await pmApi.put(`/tasks/projects/${projectId}/board/columns/${columnId}`, columnData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateTaskPosition = async (projectId, taskId, positionData) => {
    try {
      const response = await pmApi.put(`/tasks/projects/${projectId}/tasks/${taskId}/position`, positionData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // Gantt chart and critical path API calls
  export const getGanttChartData = async (projectId) => {
    try {
      const response = await pmApi.get(`/tasks/projects/${projectId}/gantt`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateTaskSchedule = async (projectId, taskId, scheduleData) => {
    try {
      const response = await pmApi.put(`/tasks/projects/${projectId}/tasks/${taskId}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getCriticalPath = async (projectId) => {
    try {
      const response = await pmApi.get(`/tasks/projects/${projectId}/critical-path`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  