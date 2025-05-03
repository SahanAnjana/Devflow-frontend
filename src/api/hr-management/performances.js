// src/api/hr-management/performances.js
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

// Performance API calls
export const getPerformanceReviews = async () => {
  try {
    const response = await hrApi.get('/performances/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch performance reviews');
  }
};

export const getOwnPerformanceReviews = async () => {
  try {
    const response = await hrApi.get('/performances/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch your performance reviews');
  }
};

export const getReviewsAsReviewer = async () => {
  try {
    const response = await hrApi.get('/performances/as-reviewer');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch reviews you conducted');
  }
};

export const getEmployeePerformanceReviews = async (employeeId) => {
  try {
    const response = await hrApi.get(`/performances/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch employee performance reviews');
  }
};

export const createPerformanceReview = async (reviewData) => {
  try {
    const response = await hrApi.post('/performances/', reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create performance review');
  }
};

export const updatePerformanceReview = async (id, reviewData) => {
  try {
    const response = await hrApi.put(`/performances/${id}`, reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update performance review');
  }
};

export const deletePerformanceReview = async (id) => {
  try {
    const response = await hrApi.delete(`/performances/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete performance review');
  }
};