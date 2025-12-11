import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Box,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';

const PremiumHeader = ({ 
  onMenuClick, 
  onProfileClick, 
  onLogout, 
  selectedOption, 
  user,
  isMobile = false 
}) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    onProfileClick();
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    onLogout();
    handleProfileMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        color: '#1e293b',
        zIndex: 1200,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1.5, minHeight: '64px !important', justifyContent: 'space-between' }}>
        {/* Left: Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
          }}>
            <img 
              src="/iiitunaLogo.png" 
              alt="IIIT Una Portal" 
              style={{ height: '32px', width: 'auto' }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#16a34a',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              IIIT Una Portal
            </Typography>
          </Box>
        </Box>

        {/* Right: Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Refresh Icon */}
          <IconButton
            sx={{
              color: '#64748b',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#16a34a',
              },
            }}
          >
            <RefreshIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Notifications */}
          <IconButton
            onClick={handleNotificationMenuOpen}
            sx={{
              color: '#64748b',
              position: 'relative',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#16a34a',
              },
            }}
          >
            <NotificationIcon sx={{ fontSize: 22 }} />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid white',
              }}
            />
          </IconButton>

          {/* Messages */}
          <IconButton
            sx={{
              color: '#64748b',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#16a34a',
              },
            }}
          >
            <MessageIcon sx={{ fontSize: 22 }} />
          </IconButton>

          {/* Profile with Dropdown */}
          <Box
            onClick={handleProfileMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f3f4f6',
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0) || 'S'}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: '#1e293b',
                fontSize: '0.875rem',
                display: { xs: 'none', md: 'block' },
              }}
            >
              Student
            </Typography>
            <ArrowDropDownIcon sx={{ fontSize: 20, color: '#64748b', display: { xs: 'none', md: 'block' } }} />
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
              {user?.name || 'Student'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
              {user?.rollNumber || '23114'} • {user?.course || 'B.Tech'}
            </Typography>
          </Box>
          
          <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" sx={{ color: '#64748b' }} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: '#64748b' }} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText primary="Sign Out" primaryTypographyProps={{ sx: { color: '#ef4444' } }} />
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 320,
              maxHeight: 400,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Notifications
            </Typography>
          </Box>
          
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <MenuItem>
              <ListItemText
                primary="New assignment posted"
                secondary="Data Structures - Due tomorrow"
              />
            </MenuItem>
            
            <MenuItem>
              <ListItemText
                primary="Class schedule updated"
                secondary="Mathematics class moved to Lab 2"
              />
            </MenuItem>
            
            <MenuItem>
              <ListItemText
                primary="Library book due soon"
                secondary="Algorithm Design - Return in 2 days"
              />
            </MenuItem>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default PremiumHeader;
