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
  AccountBalance as AccountIcon,
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
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountsProfile from './AccountsProfile';

const drawerWidth = 280;

const AccountsPortal = () => {
  const { user, logout, getRoleBasedAPI } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [accountStats, setAccountStats] = useState(null);
  const [accountsProfile, setAccountsProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch account statistics on component mount
  useEffect(() => {
    const loadAccountData = async () => {
      try {
        setLoading(true);
        const api = getRoleBasedAPI();
        const response = await api.getAccountStatistics();
        setAccountStats(response.data);
      } catch (error) {
        console.error('Error loading account data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, [getRoleBasedAPI]);

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
    { id: 'accounts', label: 'Account Management', icon: <ManageAccountsIcon /> },
    { id: 'transactions', label: 'Transactions', icon: <ReceiptIcon /> },
    { id: 'fees', label: 'Fee Management', icon: <PaymentIcon /> },
    { id: 'reports', label: 'Financial Reports', icon: <ReportIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <AccountIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          IIIT Una Portal
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Accounts Portal
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
              background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
            }}
          >
            {accountsProfile?.name?.charAt(0) || user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {accountsProfile?.name || user?.name || 'Accountant'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {accountsProfile?.accountantId || accountsProfile?.id || 'ACC001'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accountant • Finance Department
            </Typography>
            <Chip
              label="Accountant"
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: '#fff3e0',
                color: '#f57c00',
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
                    backgroundColor: '#fff3e0',
                    color: '#f57c00',
                    '&:hover': {
                      backgroundColor: '#fff3e0',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#f57c00',
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
              Welcome back, {accountsProfile?.name || user?.name || 'Accountant'}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Accountant • Finance Department • Manage all financial operations
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <MoneyIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {accountStats?.totalRevenue || '₹2,50,000'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <PaymentIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {accountStats?.pendingPayments || 15}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Pending Payments</Typography>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {accountStats?.monthlyGrowth || '12%'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Monthly Growth</Typography>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <ReceiptIcon sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                    <Typography variant="h4" gutterBottom>
                      {accountStats?.totalTransactions || 245}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Total Transactions</Typography>
                  </Card>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<PaymentIcon />}>
                        Process Payment
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<ReceiptIcon />}>
                        View Transactions
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" startIcon={<ReportIcon />}>
                        Generate Report
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
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Payment processed: Student Fees"
                        secondary="1 hour ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Report generated: Monthly Summary"
                        secondary="3 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Transaction approved: Library Fees"
                        secondary="1 day ago"
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
              {navigationItems.find(item => item.id === selectedOption)?.label || 'Accounts Portal'}
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
            {navigationItems.find(item => item.id === selectedOption)?.label || 'Accounts Portal'}
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
              <AccountsProfile onBack={handleBackFromProfile} />
            ) : (
              renderMainContent()
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default AccountsPortal;
