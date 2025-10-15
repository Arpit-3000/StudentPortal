import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { nonTeachingAPI } from '../../services/api';

const AttendantProfile = ({ onBack }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await nonTeachingAPI.getProfile();
      if (response.data.success) {
        // Handle different response structures
        const profile = response.data.data?.profile || response.data.data || response.data.user || response.data;
        setProfileData(profile);
      } else {
        setError(response.data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={fetchProfile}>
            Retry
          </Button>
          <Button variant="outlined" onClick={onBack} startIcon={<ArrowBackIcon />}>
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  const profile = profileData || user;
  

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {error && user && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Unable to fetch latest profile data. Showing cached information. 
          <Button size="small" onClick={fetchProfile} sx={{ ml: 1 }}>
            Retry
          </Button>
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Profile
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Picture and Basic Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: '#1976d2',
                  fontSize: '3rem',
                }}
              >
                {profile?.name?.charAt(0) || 'A'}
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                {profile?.name || 'Attendant Name'}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profile?.designation || 'Attendant'}
              </Typography>
              <Chip
                label={profile?.role || 'Attendant'}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Staff ID: {profile?.staffId || 'N/A'}
              </Typography>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.name || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.email || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.phone || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Staff ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.staffId || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.role || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.department || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.gender || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Blood Group
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.bloodGroup || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Work Information */}
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                Work Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Designation
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.designation || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.department || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Joining Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Work Hours
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.workHours ? `${profile.workHours} hours/day` : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Salary
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profile?.salary ? `₹${profile.salary.toLocaleString()}` : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Address Information */}
          {profile?.address && (
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Address Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Street
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {profile.address.street || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {profile.address.city || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      State
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {profile.address.state || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Pincode
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {profile.address.pincode || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {profile.address.country || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          )}

          {/* Permissions */}
          {profile?.permissions && (
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Permissions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={profile?.permissions?.canApproveLeave ? 'Yes' : 'No'}
                        color={profile?.permissions?.canApproveLeave ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">Can Approve Leave</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={profile?.permissions?.canRejectLeave ? 'Yes' : 'No'}
                        color={profile?.permissions?.canRejectLeave ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">Can Reject Leave</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={profile?.permissions?.canViewAllLeaves ? 'Yes' : 'No'}
                        color={profile?.permissions?.canViewAllLeaves ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">Can View All Leaves</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={profile?.permissions?.canViewStudentDetails ? 'Yes' : 'No'}
                        color={profile?.permissions?.canViewStudentDetails ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">Can View Student Details</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AttendantProfile;
