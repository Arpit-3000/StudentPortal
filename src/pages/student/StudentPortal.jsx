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
import PremiumSidebar from '../../components/PremiumSidebar';
import PremiumHeader from '../../components/PremiumHeader';
import PremiumDashboard from '../../components/PremiumDashboard';
import UnderDevelopment from '../../components/UnderDevelopment';

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
      default:
        const pageName = selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1).replace(/([A-Z])/g, ' $1');
        return <UnderDevelopment pageName={pageName} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
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
          backgroundColor: '#f8fafc',
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
            mt: '80px', 
            minHeight: 'calc(100vh - 80px)', 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f5f9',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#94a3b8',
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
