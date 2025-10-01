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
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  School as SchoolIcon,
  EventNote as LeaveIcon,
  Assignment as AssignmentIcon,
  CheckCircle as VerifyIcon,
  List as ListIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AttendantProfile from './AttendantProfile';
import PendingLeaveForms from './PendingLeaveForms';
import AllLeaveForms from './AllLeaveForms';
import LeaveFormDetails from './LeaveFormDetails';

const drawerWidth = 280;

const AttendantPortal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [showFormDetails, setShowFormDetails] = useState(false);

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
    setProfileAnchorEl(null);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewForm = (formId) => {
    setSelectedFormId(formId);
    setShowFormDetails(true);
  };

  const handleBackFromFormDetails = () => {
    setShowFormDetails(false);
    setSelectedFormId(null);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'pending-forms', label: 'Pending Forms', icon: <LeaveIcon /> },
    { id: 'all-forms', label: 'All Forms', icon: <ListIcon /> },
    { id: 'verify-forms', label: 'Verify Forms', icon: <VerifyIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          IIIT Una Portal
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Attendant Portal
        </Typography>
      </Box>

      {/* Profile Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              mr: 2,
              bgcolor: '#1976d2',
              fontSize: '1.2rem',
            }}
          >
            {user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user?.name || 'Attendant'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.staffId || 'Staff ID'}
            </Typography>
            <Chip
              label={user?.role || 'Attendant'}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selectedOption === item.id}
                onClick={() => setSelectedOption(item.id)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#1976d2',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: selectedOption === item.id ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: '#d32f2f',
            borderColor: '#d32f2f',
            '&:hover': {
              borderColor: '#d32f2f',
              backgroundColor: '#ffebee',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  const renderMainContent = () => {
    if (showProfile) {
      return <AttendantProfile onBack={handleBackFromProfile} />;
    }

    if (showFormDetails && selectedFormId) {
      return (
        <LeaveFormDetails
          formId={selectedFormId}
          onBack={handleBackFromFormDetails}
          onVerify={() => {
            setShowFormDetails(false);
            setSelectedFormId(null);
            setSelectedOption('pending-forms');
          }}
        />
      );
    }

    switch (selectedOption) {
      case 'dashboard':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Welcome back, {user?.name || 'Attendant'}!
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <LeaveIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>12</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Forms</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <VerifyIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>8</Typography>
                  <Typography variant="body2" color="text.secondary">Verified Today</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>45</Typography>
                  <Typography variant="body2" color="text.secondary">Total Forms</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>92%</Typography>
                  <Typography variant="body2" color="text.secondary">Efficiency</Typography>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Verified leave form for John Doe"
                        secondary="2 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="New leave form submitted by Jane Smith"
                        secondary="4 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Verified leave form for Mike Johnson"
                        secondary="6 hours ago"
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<LeaveIcon />}
                        onClick={() => setSelectedOption('pending-forms')}
                      >
                        View Pending
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<ListIcon />}
                        onClick={() => setSelectedOption('all-forms')}
                      >
                        All Forms
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<VerifyIcon />}
                        onClick={() => setSelectedOption('verify-forms')}
                      >
                        Verify Forms
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<PersonIcon />}
                        onClick={handleProfileClick}
                      >
                        Profile
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 'pending-forms':
        return <PendingLeaveForms onViewForm={handleViewForm} />;

      case 'all-forms':
        return <AllLeaveForms onViewForm={handleViewForm} />;

      case 'verify-forms':
        return <PendingLeaveForms onViewForm={handleViewForm} showVerifyOnly={true} />;

      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {navigationItems.find(item => item.id === selectedOption)?.label || 'Attendant Portal'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This section is under development. Please check back later.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.id === selectedOption)?.label || 'Attendant Portal'}
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
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
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
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
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
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMainContent()}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default AttendantPortal;
