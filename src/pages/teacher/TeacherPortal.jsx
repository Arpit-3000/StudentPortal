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
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  School as SchoolIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  BookOnline as BookOnlineIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Grade as GradeIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TeacherProfile from './TeacherProfile';

const drawerWidth = 280;

const TeacherPortal = () => {
  const { user, logout, fetchUserProfile, fetchDashboardData } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard and profile data on component mount
  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data
        const dashboardResult = await fetchDashboardData();
        if (dashboardResult.success) {
          setDashboardData(dashboardResult.data);
        } else {
          console.error('Failed to load dashboard data:', dashboardResult.error);
        }
        
        // Fetch teacher profile data
        const profileResult = await fetchUserProfile();
        if (profileResult.success) {
          // Handle the API response structure: { success, message, data: { teacher } }
          const teacherData = profileResult.data.data?.teacher || profileResult.data.teacher || profileResult.data;
          setTeacherProfile(teacherData);
        } else {
          console.error('Failed to load teacher profile:', profileResult.error);
        }
        
      } catch (error) {
        console.error('Error loading teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
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

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'classes', label: 'My Classes', icon: <ClassIcon /> },
    { id: 'students', label: 'Students', icon: <PeopleIcon /> },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    { id: 'attendance', label: 'Attendance', icon: <ScheduleIcon /> },
    { id: 'grades', label: 'Grades & Results', icon: <GradeIcon /> },
    { id: 'exams', label: 'Exams & Quizzes', icon: <QuizIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'library', label: 'Library', icon: <BookOnlineIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          IIIT Una Portal
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Teacher Portal
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
              background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
            }}
          >
            {teacherProfile?.name?.charAt(0) || user?.name?.charAt(0) || 'T'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {teacherProfile?.name || user?.name || 'Teacher'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {teacherProfile?.teacherId || teacherProfile?.employeeId || 'T001'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {teacherProfile?.designation || 'Professor'} • {teacherProfile?.department || 'Computer Science'}
            </Typography>
            <Chip
              label={teacherProfile?.designation || 'Teacher'}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: '#e8f5e8',
                color: '#388e3c',
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
                    backgroundColor: '#e8f5e8',
                    color: '#388e3c',
                    '&:hover': {
                      backgroundColor: '#e8f5e8',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#388e3c',
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
              Welcome back, {teacherProfile?.name || user?.name || 'Teacher'}!
            </Typography>
            {teacherProfile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>{teacherProfile.designation}</strong> • {teacherProfile.department} • {teacherProfile.experience} years experience
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qualification: {teacherProfile.qualification} • Employee ID: {teacherProfile.employeeId}
                </Typography>
                {teacherProfile.specialization && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Specialization:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {teacherProfile.specialization.map((spec, index) => (
                        <Chip
                          key={index}
                          label={spec}
                          size="small"
                          sx={{
                            backgroundColor: '#f0f8ff',
                            color: '#1976d2',
                            fontSize: '0.7rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <ClassIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {dashboardData?.activeClasses || teacherProfile?.activeClasses || 4}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Active Classes</Typography>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {dashboardData?.totalStudents || teacherProfile?.totalStudents || 120}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Total Students</Typography>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {dashboardData?.pendingReviews || teacherProfile?.pendingReviews || 8}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Pending Reviews</Typography>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <AssessmentIcon sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {dashboardData?.avgAttendance || teacherProfile?.avgAttendance || '95%'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Avg. Attendance</Typography>
                  </Card>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                  <List>
                    {teacherProfile?.recentActivities ? (
                      teacherProfile.recentActivities.map((activity, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={activity.title}
                            secondary={activity.timestamp}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <>
                        <ListItem>
                          <ListItemText
                            primary="Assignment graded: Data Structures"
                            secondary="1 hour ago"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="New student enrolled in CS-301"
                            secondary="3 hours ago"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Attendance marked for Algorithm class"
                            secondary="1 day ago"
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<AssignmentIcon />}>
                        Create Assignment
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<ScheduleIcon />}>
                        Mark Attendance
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<GradeIcon />}>
                        Grade Assignments
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<AnalyticsIcon />}>
                        View Analytics
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 'classes':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              My Classes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your classes, view student lists, and track class performance.
            </Typography>
          </Box>
        );
      
      case 'students':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Students
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage student information, grades, and attendance.
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
              Create, manage, and grade assignments for your classes.
            </Typography>
          </Box>
        );
      
      case 'attendance':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Attendance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Mark and track student attendance for your classes.
            </Typography>
          </Box>
        );
      
      case 'grades':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Grades & Results
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage student grades and generate result reports.
            </Typography>
          </Box>
        );
      
      case 'exams':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Exams & Quizzes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage exams, quizzes, and assessments.
            </Typography>
          </Box>
        );
      
      case 'analytics':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View detailed analytics and reports for your classes and students.
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
              Access library resources and manage book requests.
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
              Welcome to Teacher Portal
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
            {navigationItems.find(item => item.id === selectedOption)?.label || 'Teacher Portal'}
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
              <TeacherProfile onBack={handleBackFromProfile} />
            ) : (
              renderMainContent()
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default TeacherPortal;
