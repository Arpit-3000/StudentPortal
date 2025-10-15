import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import StudentPortal from './pages/student/StudentPortal';
import TeacherPortal from './pages/teacher/TeacherPortal';
import AdminPortal from './pages/admin/AdminPortal';
import AccountsPortal from './pages/accounts/AccountsPortal';
import AttendantPortal from './pages/attendant/AttendantPortal';
import GuardPortal from './pages/guard/GuardPortal';
import PremiumLoadingSpinner from './components/PremiumLoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme';

function App() {
  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <PremiumLoadingSpinner message="Authenticating..." />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  // Public Route Component (redirect to dashboard if already logged in)
  const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <PremiumLoadingSpinner message="Loading..." />;
    }

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  // Role-based Dashboard Component
  const RoleBasedDashboard = () => {
    const { user, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
      return <PremiumLoadingSpinner message="Loading dashboard..." />;
    }

    // Redirect to login if no user or role
    if (!user || !user.role) {
      console.warn('No user or role found, redirecting to login');
      return <Navigate to="/login" />;
    }


    // Route based on user role
    switch (user.role) {
      case 'student':
        return <StudentPortal />;
      case 'teacher':
        return <TeacherPortal />;
      case 'admin':
      case 'super_admin':
      case 'moderator':
      case 'staff':
        return <AdminPortal />;
      case 'accountant':
        return <AccountsPortal />;
      case 'attendant':
        return <AttendantPortal />;
      case 'security_guard':
        return <GuardPortal />;
      case 'hostel_warden':
      case 'security_head':
      case 'caretaker':
      case 'administrative_staff':
      case 'clerk':
      case 'receptionist':
      case 'maintenance_staff':
      case 'cleaner':
      case 'other':
      case 'non_teaching':
        return <AdminPortal />;
      default:
        console.error('Unknown user role:', user.role);
        return <Navigate to="/login" />;
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <RoleBasedDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
