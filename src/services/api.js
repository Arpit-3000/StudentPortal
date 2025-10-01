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
  sendOTP: (requestData) => api.post('/api/auth/send-otp', requestData),
  verifyOTP: (email, otp, role = null) => {
    const requestData = { email, otp };
    if (role) requestData.role = role;
    return api.post('/api/auth/verify-otp', requestData);
  },
};

export const studentAPI = {
  getProfile: () => api.get('/api/student/profile'),
  // Leave Form APIs
  submitLeaveForm: (data) => api.post('/api/leave-form/submit', data),
  getMyLeaveForms: (params) => api.get('/api/leave-form/my-forms', { params }),
  getLeaveForm: (id) => api.get(`/api/leave-form/${id}`),
  deleteLeaveForm: (id) => api.delete(`/api/leave-form/${id}`),
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

export const nonTeachingAPI = {
  getProfile: () => api.get('/api/non-teaching/profile'),
  getDashboard: () => api.get('/api/non-teaching/dashboard'),
  // Leave Form APIs
  getPendingForms: (params) => api.get('/api/non-teaching/pending-forms', { params }),
  getAllForms: (params) => api.get('/api/non-teaching/all-forms', { params }),
  getFormDetails: (id) => api.get(`/api/non-teaching/forms/${id}`),
  verifyForm: (id, data) => api.put(`/api/non-teaching/forms/${id}/verify`, data),
  rejectForm: (id, data) => api.put(`/api/non-teaching/forms/${id}/reject-attendant`, data),
};

export default api;
