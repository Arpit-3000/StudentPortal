import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  QrCodeScanner as QrScannerIcon,
  People as PeopleIcon,
  List as ListIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  X as XIcon,
  AccessTime as ClockIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { guardAPI } from '../../services/api';

const GuardDashboard = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({
    activeStudents: 0,
    totalScans: 0,
    pendingScans: 0,
    todayScans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch active students
      const activeResponse = await guardAPI.getActiveStudents();
      const activeStudents = activeResponse.data.success ? activeResponse.data.data.students.length : 0;

      // Fetch recent gate logs
      const logsResponse = await guardAPI.getGateLogs({ limit: 10 });
      const recentLogs = logsResponse.data.success ? logsResponse.data.data.logs : [];

      setStats({
        activeStudents,
        totalScans: recentLogs.length,
        pendingScans: recentLogs.filter(log => log.status === 'pending').length,
        todayScans: recentLogs.filter(log => {
          const today = new Date().toDateString();
          return new Date(log.issuedAt).toDateString() === today;
        }).length,
      });

      setRecentActivity(recentLogs.slice(0, 5));
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed': return <CheckIcon size={16} />;
      case 'pending': return <ClockIcon size={16} />;
      case 'expired': return <XIcon size={16} />;
      default: return null;
    }
  };

  const getActionColor = (action) => {
    return action === 'exit' ? '#ef4444' : '#10b981';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
          Security Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Monitor campus security and manage student access
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.activeStudents}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Students
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.todayScans}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Today's Scans
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.pendingScans}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pending Scans
                  </Typography>
                </Box>
                <ClockIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.totalScans}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Scans
                  </Typography>
                </Box>
                <ListIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<QrScannerIcon />}
                  onClick={() => onNavigate('qrscanner')}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    },
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Scan QR Code
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PeopleIcon />}
                  onClick={() => onNavigate('activestudents')}
                  sx={{
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: '#eff6ff',
                    },
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  View Active Students
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ListIcon />}
                  onClick={() => onNavigate('gatelogs')}
                  sx={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    '&:hover': {
                      borderColor: '#dc2626',
                      backgroundColor: '#fef2f2',
                    },
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  View All Logs
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Recent Activity
                </Typography>
                <IconButton onClick={fetchDashboardData} size="small">
                  <RefreshIcon />
                </IconButton>
              </Box>
              {recentActivity.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: '#6b7280' }}>
                  <SchoolIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
                  <Typography variant="body2">
                    No recent activity
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {recentActivity.map((activity, index) => (
                    <Box
                      key={activity._id || index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        backgroundColor: '#f8fafc',
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: getActionColor(activity.action),
                            fontSize: '0.8rem',
                          }}
                        >
                          {activity.action === 'exit' ? '↗' : '↘'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                            {activity.studentSnapshot?.name || 'Unknown Student'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {activity.destination} • {formatTime(activity.issuedAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={getStatusIcon(activity.status)}
                          label={activity.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(activity.status) + '20',
                            color: getStatusColor(activity.status),
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GuardDashboard;
