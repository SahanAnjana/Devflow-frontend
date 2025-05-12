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

export const getCommunications = async (params = {}) => {
  try {
    const response = await crmApi.get('/communications', {
      params: {
        skip: params.skip || 0,
        limit: params.limit || 20,
        search: params.search,
        startDate: params.startDate,
        endDate: params.endDate
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommunication = async (communicationId) => {
  try {
    const response = await crmApi.get(`/communications/${communicationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCommunication = async (communicationData) => {
  try {
    const response = await crmApi.post('/communications', communicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCommunication = async (communicationId, communicationData) => {
  try {
    const response = await crmApi.put(`/communications/${communicationId}`, communicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCommunication = async (communicationId) => {
  try {
    await crmApi.delete(`/communications/${communicationId}`);
  } catch (error) {
    throw error;
  }
};

export const searchCommunications = async (searchTerm) => {
  try {
    const response = await crmApi.get(`/communications/search?term=${searchTerm}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommunicationTypes = async () => {
  try {
    const response = await crmApi.get('/communications/types');
    return response.data;
  } catch (error) {
    throw error;
  }
};