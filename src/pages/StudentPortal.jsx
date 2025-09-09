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
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Restaurant as RestaurantIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  BookOnline as BookOnlineIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfilePage from './ProfilePage';

const drawerWidth = 280;

const StudentPortal = () => {
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
    setProfileAnchorEl(null);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'classroom', label: 'My Classroom', icon: <SchoolIcon /> },
    { id: 'attendance', label: 'Attendance Manager', icon: <ScheduleIcon /> },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    { id: 'admission', label: 'Admission', icon: <DescriptionIcon /> },
    { id: 'canteen', label: 'Canteen Order Online', icon: <RestaurantIcon /> },
    { id: 'library', label: 'Library', icon: <BookOnlineIcon /> },
    { id: 'results', label: 'Results', icon: <AssessmentIcon /> },
    { id: 'fees', label: 'Fee Payment', icon: <PaymentIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
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
          Student Portal
        </Typography>
      </Box>

      {/* Profile Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,
              mr: 2,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            }}
          >
            {user?.name?.charAt(0) || 'S'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user?.name || 'Student'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Roll: {user?.rollNumber || '23114'}
            </Typography>
            <Chip
              label="Student"
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontSize: '0.7rem',
              }}
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
    switch (selectedOption) {
      case 'dashboard':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Welcome back, {user?.name || 'Student'}!
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <SchoolIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>6</Typography>
                  <Typography variant="body2" color="text.secondary">Active Courses</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>3</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Assignments</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>95%</Typography>
                  <Typography variant="body2" color="text.secondary">Attendance</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>3.8</Typography>
                  <Typography variant="body2" color="text.secondary">GPA</Typography>
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
                        primary="Assignment submitted: Math 101"
                        secondary="2 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Grade posted: Physics Lab"
                        secondary="1 day ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="New assignment: Chemistry"
                        secondary="2 days ago"
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
                      <Button fullWidth variant="outlined" startIcon={<AssignmentIcon />}>
                        Submit Assignment
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<ScheduleIcon />}>
                        View Schedule
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<AssessmentIcon />}>
                        Check Results
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<PaymentIcon />}>
                        Pay Fees
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 'classroom':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              My Classroom
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access your classroom materials, assignments, and resources.
            </Typography>
          </Box>
        );
      
      case 'attendance':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Attendance Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your attendance and view attendance reports.
            </Typography>
          </Box>
        );
      
      case 'assignments':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Assignments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and submit your assignments.
            </Typography>
          </Box>
        );
      
      case 'admission':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Admission
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access admission-related information and documents.
            </Typography>
          </Box>
        );
      
      case 'canteen':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Canteen Order Online
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Order food from the college canteen online.
            </Typography>
          </Box>
        );
      
      case 'library':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Library
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access library resources and manage your book loans.
            </Typography>
          </Box>
        );
      
      case 'results':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Results
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View your academic results and grades.
            </Typography>
          </Box>
        );
      
      case 'fees':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Fee Payment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pay your fees and view payment history.
            </Typography>
          </Box>
        );
      
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account settings and preferences.
            </Typography>
          </Box>
        );
      
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome to Student Portal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select an option from the sidebar to get started.
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
            {navigationItems.find(item => item.id === selectedOption)?.label || 'Student Portal'}
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
      >
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
          <ListItemText>Logout</ListItemText>
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
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f5f7fa',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={showProfile ? 'profile' : selectedOption}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {showProfile ? (
              <ProfilePage onBack={handleBackFromProfile} />
            ) : (
              renderMainContent()
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default StudentPortal;
