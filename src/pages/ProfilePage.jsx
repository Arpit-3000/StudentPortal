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
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { studentAPI } from '../services/api';

const ProfilePage = ({ onBack }) => {
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
      const response = await studentAPI.getProfile();
      // Handle the API response structure: { success, message, data: { student } }
      setProfileData(response.data.data.student);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={fetchProfileData}>
          Retry
        </Button>
      </Box>
    );
  }

  const profileInfo = profileData || user;

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            My Profile
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
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
                  {profileInfo?.name?.charAt(0) || 'S'}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {profileInfo?.name || 'Student Name'}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Roll: {profileInfo?.rollNumber || '23114'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID: {profileInfo?.studentId || 'STU2024001'}
                </Typography>
                <Chip
                  label="Student"
                  color="primary"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  fullWidth
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.name || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.email || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.phone || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BadgeIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Roll Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.rollNumber || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date of Birth
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.dateOfBirth ? new Date(profileInfo.dateOfBirth).toLocaleDateString() : 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Gender
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.gender || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Blood Group
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.bloodGroup || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Address Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Street Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.address?.street || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          City
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.address?.city || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          State
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.address?.state || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Pincode
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.address?.pincode || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Country
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.address?.country || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Parent Information */}
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Parent Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Father's Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.fatherName || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Father's Phone
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.fatherPhone || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Mother's Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.motherName || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Mother's Phone
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.motherPhone || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Academic Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Department
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.department || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccountBalanceIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Branch
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.branch || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Current Year
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.year || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Current Semester
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.currentSemester || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Course
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {profileInfo?.course || 'Not Available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Academic Stats
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        3.8
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current GPA
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                        95%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Attendance
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)' }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                        6
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Courses
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)' }}>
                      <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                        3
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Tasks
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default ProfilePage;
