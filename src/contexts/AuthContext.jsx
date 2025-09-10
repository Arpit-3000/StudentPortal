import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, studentAPI, teacherAPI, adminAPI, accountAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, otp, userRole) => {
    try {
      const response = await authAPI.verifyOTP(email, otp);
      
      // Debug logging to understand the response structure
      console.log('API Response:', response);
      console.log('Response Data:', response?.data);
      
      // Handle the actual API response structure with proper error checking
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      const { data } = response.data;
      if (!data) {
        throw new Error('No data received from server');
      }
      
      console.log('Extracted Data:', data);
      
      // Handle different possible response structures
      let token, userData;
      
      // Try different possible response structures
      if (data.token && data.user) {
        token = data.token;
        userData = data.user;
      } else if (data.token && data.student) {
        token = data.token;
        userData = data.student;
      } else if (data.token && data.teacher) {
        token = data.token;
        userData = data.teacher;
      } else if (data.token && data.admin) {
        token = data.token;
        userData = data.admin;
      } else if (data.token && data.accountant) {
        token = data.token;
        userData = data.accountant;
      } else if (data.token) {
        token = data.token;
        userData = data; // Use the entire data object as user data
      } else {
        // Fallback: try to extract from the response structure
        token = data.token || data.accessToken || data.authToken;
        userData = data.user || data.student || data.teacher || data.admin || data.accountant || data;
      }
      
      // Check if token exists
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      // Check if userData exists, if not create a basic user object
      const safeUserData = userData || {};
      
      console.log('Token:', token);
      console.log('UserData:', userData);
      console.log('SafeUserData:', safeUserData);
      console.log('Selected UserRole:', userRole);
      
      // Determine the actual role from backend response
      let actualRole = userRole; // Default to selected role
      
      // If backend provides a role, use that instead
      if (safeUserData.role) {
        // Map backend role names to frontend role names
        const roleMapping = {
          'Super Admin': 'super_admin',
          'Moderator': 'moderator',
          'Staff': 'staff',
          'Teacher': 'teacher',
          'Student': 'student',
          'Accountant': 'accountant'
        };
        
        // Get the mapped role or use the original role
        actualRole = roleMapping[safeUserData.role] || safeUserData.role.toLowerCase();
        
        console.log('Backend role:', safeUserData.role);
        console.log('Mapped role:', actualRole);
        console.log('Selected role:', userRole);
        
        // Check if the selected role matches the backend role (for admin sub-roles, be more flexible)
        const isAdminRole = ['super_admin', 'moderator', 'staff'].includes(userRole);
        const isBackendAdminRole = ['super_admin', 'moderator', 'staff'].includes(actualRole);
        
        if (isAdminRole && isBackendAdminRole) {
          // Both are admin roles, use the backend role
          actualRole = actualRole;
          console.log('Admin role detected, using backend role:', actualRole);
        } else if (actualRole !== userRole) {
          // Different role types, show error
          return { 
            success: false, 
            error: `Access denied. Your account is registered as ${safeUserData.role}, not ${userRole}. Please select the correct role.` 
          };
        }
      }
      
      // Create user object with the determined role
      const userWithRole = {
        ...safeUserData,
        role: actualRole, // Use the determined role
        email: email, // Ensure email is stored for role verification
        name: safeUserData.name || safeUserData.fullName || 'User', // Fallback for name
        id: safeUserData.id || safeUserData._id || Date.now().toString(), // Fallback for ID
        originalRole: safeUserData.role // Store original backend role for reference
      };
      
      // Store token and user data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userWithRole));
      
      // Update state
      setUser(userWithRole);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Login error:', error);
      
      // If it's a network error or API is not available, provide a helpful message
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        return {
          success: false,
          error: 'Unable to connect to server. Please check your internet connection and try again.'
        };
      }
      
      // If it's a 404 or API endpoint not found
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Authentication service is not available. Please contact support.'
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const sendOTP = async (email) => {
    try {
      console.log('Sending OTP to:', email);
      const response = await authAPI.sendOTP(email);
      console.log('OTP sent successfully:', response);
      return { success: true };
    } catch (error) {
      console.error('Send OTP error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      let errorMessage = 'Failed to send OTP';
      if (error.response?.status === 404) {
        errorMessage = 'Authentication service not found. Please contact support.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email address.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Role-based API helper functions
  const getRoleBasedAPI = () => {
    if (!user || !user.role) return null;
    
    // Check if it's an admin sub-role
    const isAdminRole = ['super_admin', 'moderator', 'staff'].includes(user.role);
    
    switch (user.role) {
      case 'student':
        return studentAPI;
      case 'teacher':
        return teacherAPI;
      case 'admin':
      case 'super_admin':
      case 'moderator':
      case 'staff':
        return adminAPI;
      case 'accountant':
        return accountAPI;
      default:
        return null;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const roleAPI = getRoleBasedAPI();
      if (!roleAPI || !roleAPI.getProfile) {
        throw new Error('No profile API available for this role');
      }
      const response = await roleAPI.getProfile();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Fetch profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch profile' 
      };
    }
  };

  const fetchDashboardData = async () => {
    try {
      const roleAPI = getRoleBasedAPI();
      if (!roleAPI) {
        throw new Error('No API available for this role');
      }

      let response;
      
      // Handle admin sub-roles with specific dashboard APIs
      if (user?.role === 'super_admin' && roleAPI.getSuperAdminDashboard) {
        response = await roleAPI.getSuperAdminDashboard();
      } else if (user?.role === 'moderator' && roleAPI.getModeratorDashboard) {
        response = await roleAPI.getModeratorDashboard();
      } else if (user?.role === 'staff' && roleAPI.getStaffDashboard) {
        response = await roleAPI.getStaffDashboard();
      } else if (roleAPI.getDashboard) {
        response = await roleAPI.getDashboard();
      } else {
        throw new Error('No dashboard API available for this role');
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch dashboard data' 
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    sendOTP,
    getRoleBasedAPI,
    fetchUserProfile,
    fetchDashboardData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
