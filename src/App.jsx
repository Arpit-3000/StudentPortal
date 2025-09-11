import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import StudentPortal from './pages/student/StudentPortal';
import TeacherPortal from './pages/teacher/TeacherPortal';
import AdminPortal from './pages/admin/AdminPortal';
import AccountsPortal from './pages/accounts/AccountsPortal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <LoadingSpinner message="Authenticating..." />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  // Public Route Component (redirect to dashboard if already logged in)
  const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <LoadingSpinner message="Loading..." />;
    }

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  // Role-based Dashboard Component
  const RoleBasedDashboard = () => {
    const { user, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
      return <LoadingSpinner message="Loading dashboard..." />;
    }

    // Redirect to login if no user or role
    if (!user || !user.role) {
      console.warn('No user or role found, redirecting to login');
      return <Navigate to="/login" />;
    }

    // Log the user role for debugging
    console.log('User role:', user.role, 'User data:', user);
    console.log('Email:', user.email, 'Original role:', user.originalRole);

    // Route based on user role
    switch (user.role) {
      case 'student':
        console.log('Routing to Student Portal');
        return <StudentPortal />;
      case 'teacher':
        console.log('Routing to Teacher Portal');
        return <TeacherPortal />;
      case 'admin':
      case 'super_admin':
      case 'moderator':
      case 'staff':
        console.log('Routing to Admin Portal for role:', user.role);
        return <AdminPortal />;
      case 'accountant':
        console.log('Routing to Accounts Portal');
        return <AccountsPortal />;
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
