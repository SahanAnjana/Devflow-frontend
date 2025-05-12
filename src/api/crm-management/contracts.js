import axios from 'axios';

const API_URL = 'http://140.245.213.62:8004';
// const API_URL = 'http://127.0.0.1:8000';

// Create axios instance with authorization header
const crmApi = axios.create({
  baseURL: API_URL
});

// Request interceptor to add the auth token
crmApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getContracts = async (params = {}) => {
  try {
    const response = await crmApi.get('/contracts/', {
      params: {
        skip: params.skip || 0,
        limit: params.limit || 20,
        search: params.search,
        status: params.status,
        type: params.type,
        companyId: params.companyId,
        startDate: params.startDate,
        endDate: params.endDate
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContract = async (contractId) => {
  try {
    const response = await crmApi.get(`/contracts/${contractId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createContract = async (contractData) => {
  try {
    const response = await crmApi.post('/contracts', contractData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContract = async (contractId, contractData) => {
  try {
    const response = await crmApi.put(`/contracts/${contractId}`, contractData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContract = async (contractId) => {
  try {
    await crmApi.delete(`/contracts/${contractId}`);
  } catch (error) {
    throw error;
  }
};

export const searchContracts = async (params = {}) => {
  try {
    const response = await crmApi.get('/contracts/', {
      params: {
        search: params.search,
        skip: params.skip || 0,
        limit: params.limit || 20
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractStatuses = async () => {
  try {
    const response = await crmApi.get('/contracts/statuses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractTypes = async () => {
  try {
    const response = await crmApi.get('/contracts/types');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContractTemplates = async () => {
  try {
    const response = await crmApi.get('/contracts/templates');
    return response.data;
  } catch (error) {
    throw error;
  }
};