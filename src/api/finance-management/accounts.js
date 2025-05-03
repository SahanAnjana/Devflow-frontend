// src\api\finance-management\accounts.js
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

// Account API calls
export const getAccounts = async () => {
  try {
    const response = await financeApi.get('/accounts/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch accounts');
  }
};

export const getAccountById = async (id) => {
  try {
    const response = await financeApi.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch account');
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await financeApi.post('/accounts', accountData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create account');
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await financeApi.put(`/accounts/${id}`, accountData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update account');
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await financeApi.delete(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete account');
  }
};

export const activateAccount = async (id) => {
  try {
    const response = await financeApi.put(`/accounts/${id}/activate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to activate account');
  }
};

export const deactivateAccount = async (id) => {
  try {
    const response = await financeApi.put(`/accounts/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to deactivate account');
  }
};