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
  Work as WorkIcon,
  Science as ScienceIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Bloodtype as BloodIcon,
  Transgender as GenderIcon,
  Class as ClassIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { studentAPI } from '../../services/api';

const StudentProfile = ({ onBack }) => {
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

  const formatFees = (fees) => {
    if (!fees) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(fees);
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
            Student Profile
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
                  {profileData.name?.charAt(0) || 'S'}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {profileData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {profileData.course}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profileData.year} Year • {profileData.currentSemester} Semester
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profileData.branch}
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
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <BloodIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Blood Group
                            </Typography>
                            <Typography variant="body1">
                              {profileData.bloodGroup || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Academic Information */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Academic Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Course
                            </Typography>
                            <Typography variant="body1">
                              {profileData.course}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ClassIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Year & Semester
                            </Typography>
                            <Typography variant="body1">
                              {profileData.year} Year • {profileData.currentSemester} Semester
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Branch
                            </Typography>
                            <Typography variant="body1">
                              {profileData.branch}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Department
                            </Typography>
                            <Typography variant="body1">
                              {profileData.department}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Admission Date
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(profileData.admissionDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Roll Number
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                              {profileData.rollNumber || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Fees Status
                            </Typography>
                            <Chip
                              label={profileData.feesStatus || 'Pending'}
                              color={profileData.feesStatus === 'Paid' ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Family Information */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Family Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Father's Name
                            </Typography>
                            <Typography variant="body1">
                              {profileData.fatherName || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Father's Phone
                            </Typography>
                            <Typography variant="body1">
                              {profileData.fatherPhone || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Mother's Name
                            </Typography>
                            <Typography variant="body1">
                              {profileData.motherName || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Mother's Phone
                            </Typography>
                            <Typography variant="body1">
                              {profileData.motherPhone || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
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

export default StudentProfile;
