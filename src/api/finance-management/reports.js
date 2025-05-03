// src\api\finance-management\reports.js
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


// Reports API calls
export const getFinancialSummary = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/summary', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch financial summary');
  }
};

export const getProfitLossReport = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/profit-loss', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch profit and loss report');
  }
};

export const getRevenueReport = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/revenue', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch revenue report');
  }
};

export const getProjectFinanceReport = async (projectId, fromDate, toDate) => {
  try {
    const response = await financeApi.get(`/reports/project/${projectId}`, {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch project finance report');
  }
};

export const getExpensesReport = async (fromDate, toDate) => {
  try {
    const response = await financeApi.get('/reports/expenses', {
      params: { from_date: fromDate, to_date: toDate }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch expenses report');
  }
};