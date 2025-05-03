// api/auth-management/auth.js
import axios from 'axios';

const API_URL = 'http://140.245.213.62:8000/auth';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests when available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post('/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

export const registerUser = async (email, password) => {
  const response = await apiClient.post('/register', { email, password });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post('/refresh-token', { refresh_token: refreshToken });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await apiClient.post('/logout', { refresh_token: refreshToken });
  return response.data;
};

// Password Reset Functions
export const forgotPassword = async (email) => {
  const response = await apiClient.post('/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await apiClient.post('/reset-password', { 
    token, 
    new_password: newPassword 
  });
  return response.data;
};

export const validateResetToken = async (token) => {
  const response = await apiClient.get(`/validate-reset-token/${token}`);
  return response.data;
};