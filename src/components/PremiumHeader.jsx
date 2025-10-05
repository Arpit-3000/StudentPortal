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
  InputBase,
  Paper,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
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

  const navigationItems = {
    dashboard: 'Dashboard',
    myclassroom: 'My Classroom',
    library: 'Library',
    attendance: 'Attendance',
    applyleave: 'Apply Leave',
    assignments: 'Assignments',
    results: 'Results',
    canteen: 'Canteen',
    fees: 'Fees',
    documents: 'Documents',
    settings: 'Settings',
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e2e8f0',
        color: '#1e293b',
        zIndex: 1200,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1.5, minHeight: '70px !important' }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Branding Section */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {/* College Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 2.5,
            '& img': {
              height: 36,
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }
          }}>
            <img 
              src="/iiitunaLogo.png" 
              alt="College Logo" 
              style={{ height: '36px', width: 'auto' }}
            />
          </Box>
          
          {/* Brand Name and Tagline - Minimal Design */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: '1.3rem',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              ALTIUS
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: '0.7rem',
                fontWeight: 400,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                opacity: 0.8,
              }}
            >
              College Management Platform
            </Typography>
          </Box>
        </Box>

        {/* Search Bar - Desktop Only */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              component="form"
              sx={{
                p: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                width: 350,
                mr: 4,
                backgroundColor: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: '#f1f5f9',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
                '&:focus-within': {
                  borderColor: '#6366f1',
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
                  backgroundColor: '#ffffff',
                },
              }}
            >
              <SearchIcon sx={{ color: '#64748b', mr: 1.5, fontSize: 22 }} />
              <InputBase
                placeholder="Search anything..."
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '& input': {
                    '&::placeholder': {
                      color: '#94a3b8',
                      opacity: 1,
                      fontWeight: 400,
                    },
                  },
                }}
              />
            </Paper>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={handleNotificationMenuOpen}
              sx={{
                backgroundColor: '#f8fafc',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                width: 44,
                height: 44,
                borderRadius: 3,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  borderColor: '#cbd5e1',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    minWidth: 18,
                    height: 18
                  } 
                }}
              >
                <NotificationIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
          </motion.div>

          {/* Profile Menu */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                border: '3px solid #e2e8f0',
                borderRadius: 4,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  borderColor: '#6366f1',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                }}
              >
                {user?.name?.charAt(0) || 'S'}
              </Avatar>
            </IconButton>
          </motion.div>
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
              minWidth: 200,
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {user?.name || 'Student'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {user?.rollNumber || '23114'} • {user?.course || 'B.Tech'}
            </Typography>
            <Chip
              label="Student"
              size="small"
              sx={{
                mt: 1,
                height: 20,
                fontSize: '0.7rem',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
              }}
            />
          </Box>
          
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
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
              minWidth: 300,
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Notifications
            </Typography>
          </Box>
          
          <MenuItem>
            <ListItemIcon>
              <SchoolIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="New assignment posted"
              secondary="Data Structures - Due tomorrow"
            />
          </MenuItem>
          
          <MenuItem>
            <ListItemIcon>
              <NotificationIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Class schedule updated"
              secondary="Mathematics class moved to Lab 2"
            />
          </MenuItem>
          
          <MenuItem>
            <ListItemIcon>
              <NotificationIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Library book due soon"
              secondary="Algorithm Design - Return in 2 days"
            />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default PremiumHeader;
