import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Security as SecurityIcon,
  QrCodeScanner as QrScannerIcon,
  People as PeopleIcon,
  List as ListIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  X as XIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GuardProfile from './GuardProfile';
import QRScanner from './QRScanner';
import ActiveStudents from './ActiveStudents';
import GateLogs from './GateLogs';
import GuardDashboard from './GuardDashboard';

const drawerWidth = 280;

const GuardPortal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    handleProfileMenuClose();
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

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      color: '#3b82f6',
    },
    {
      id: 'qrscanner',
      label: 'QR Scanner',
      icon: <QrScannerIcon />,
      color: '#10b981',
    },
    {
      id: 'activestudents',
      label: 'Active Students',
      icon: <PeopleIcon />,
      color: '#f59e0b',
    },
    {
      id: 'gatelogs',
      label: 'Gate Logs',
      icon: <ListIcon />,
      color: '#ef4444',
    },
  ];

  const renderMainContent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return <GuardDashboard user={user} onNavigate={handleOptionSelect} />;
      case 'qrscanner':
        return <QRScanner user={user} />;
      case 'activestudents':
        return <ActiveStudents user={user} />;
      case 'gatelogs':
        return <GateLogs user={user} />;
      default:
        return <GuardDashboard user={user} onNavigate={handleOptionSelect} />;
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <SecurityIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            Guard Portal
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
            Campus Security Management
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ px: 1, mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleOptionSelect(item.id)}
              sx={{
                borderRadius: 2,
                backgroundColor: selectedOption === item.id ? `${item.color}20` : 'transparent',
                border: selectedOption === item.id ? `1px solid ${item.color}40` : '1px solid transparent',
                '&:hover': {
                  backgroundColor: `${item.color}10`,
                  border: `1px solid ${item.color}30`,
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  color: selectedOption === item.id ? item.color : '#6b7280',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: selectedOption === item.id ? 600 : 500,
                    color: selectedOption === item.id ? item.color : '#374151',
                    fontSize: '0.9rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#3b82f6',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'G'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#374151',
                fontSize: '0.9rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name || 'Guard User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#6b7280',
                fontSize: '0.75rem',
                textTransform: 'capitalize',
              }}
            >
              Security Guard
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            color: '#374151',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {navigationItems.find(item => item.id === selectedOption)?.label || 'Guard Portal'}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                },
              }}
            >
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box sx={{ p: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedOption}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {showProfile ? (
                <GuardProfile user={user} onBack={handleBackFromProfile} />
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

export default GuardPortal;
