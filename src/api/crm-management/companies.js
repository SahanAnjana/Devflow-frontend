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

export const getCompanies = async (params = {}) => {
  try {
    const response = await crmApi.get('/companies/', {
      params: {
        skip: params.skip || 0,
        limit: params.limit || 20,
        search: params.search,
        industry: params.industry
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompany = async (companyId) => {
  try {
    const response = await crmApi.get(`/companies/${companyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCompany = async (companyData) => {
  try {
    const response = await crmApi.post('/companies', companyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompany = async (companyId, companyData) => {
  try {
    const response = await crmApi.put(`/companies/${companyId}`, companyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCompany = async (companyId) => {
  try {
    await crmApi.delete(`/companies/${companyId}`);
    return true;
  } catch (error) {
    throw error;
  }
};

export const searchCompanies = async (params = {}) => {
  try {
    const response = await crmApi.get('/companies/', {
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