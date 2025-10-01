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
      const response = await authAPI.verifyOTP(email, otp, userRole);
      
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
      
      // Handle different possible response structures based on role
      let token, userData;
      
      console.log('Parsing response for role:', userRole);
      
      // Try different possible response structures
      if (data.token && data.user) {
        token = data.token;
        userData = data.user;
        console.log('Found user data in data.user');
      } else if (data.token && data.student) {
        token = data.token;
        userData = data.student;
        console.log('Found student data in data.student');
      } else if (data.token && data.teacher) {
        token = data.token;
        userData = data.teacher;
        console.log('Found teacher data in data.teacher');
      } else if (data.token && data.admin) {
        token = data.token;
        userData = data.admin;
        console.log('Found admin data in data.admin');
      } else if (data.token && data.accountant) {
        token = data.token;
        userData = data.accountant;
        console.log('Found accountant data in data.accountant');
      } else if (data.token) {
        token = data.token;
        userData = data; // Use the entire data object as user data
        console.log('Using entire data object as user data');
      } else {
        // Fallback: try to extract from the response structure
        token = data.token || data.accessToken || data.authToken;
        userData = data.user || data.student || data.teacher || data.admin || data.accountant || data;
        console.log('Using fallback extraction method');
      }
      
      // Additional role-specific parsing
      if (userRole === 'student' && data.student) {
        userData = data.student;
        console.log('Overriding with student-specific data');
      } else if (userRole === 'teacher' && data.teacher) {
        userData = data.teacher;
        console.log('Overriding with teacher-specific data');
      } else if (['super_admin', 'moderator', 'staff'].includes(userRole) && data.admin) {
        userData = data.admin;
        console.log('Overriding with admin-specific data');
      } else if (userRole === 'accountant' && data.accountant) {
        userData = data.accountant;
        console.log('Overriding with accountant-specific data');
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
          'Accountant': 'accountant',
          'NonTeachingStaff': 'non_teaching',
          'Hostel Warden': 'hostel_warden',
          'Security Head': 'security_head',
          'Security Guard': 'security_guard',
          'Attendant': 'attendant',
          'Caretaker': 'caretaker',
          'Administrative Staff': 'administrative_staff',
          'Clerk': 'clerk',
          'Receptionist': 'receptionist',
          'Maintenance Staff': 'maintenance_staff',
          'Cleaner': 'cleaner',
          'Other': 'other'
        };
        
        // Get the mapped role or use the original role
        actualRole = roleMapping[safeUserData.role] || safeUserData.role.toLowerCase();
        
        console.log('Backend role:', safeUserData.role);
        console.log('Mapped role:', actualRole);
        console.log('Selected role:', userRole);
        
        // Check if the selected role matches the backend role
        // For non-teaching staff, we need to check if the user selected nonteaching and backend returned a non-teaching role
        if (userRole === 'nonteaching') {
          // For non-teaching staff, any non-teaching role from backend is valid
          const nonTeachingRoles = ['hostel_warden', 'security_head', 'security_guard', 'attendant', 'caretaker', 'administrative_staff', 'clerk', 'receptionist', 'maintenance_staff', 'cleaner', 'other'];
          if (!nonTeachingRoles.includes(actualRole)) {
            return { 
              success: false, 
              error: `Access denied. Your account is registered as ${safeUserData.role}, which is not a non-teaching staff role.` 
            };
          }
        } else if (actualRole !== userRole) {
          // For other roles, we need exact match
          return { 
            success: false, 
            error: `Access denied. Your account is registered as ${safeUserData.role}, not ${userRole}. Please select the correct role.` 
          };
        }
      }
      
      // For non-teaching staff, use the role from the database
      let finalRole = actualRole;
      if (userRole === 'nonteaching' && safeUserData.role) {
        // Use the role from the database (already mapped above)
        finalRole = actualRole;
        console.log('Non-teaching staff role from database:', safeUserData.role, 'Mapped to:', finalRole);
      }

      // Create user object with the determined role
      const userWithRole = {
        ...safeUserData,
        role: finalRole, // Use the final determined role
        email: email, // Ensure email is stored for role verification
        name: safeUserData.name || safeUserData.fullName || 'User', // Fallback for name
        id: safeUserData.id || safeUserData._id || Date.now().toString(), // Fallback for ID
        originalRole: safeUserData.role, // Store original backend role for reference
        staffId: safeUserData.staffId // Store staff ID for reference
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

  const sendOTP = async (email, role = null, teacherId = null, staffId = null, nonTeachingRole = null) => {
    try {
      console.log('Sending OTP to:', email, 'Role:', role, 'Teacher ID:', teacherId, 'Staff ID:', staffId, 'Non-teaching Role:', nonTeachingRole);
      
      // Prepare request data based on role
      let requestData = { email };
      if (role === 'teacher' && teacherId) {
        requestData.teacherId = teacherId;
      }
      if (role === 'nonteaching' && staffId && nonTeachingRole) {
        requestData.teacherId = staffId; // Backend expects teacherId field for non-teaching staff
        requestData.role = 'non_teaching'; // Use non_teaching as the main role
      }
      if (role && role !== 'nonteaching') {
        requestData.role = role;
      }
      
      const response = await authAPI.sendOTP(requestData);
      console.log('OTP sent successfully:', response);
      
      // Handle different response structures
      if (response.data) {
        // Check if response contains role-specific data
        if (response.data.student || response.data.teacher || response.data.admin || response.data.accountant) {
          console.log('Role-specific response received:', response.data);
        }
      }
      
      return { success: true, data: response.data };
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
        errorMessage = 'Invalid email address or Teacher ID.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request. Please check your details.';
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
