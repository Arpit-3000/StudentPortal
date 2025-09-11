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
  Class as ClassIcon,
  LibraryBooks as LibraryIcon,
  EventAvailable as AttendanceIcon,
  School as AdmissionIcon,
  LocalDining as CanteenIcon,
  ShoppingCart as OrderIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentProfile from './StudentProfile';

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
    { id: 'myclassroom', label: 'My Classroom', icon: <ClassIcon /> },
    { id: 'library', label: 'Library', icon: <LibraryIcon /> },
    { id: 'attendance', label: 'Attendance', icon: <AttendanceIcon /> },
    { id: 'admission', label: 'Admission', icon: <AdmissionIcon /> },
    { id: 'canteen', label: 'Canteen Order Online', icon: <CanteenIcon /> },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    { id: 'results', label: 'Results', icon: <AssessmentIcon /> },
    { id: 'fees', label: 'Fees', icon: <PaymentIcon /> },
    { id: 'documents', label: 'Documents', icon: <DescriptionIcon /> },
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
              Roll No: {user?.rollNumber || '23114'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.course || 'Bachelor of Technology'} • {user?.year || '3rd Year'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.branch || 'Computer Science and Engineering'}
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
                  <ScheduleIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>4</Typography>
                  <Typography variant="body2" color="text.secondary">Today's Classes</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>3</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Assignments</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>85%</Typography>
                  <Typography variant="body2" color="text.secondary">Overall Grade</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <PaymentIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>₹45,000</Typography>
                  <Typography variant="body2" color="text.secondary">Fees Due</Typography>
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
                        primary="Class attended: Data Structures"
                        secondary="2 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Library book issued: Algorithm Design"
                        secondary="4 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Canteen order placed: Lunch"
                        secondary="6 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Assignment submitted: Mathematics"
                        secondary="1 day ago"
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
                      <Button fullWidth variant="outlined" startIcon={<ClassIcon />}>
                        My Classroom
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<LibraryIcon />}>
                        Library
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<AttendanceIcon />}>
                        Attendance
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<CanteenIcon />}>
                        Canteen Order
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<AssignmentIcon />}>
                        Assignments
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
      
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {navigationItems.find(item => item.id === selectedOption)?.label || 'Student Portal'}
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
              <StudentProfile onBack={handleBackFromProfile} />
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
