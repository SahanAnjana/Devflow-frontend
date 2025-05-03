// src\api\finance-management\transactions.js
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

// Transaction API calls
export const getTransactions = async (filters = {}) => {
  try {
    const response = await financeApi.get('/transactions/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch transactions');
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await financeApi.get(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch transaction');
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await financeApi.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create transaction');
  }
};

export const getAccountTransactions = async (accountId) => {
  try {
    const response = await financeApi.get(`/transactions/account/${accountId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch account transactions');
  }
};