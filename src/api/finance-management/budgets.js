// src\api\finance-management\budgets.js
import axios from 'axios';

const API_URL = 'http://140.245.213.62:8002';

// Create axios instance with authorization header
const financeApi = axios.create({
  baseURL: API_URL
});

// Request interceptor to add the auth token
financeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Budget API calls
export const getBudgets = async (filters = {}) => {
  try {
    const response = await financeApi.get('/budgets/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budgets');
  }
};

export const getBudgetById = async (id) => {
  try {
    const response = await financeApi.get(`/budgets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budget');
  }
};

export const createBudget = async (budgetData) => {
  try {
    const response = await financeApi.post('/budgets/', budgetData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create budget');
  }
};

export const updateBudget = async (id, budgetData) => {
  try {
    const response = await financeApi.put(`/budgets/${id}`, budgetData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update budget');
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await financeApi.delete(`/budgets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete budget');
  }
};

export const getBudgetsByProject = async (projectId) => {
  try {
    const response = await financeApi.get(`/budgets/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budgets for project');
  }
};

export const getBudgetsByDepartment = async (departmentId) => {
  try {
    const response = await financeApi.get(`/budgets/department/${departmentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch budgets for department');
  }
};

