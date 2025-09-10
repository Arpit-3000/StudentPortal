import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Chip,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  AccountBalance as AccountBalanceIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Bloodtype as BloodIcon,
  Transgender as GenderIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';

const AdminProfile = ({ onBack }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching admin profile...');
      const response = await adminAPI.getProfile();
      console.log('Admin profile response:', response);
      
      // Handle the API response structure: { success, message, data: { admin } }
      if (response.data && response.data.data && response.data.data.admin) {
        setProfileData(response.data.data.admin);
      } else if (response.data && response.data.admin) {
        setProfileData(response.data.admin);
      } else if (response.data) {
        setProfileData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      let errorMessage = 'Failed to load profile data';
      if (error.response?.status === 404) {
        errorMessage = 'Profile not found. Please contact support.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized access. Please login again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    // Use the role from profile data if available, otherwise fall back to user role
    const role = profileData?.role || user?.role;
    switch (role) {
      case 'Super Admin':
      case 'super_admin':
        return 'Super Admin';
      case 'Moderator':
      case 'moderator':
        return 'Moderator';
      case 'Staff':
      case 'staff':
        return 'Staff';
      default:
        return 'Admin';
    }
  };

  const getRoleColor = () => {
    const role = profileData?.role || user?.role;
    switch (role) {
      case 'Super Admin':
      case 'super_admin':
        return 'error';
      case 'Moderator':
      case 'moderator':
        return 'warning';
      case 'Staff':
      case 'staff':
        return 'info';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No profile data available</Alert>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(salary);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Admin Profile
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    fontSize: '3rem',
                  }}
                >
                  {profileData.name?.charAt(0) || 'A'}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {profileData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {profileData.designation || getRoleLabel()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profileData.department || 'Administration'}
                </Typography>
                <Chip
                  label={profileData.isActive ? 'Active' : 'Inactive'}
                  color={profileData.isActive ? 'success' : 'default'}
                  sx={{ mt: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ mt: 2, width: '100%' }}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body1">
                              {profileData.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Phone
                            </Typography>
                            <Typography variant="body1">
                              {profileData.phone || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Date of Birth
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(profileData.dateOfBirth)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <GenderIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Gender
                            </Typography>
                            <Typography variant="body1">
                              {profileData.gender || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Professional Information */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Professional Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Admin ID
                            </Typography>
                            <Typography variant="body1">
                              {profileData.adminId || profileData.id}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Employee ID
                            </Typography>
                            <Typography variant="body1">
                              {profileData.employeeId || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Role
                            </Typography>
                            <Typography variant="body1">
                              {profileData.role || getRoleLabel()}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Designation
                            </Typography>
                            <Typography variant="body1">
                              {profileData.designation || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AdminIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Department
                            </Typography>
                            <Typography variant="body1">
                              {profileData.department || 'Administration'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Joining Date
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(profileData.joiningDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Experience
                            </Typography>
                            <Typography variant="body1">
                              {profileData.experience || 'N/A'} years
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Salary
                            </Typography>
                            <Typography variant="body1">
                              {formatSalary(profileData.salary)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Permissions & Access */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Permissions & Access
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Access Level
                            </Typography>
                            <Chip
                              label={profileData.role || getRoleLabel()}
                              color={getRoleColor()}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Work Hours
                            </Typography>
                            <Typography variant="body1">
                              {profileData.workHours || 'N/A'} hours/day
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {/* Admin Permissions */}
                    {profileData.permissions && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          System Permissions:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.entries(profileData.permissions).map(([permission, hasAccess]) => (
                            <Chip
                              key={permission}
                              label={permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              color={hasAccess ? 'success' : 'default'}
                              size="small"
                              variant={hasAccess ? 'filled' : 'outlined'}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Address */}
              {profileData.address && (
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Address
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LocationIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                        <Box>
                          <Typography variant="body1">
                            {profileData.address.street}
                          </Typography>
                          <Typography variant="body1">
                            {profileData.address.city}, {profileData.address.state}
                          </Typography>
                          <Typography variant="body1">
                            {profileData.address.pincode}, {profileData.address.country}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default AdminProfile;
