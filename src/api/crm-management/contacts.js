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

export const getContacts = async (params = {}) => {
  try {
    const response = await crmApi.get('/contacts', {
      params: {
        skip: params.skip || 0,
        limit: params.limit || 20,
        search: params.search,
        companyId: params.companyId,
        tags: params.tags
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContact = async (contactId) => {
  try {
    const response = await crmApi.get(`/contacts/${contactId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createContact = async (contactData) => {
  try {
    const response = await crmApi.post('/contacts', contactData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContact = async (contactId, contactData) => {
  try {
    const response = await crmApi.put(`/contacts/${contactId}`, contactData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContact = async (contactId) => {
  try {
    await crmApi.delete(`/contacts/${contactId}`);
  } catch (error) {
    throw error;
  }
};

export const searchContacts = async (params = {}) => {
  try {
    const response = await crmApi.get('/contacts', {
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

export const getContactSources = async () => {
  try {
    const response = await crmApi.get('/contacts/sources');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContactStatuses = async () => {
  try {
    const response = await crmApi.get('/contacts/statuses');
    return response.data;
  } catch (error) {
    throw error;
  }
};