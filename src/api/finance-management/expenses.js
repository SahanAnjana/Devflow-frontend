// src\api\finance-management\expenses.js
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

// Expense API calls
export const getExpenses = async (filters = {}) => {
  try {
    const response = await financeApi.get('/expenses/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch expenses');
  }
};

export const getExpenseById = async (id) => {
  try {
    const response = await financeApi.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch expense');
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await financeApi.post('/expenses/', expenseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create expense');
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await financeApi.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update expense');
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await financeApi.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete expense');
  }
};

export const approveExpense = async (id, approverId) => {
  try {
    const response = await financeApi.post(`/expenses/${id}/approve`, null, {
      params: { approver_id: approverId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to approve expense');
  }
};

export const rejectExpense = async (id, approverId) => {
  try {
    const response = await financeApi.post(`/expenses/${id}/reject`, null, {
      params: { approver_id: approverId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to reject expense');
  }
};

export const getEmployeeExpenses = async (employeeId) => {
  try {
    const response = await financeApi.get(`/expenses/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch employee expenses');
  }
};

