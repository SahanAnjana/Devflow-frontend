// api/auth-management/admin.js
import axios from 'axios';

const API_URL = 'http://140.245.213.62:8000/auth';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await apiClient.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};

export const createRole = async (roleData) => {
  const response = await apiClient.post('/roles', roleData);
  return response.data;
};