import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, studentAPI } from '../services/api';

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

  const login = async (email, otp) => {
    try {
      const response = await authAPI.verifyOTP(email, otp);
      
      // Handle the actual API response structure
      const { data } = response.data;
      const { token, student } = data;
      
      // Store token and user data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(student));
      
      // Update state
      setUser(student);
      setIsAuthenticated(true);
      
      return { success: true, user: student };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
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
      await authAPI.sendOTP(email);
      return { success: true };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send OTP' 
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
