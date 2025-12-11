import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import LeaveManagement from './LeaveManagement';
import GateManagement from './GateManagement';
import MailAndNotices from './MailAndNotices';
import GoogleDrive from './GoogleDrive';
import GoogleClassroom from './GoogleClassroom';
import GoogleCalendar from './GoogleCalendar';
import PremiumSidebar from '../../components/PremiumSidebar';
import PremiumHeader from '../../components/PremiumHeader';
import PremiumDashboard from '../../components/PremiumDashboard';
import UnderDevelopment from '../../components/UnderDevelopment';
import ErrorBoundary from '../../components/ErrorBoundary';

const StudentPortal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const renderMainContent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return <PremiumDashboard user={user} onNavigate={handleOptionSelect} />;
      case 'applyleave':
        return <LeaveManagement />;
      case 'gatepass':
        return <GateManagement />;
      case 'mailnotices':
        return <MailAndNotices />;
      case 'googledrive':
        return <GoogleDrive />;
      case 'classroom':
        return (
          <ErrorBoundary>
            <GoogleClassroom />
          </ErrorBoundary>
        );
      case 'calendar':
        return (
          <ErrorBoundary>
            <GoogleCalendar />
          </ErrorBoundary>
        );
      default:
        const pageName = selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1).replace(/([A-Z])/g, ' $1');
        return <UnderDevelopment pageName={pageName} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <PremiumSidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
        user={user}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: 'calc(100% - 240px)' },
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
          marginLeft: { md: '240px' },
        }}
      >
        {/* Header */}
        <PremiumHeader
          onMenuClick={handleDrawerToggle}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          selectedOption={selectedOption}
          user={user}
          isMobile={isMobile}
        />

        {/* Content */}
        <Box 
          sx={{ 
            mt: '64px', 
            minHeight: 'calc(100vh - 64px)', 
            overflow: 'auto',
            backgroundColor: '#f9fafb',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f3f4f6',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#d1d5db',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#9ca3af',
            },
          }}
        >
        <AnimatePresence mode="wait">
          <motion.div
            key={showProfile ? 'profile' : selectedOption}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {showProfile ? (
              <StudentProfile onBack={handleBackFromProfile} />
            ) : (
              renderMainContent()
            )}
          </motion.div>
        </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentPortal;
