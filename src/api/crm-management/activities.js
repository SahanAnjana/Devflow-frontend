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

export const getActivities = async (params = {}) => {
  try {
    const response = await crmApi.get('/activities/', {
      params: {
        skip: params.skip || 0,
        limit: params.limit || 20,
        search: params.search,
        type: params.type,
        startDate: params.startDate,
        endDate: params.endDate,
        contactId: params.contactId,
        dealId: params.dealId
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActivity = async (activityId) => {
  try {
    const response = await crmApi.get(`/activities/${activityId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createActivity = async (activityData) => {
  try {
    const response = await crmApi.post('/activities', activityData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateActivity = async (activityId, activityData) => {
  try {
    const response = await crmApi.put(`/activities/${activityId}`, activityData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteActivity = async (activityId) => {
  try {
    await crmApi.delete(`/activities/${activityId}`);
  } catch (error) {
    throw error;
  }
};

export const searchActivities = async (params = {}) => {
  try {
    const response = await crmApi.get('/activities/', {
      params: {
        search: params.search,
        skip: params.skip || 0,
        limit: params.limit || 20
      }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getActivityTypes = async () => {
  try {
    const response = await crmApi.get('/activities/types');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};