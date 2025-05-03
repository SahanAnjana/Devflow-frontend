// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  refreshToken as refreshTokenApi,
  getCurrentUser,
  logoutUser,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  validateResetToken as validateResetTokenApi
} from '../api/auth-management/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshTokenValue, setRefreshTokenValue] = useState(localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // If token is invalid, clear everything
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setToken(null);
            setRefreshTokenValue(null);
            setUser(null);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Setup refresh token interval
  useEffect(() => {
    let intervalId;
    
    if (token && refreshTokenValue) {
      // Refresh token every 55 minutes (assuming token expires in 60 minutes)
      intervalId = setInterval(() => {
        handleRefreshToken();
      }, 55 * 60 * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, refreshTokenValue]);

  const handleRefreshToken = async () => {
    try {
      const result = await refreshTokenApi(refreshTokenValue);
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('refreshToken', result.refresh_token);
      setToken(result.access_token);
      setRefreshTokenValue(result.refresh_token);
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log out
      handleLogout();
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const result = await loginUser(email, password);
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('refreshToken', result.refresh_token);
      setToken(result.access_token);
      setRefreshTokenValue(result.refresh_token);
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (email, password) => {
    setError(null);
    try {
      const result = await registerUser(email, password);
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.detail || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      if (refreshTokenValue) {
        await logoutUser(refreshTokenValue);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setRefreshTokenValue(null);
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      const result = await forgotPasswordApi(email);
      return result;
    } catch (error) {
      console.error('Forgot password request failed:', error);
      setError(error.response?.data?.detail || 'Failed to send reset instructions. Please try again.');
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    setError(null);
    try {
      const result = await resetPasswordApi(token, newPassword);
      return result;
    } catch (error) {
      console.error('Password reset failed:', error);
      setError(error.response?.data?.detail || 'Failed to reset password. Please try again.');
      throw error;
    }
  };

  const validateResetToken = async (token) => {
    setError(null);
    try {
      const result = await validateResetTokenApi(token);
      return result;
    } catch (error) {
      console.error('Token validation failed:', error);
      setError(error.response?.data?.detail || 'Invalid or expired reset token.');
      throw error;
    }
  };

  const value = {
    token,
    refreshToken: refreshTokenValue,
    user,
    loading,
    error,
    login,
    register,
    logout: handleLogout,
    refreshTokenFn: handleRefreshToken,
    forgotPassword,
    resetPassword,
    validateResetToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);