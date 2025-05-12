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

export const getDeals = async (params = {}) => {
  try {
    const response = await crmApi.get('/deals/', {
      params: {
        skip: params.skip || 0,
        limit: params.limit || 20,
        search: params.search,
        status: params.status,
        companyId: params.companyId,
        stageId: params.stageId,
        startDate: params.startDate,
        endDate: params.endDate
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeal = async (dealId) => {
  try {
    const response = await crmApi.get(`/deals/${dealId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDeal = async (dealData) => {
  try {
    const response = await crmApi.post('/deals', dealData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDeal = async (dealId, dealData) => {
  try {
    const response = await crmApi.put(`/deals/${dealId}`, dealData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDeal = async (dealId) => {
  try {
    await crmApi.delete(`/deals/${dealId}`);
  } catch (error) {
    throw error;
  }
};

export const searchDeals = async (params = {}) => {
  try {
    const response = await crmApi.get('/deals/', {
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

export const getDealStages = async () => {
  try {
    const response = await crmApi.get('/deals/stages');
    return response.data;
  } catch (error) {
    throw error;
  }
};