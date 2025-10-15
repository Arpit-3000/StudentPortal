import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  MenuBook as LibraryIcon,
  EventAvailable as AttendanceIcon,
  EventNote as LeaveIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Description as DocumentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LocalDining as CanteenIcon,
  School as AdmissionIcon,
  Notifications as NotificationIcon,
  Search as SearchIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';

const PremiumSidebar = ({ 
  open, 
  onClose, 
  selectedOption, 
  onOptionSelect, 
  user, 
  onLogout, 
  onProfileClick 
}) => {
  const drawerWidth = 240;

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      color: '#6366f1',
    },
    {
      id: 'myclassroom',
      label: 'My Classroom',
      icon: <SchoolIcon />,
      color: '#8b5cf6',
    },
    {
      id: 'library',
      label: 'Library',
      icon: <LibraryIcon />,
      color: '#06b6d4',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <AttendanceIcon />,
      color: '#10b981',
    },
    {
      id: 'applyleave',
      label: 'Apply Leave',
      icon: <LeaveIcon />,
      color: '#f59e0b',
    },
    {
      id: 'gatepass',
      label: 'Gate Pass',
      icon: <QrCodeIcon />,
      color: '#3b82f6',
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: <AssignmentIcon />,
      color: '#ef4444',
    },
    {
      id: 'results',
      label: 'Results',
      icon: <AssessmentIcon />,
      color: '#84cc16',
    },
    {
      id: 'canteen',
      label: 'Canteen',
      icon: <CanteenIcon />,
      color: '#f97316',
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <DocumentIcon />,
      color: '#6366f1',
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderRight: '1px solid #e2e8f0',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <SchoolIcon sx={{ color: 'white', fontSize: 16 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
              Altius
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
              Student Portal
            </Typography>
          </Box>
        </Box>
      </Box>


      {/* Navigation Menu */}
      <Box 
        sx={{ 
          flex: 1, 
          py: 1, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#94a3b8',
          },
        }}
      >
        <List sx={{ px: 1.5 }}>
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItem disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  selected={selectedOption === item.id}
                  onClick={() => onOptionSelect(item.id)}
                  sx={{
                    borderRadius: 1.5,
                    py: 1,
                    px: 1.5,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      '&:hover': {
                        backgroundColor: `${item.color}20`,
                      },
                      '& .MuiListItemIcon-root': {
                        color: item.color,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 16,
                        backgroundColor: item.color,
                        borderRadius: '0 2px 2px 0',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: selectedOption === item.id ? item.color : '#64748b',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: selectedOption === item.id ? 600 : 500,
                      color: selectedOption === item.id ? item.color : '#475569',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>

      {/* Footer Actions */}
      <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0' }}>
        <Box
          onClick={onLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            borderRadius: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#fef2f2',
            },
          }}
        >
          <LogoutIcon sx={{ color: '#dc2626', fontSize: 16, mr: 1 }} />
          <Typography
            variant="body2"
            sx={{
              color: '#dc2626',
              fontWeight: 500,
              fontSize: '0.8rem',
            }}
          >
            Sign Out
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Fixed Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          top: 0,
          left: 0,
          width: 240,
          height: '100vh',
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
};

export default PremiumSidebar;
