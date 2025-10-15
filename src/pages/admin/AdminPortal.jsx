import React, { useState, useEffect } from 'react';
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
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  BookOnline as BookOnlineIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  ManageAccounts as ManageAccountsIcon,
  Report as ReportIcon,
  LibraryBooks as LibraryBooksIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminProfile from './AdminProfile';

const drawerWidth = 280;

const AdminPortal = () => {
  const { user, logout, fetchUserProfile, fetchDashboardData } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard and profile data on component mount
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data
        const dashboardResult = await fetchDashboardData();
        if (dashboardResult.success) {
          setDashboardData(dashboardResult.data);
        } else {
          console.error('Failed to load dashboard data:', dashboardResult.error);
        }
        
        // Fetch admin profile data
        const profileResult = await fetchUserProfile();
        if (profileResult.success) {
          setAdminProfile(profileResult.data);
        } else {
          console.error('Failed to load admin profile:', profileResult.error);
        }
        
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [fetchDashboardData, fetchUserProfile]);

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

  // Get role-specific navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { id: 'users', label: 'User Management', icon: <PeopleIcon /> },
      { id: 'students', label: 'Students', icon: <SchoolIcon /> },
      { id: 'teachers', label: 'Teachers', icon: <PersonIcon /> },
      { id: 'courses', label: 'Courses', icon: <AssignmentIcon /> },
      { id: 'attendance', label: 'Attendance', icon: <ScheduleIcon /> },
      { id: 'library', label: 'Library', icon: <BookOnlineIcon /> },
      { id: 'reports', label: 'Reports', icon: <ReportIcon /> },
      { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    // Add role-specific items
    if (user?.role === 'super_admin') {
      baseItems.splice(1, 0, { id: 'admin-management', label: 'Admin Management', icon: <ManageAccountsIcon /> });
      baseItems.splice(2, 0, { id: 'security', label: 'Security', icon: <SecurityIcon /> });
    }

    return baseItems;
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'super_admin':
        return 'Super Admin';
      case 'moderator':
        return 'Moderator';
      case 'staff':
        return 'Staff';
      default:
        return 'Admin';
    }
  };

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
        <AdminIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          IIIT Una Portal
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Admin Portal
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
            {adminProfile?.name?.charAt(0) || user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {adminProfile?.name || user?.name || 'Admin'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {adminProfile?.adminId || adminProfile?.id || 'A001'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {adminProfile?.designation || getRoleLabel()} • {adminProfile?.department || 'Administration'}
            </Typography>
            <Chip
              label={adminProfile?.role || getRoleLabel()}
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
          {getNavigationItems().map((item) => (
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
              Welcome back, {adminProfile?.name || user?.name || 'Admin'}!
            </Typography>
            {adminProfile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>{adminProfile.designation}</strong> • {adminProfile.department} • 
                  {adminProfile.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin ID: {adminProfile.adminId} • Employee ID: {adminProfile.employeeId}
                </Typography>
                {adminProfile.permissions && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Permissions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Object.entries(adminProfile.permissions)
                        .filter(([_, hasAccess]) => hasAccess)
                        .slice(0, 4)
                        .map(([permission, _]) => (
                          <Chip
                            key={permission}
                            label={permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            size="small"
                            sx={{
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      {Object.entries(adminProfile.permissions).filter(([_, hasAccess]) => hasAccess).length > 4 && (
                        <Chip
                          label={`+${Object.entries(adminProfile.permissions).filter(([_, hasAccess]) => hasAccess).length - 4} more`}
                          size="small"
                          sx={{
                            backgroundColor: '#f5f5f5',
                            color: '#666',
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    {dashboardData?.totalUsers || 150}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Total Users</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <SchoolIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    {dashboardData?.totalStudents || 120}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Students</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <PersonIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    {dashboardData?.totalTeachers || 25}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Teachers</Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    {dashboardData?.totalCourses || 45}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Courses</Typography>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<PeopleIcon />}>
                        Add User
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<SchoolIcon />}>
                        Manage Students
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<PersonIcon />}>
                        Manage Teachers
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<ReportIcon />}>
                        Generate Report
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>System Status</Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Database Status"
                        secondary="Online"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Server Status"
                        secondary="Running"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Last Backup"
                        secondary="2 hours ago"
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {getNavigationItems().find(item => item.id === selectedOption)?.label || 'Admin Portal'}
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
            {getNavigationItems().find(item => item.id === selectedOption)?.label || 'Admin Portal'}
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
              <AdminProfile onBack={handleBackFromProfile} />
            ) : (
              renderMainContent()
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default AdminPortal;
