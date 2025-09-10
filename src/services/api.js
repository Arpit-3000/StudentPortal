import axios from 'axios';
import { config } from '../config/environment';

// API Base Configuration
const API_BASE_URL = config.API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 70000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  sendOTP: (email) => api.post('/api/auth/send-otp', { email }),
  verifyOTP: (email, otp) => api.post('/api/auth/verify-otp', { email, otp }),
};

export const studentAPI = {
  getProfile: () => api.get('/api/student/profile'),
};

export const teacherAPI = {
  getProfile: () => api.get('/api/teacher/profile'),
  getDashboard: () => api.get('/api/teacher/dashboard'),
};

export const adminAPI = {
  getProfile: () => api.get('/api/admin/profile'),
  getDashboard: () => api.get('/api/admin/dashboard'),
  // Super Admin specific APIs
  getSuperAdminDashboard: () => api.get('/api/admin/super-admin/dashboard'),
  // Moderator specific APIs
  getModeratorDashboard: () => api.get('/api/admin/moderator/dashboard'),
  // Staff specific APIs
  getStaffDashboard: () => api.get('/api/admin/staff/dashboard'),
};

export const accountAPI = {
  getProfile: () => api.get('/api/account/profile'),
  getAccountDetails: (accountId) => api.get(`/api/account/${accountId}`),
  getAccountBalance: (accountId) => api.get(`/api/account/balance/${accountId}`),
  getAccountsByHolder: (holderId, holderType) => api.get(`/api/account/holder/${holderId}/${holderType}`),
  getAllAccounts: () => api.get('/api/account/all'),
  getAccountStatistics: () => api.get('/api/account/statistics'),
};

export default api;
