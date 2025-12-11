import React, { useState } from 'react';
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
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as ClassroomIcon,
  MenuBook as LibraryIcon,
  CreditCard as GatePassIcon,
  EventNote as LeaveIcon,
  Email as MailIcon,
  DriveFolderUpload as DrivesIcon,
  Person as ProfileIcon,
  LocalDining as CanteenIcon,
  Favorite as HealthIcon,
  Settings as SettingsIcon,
  ChevronLeft as CollapseIcon,
  CalendarToday as CalendarIcon,
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
  const [collapsed, setCollapsed] = useState(false);
  const drawerWidth = collapsed ? 64 : 240;

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
    },
    {
      id: 'classroom',
      label: 'Classroom',
      icon: <ClassroomIcon />,
    },
    {
      id: 'library',
      label: 'Library',
      icon: <LibraryIcon />,
    },
    {
      id: 'gatepass',
      label: 'Gate Pass',
      icon: <GatePassIcon />,
    },
    {
      id: 'applyleave',
      label: 'Apply Leave',
      icon: <LeaveIcon />,
    },
    {
      id: 'mailnotices',
      label: 'Mails & Notices',
      icon: <MailIcon />,
    },
    {
      id: 'googledrive',
      label: 'Drives',
      icon: <DrivesIcon />,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarIcon />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <ProfileIcon />,
    },
    {
      id: 'canteen',
      label: 'Canteen',
      icon: <CanteenIcon />,
    },
    {
      id: 'health',
      label: 'Health',
      icon: <HealthIcon />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
      }}
    >
      {/* Collapse Button */}
      <Box sx={{ p: 1, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', borderBottom: '1px solid #e5e7eb' }}>
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            width: 24,
            height: 24,
            color: '#64748b',
            '&:hover': {
              backgroundColor: '#f3f4f6',
              color: '#16a34a',
            },
          }}
        >
          <CollapseIcon sx={{ fontSize: 16, transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
        </IconButton>
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
            background: '#d1d5db',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#9ca3af',
          },
        }}
      >
        <List sx={{ px: collapsed ? 0.5 : 1 }}>
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <ListItem disablePadding sx={{ mb: 0.25, px: collapsed ? 0.5 : 1 }}>
                <ListItemButton
                  selected={selectedOption === item.id}
                  onClick={() => {
                    if (item.id === 'profile') {
                      onProfileClick();
                    } else {
                      onOptionSelect(item.id);
                    }
                  }}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.25,
                    px: collapsed ? 1 : 1.5,
                    minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      backgroundColor: '#d1fae5',
                      color: '#16a34a',
                      '&:hover': {
                        backgroundColor: '#a7f3d0',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#16a34a',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      color: selectedOption === item.id ? '#16a34a' : '#64748b',
                      transition: 'all 0.2s ease',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: selectedOption === item.id ? 600 : 500,
                        color: selectedOption === item.id ? '#16a34a' : '#374151',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
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
            width: drawerWidth,
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
          width: drawerWidth,
          height: '100vh',
          zIndex: 1000,
          overflow: 'hidden',
          transition: 'width 0.3s ease',
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
};

export default PremiumSidebar;
