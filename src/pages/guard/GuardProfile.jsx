import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const GuardProfile = ({ user, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={onBack} sx={{ color: '#6b7280' }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
          Profile
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: '#3b82f6',
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  margin: '0 auto 16px',
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'G'}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
                {user?.name || 'Guard User'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                Security Guard
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#eff6ff',
                  },
                }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Details Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 3 }}>
                Personal Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <PersonIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        Full Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {user?.name || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <EmailIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {user?.email || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <PhoneIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {user?.phone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <BadgeIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        Staff ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {user?.staffId || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SecurityIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        Role
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Security Guard
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SchoolIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        Department
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Security & Safety
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 2 }}>
                Security Responsibilities
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  • Monitor campus entry and exit points
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  • Scan student QR codes for gate passes
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  • Track student campus presence
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  • Maintain security logs and records
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  • Ensure campus safety and security
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GuardProfile;
