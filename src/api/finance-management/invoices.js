// src\api\finance-management\invoices.js
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

// Invoice API calls
export const getInvoices = async (filters = {}) => {
  try {
    const response = await financeApi.get('/invoices/', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch invoices');
  }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await financeApi.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch invoice');
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await financeApi.post('/invoices/', invoiceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create invoice');
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await financeApi.put(`/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update invoice');
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await financeApi.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete invoice');
  }
};

export const sendInvoice = async (id) => {
  try {
    const response = await financeApi.post(`/invoices/${id}/send`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to send invoice');
  }
};

export const markInvoiceAsPaid = async (id) => {
  try {
    const response = await financeApi.post(`/invoices/${id}/mark-paid`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to mark invoice as paid');
  }
};

export const getClientInvoices = async (clientId) => {
  try {
    const response = await financeApi.get(`/invoices/client/${clientId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch client invoices');
  }
};
