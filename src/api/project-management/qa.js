// src/api/project-management/qa.js
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

// QA API calls
export const getIssues = async (projectId) => {
    try {
      const response = await pmApi.get(`/qa/${projectId}/issues`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getIssueById = async (projectId, issueId) => {
    try {
      const response = await pmApi.get(`/qa/${projectId}/issues/${issueId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createIssue = async (projectId, issueData) => {
    try {
      const response = await pmApi.post(`/qa/${projectId}/issues`, issueData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateIssue = async (projectId, issueId, issueData) => {
    try {
      const response = await pmApi.put(`/qa/${projectId}/issues/${issueId}`, issueData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const deleteIssue = async (projectId, issueId) => {
    try {
      const response = await pmApi.delete(`/qa/${projectId}/issues/${issueId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // Test case API calls
  export const getTestCases = async (projectId) => {
    try {
      const response = await pmApi.get(`/qa/${projectId}/test-cases`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createTestCase = async (projectId, testCaseData) => {
    try {
      const response = await pmApi.post(`/qa/${projectId}/test-cases`, testCaseData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // Test run API calls
  export const getTestRuns = async (projectId) => {
    try {
      const response = await pmApi.get(`/qa/${projectId}/test-runs`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createTestRun = async (projectId, testRunData) => {
    try {
      const response = await pmApi.post(`/qa/${projectId}/test-runs`, testRunData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getTestMetrics = async (projectId) => {
    try {
      const response = await pmApi.get(`/qa/${projectId}/test-metrics`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const createTestResult = async (projectId, testRunId, resultData) => {
    try {
      const response = await pmApi.post(`/qa/${projectId}/test-runs/${testRunId}/results`, resultData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const updateTestResult = async (projectId, testRunId, resultId, resultData) => {
    try {
      const response = await pmApi.put(`/qa/${projectId}/test-runs/${testRunId}/results/${resultId}`, resultData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  