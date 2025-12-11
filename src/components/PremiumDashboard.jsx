import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  CreditCard as GatePassIcon,
  MenuBook as BookIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationIcon,
  QrCode as QrCodeIcon,
  EventNote as LeaveIcon,
  LibraryBooks as LibraryIcon,
  Assessment as AttendanceIcon,
} from '@mui/icons-material';

const PremiumDashboard = ({ user, onNavigate }) => {
  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const stats = [
    {
      title: 'Attendance',
      value: '87%',
      subtitle: '26/30 classes',
      icon: <CheckCircleIcon />,
      color: '#16a34a',
      bgColor: '#dcfce7',
    },
    {
      title: 'Next Class',
      value: 'DSA',
      subtitle: 'In 45 minutes',
      icon: <AccessTimeIcon />,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Gate Pass',
      value: 'Active',
      subtitle: 'Valid until 6 PM',
      icon: <GatePassIcon />,
      color: '#16a34a',
      bgColor: '#dcfce7',
    },
    {
      title: 'Books Due',
      value: '2',
      subtitle: '7 days remaining',
      icon: <BookIcon />,
      color: '#ef4444',
      bgColor: '#fee2e2',
    },
  ];

  const todaySchedule = [
    {
      time: '10 AM',
      subject: 'Data Structures',
      type: 'Lecture',
      professor: 'Dr. Sharma',
      location: 'LH-201',
      typeColor: '#f97316',
    },
    {
      time: '2 PM',
      subject: 'Web Development Lab',
      type: 'Lab',
      professor: 'Prof. Kumar',
      location: 'Lab-3',
      typeColor: '#f97316',
    },
    {
      time: '4 PM',
      subject: 'DBMS',
      type: 'Tutorial',
      professor: 'Dr. Singh',
      location: 'LH-105',
      typeColor: '#f97316',
    },
  ];

  const recentNotices = [
    {
      title: 'Mid-term Exam Schedule Released',
      time: '2 hours ago',
      tag: '#Exam',
      tagColor: '#ef4444',
      isNew: true,
    },
    {
      title: 'TCS Campus Drive - Nov 20',
      time: '5 hours ago',
      tag: '#Placement',
      tagColor: '#16a34a',
      isNew: true,
    },
    {
      title: 'Cultural Fest Registration Open',
      time: 'Yesterday',
      tag: '#Event',
      tagColor: '#f97316',
      isNew: false,
    },
  ];

  const quickActions = [
    {
      label: 'Open Gate Pass',
      icon: <QrCodeIcon />,
      onClick: () => onNavigate('gatepass'),
    },
    {
      label: 'Apply Leave',
      icon: <LeaveIcon />,
      onClick: () => onNavigate('applyleave'),
    },
    {
      label: 'Browse Library',
      icon: <LibraryIcon />,
      onClick: () => onNavigate('library'),
    },
    {
      label: 'View Attendance',
      icon: <AttendanceIcon />,
      onClick: () => onNavigate('attendance'),
    },
  ];

  return (
    <Box 
      sx={{ 
        backgroundColor: '#f9fafb', 
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 3 },
      }}
    >
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: '1500px',
          mx: 'auto',
        }}
      >
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              borderRadius: 3,
              p: 3,
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#ffffff',
                mb: 0.5,
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
              }}
            >
              {getGreeting()}, {user?.name || 'Rahul Sharma'}! 👋
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
              }}
            >
              Your Day in Una - {getCurrentDate()}
            </Typography>
          </Box>
        </motion.div>

        {/* Statistics Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3, justifyContent: 'center' }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: stat.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ color: stat.color, fontSize: 24 }}>
                          {stat.icon}
                        </Box>
                      </Box>
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 0.5,
                        fontSize: '1.5rem',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                      }}
                    >
                      {stat.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={2.5} sx={{ mb: 3, justifyContent: 'center' }}>
        {/* Today's Schedule */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ color: '#16a34a', mr: 1, fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1.125rem',
                    }}
                  >
                    Today's Schedule
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {todaySchedule.map((item, index) => (
                    <Box key={index}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <Box sx={{ minWidth: 60 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: '#1e293b',
                              fontSize: '0.875rem',
                            }}
                          >
                            {item.time}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                fontSize: '0.9375rem',
                              }}
                            >
                              {item.subject}
                            </Typography>
                            <Chip
                              label={item.type}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                backgroundColor: '#fff7ed',
                                color: item.typeColor,
                                border: `1px solid ${item.typeColor}40`,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#64748b',
                              fontSize: '0.75rem',
                              display: 'block',
                            }}
                          >
                            {item.professor} • {item.location}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < todaySchedule.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderColor: '#16a34a',
                    color: '#16a34a',
                    '&:hover': {
                      borderColor: '#15803d',
                      backgroundColor: '#f0fdf4',
                    },
                  }}
                >
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Notices */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationIcon sx={{ color: '#16a34a', mr: 1, fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1.125rem',
                    }}
                  >
                    Recent Notices
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
                  <List sx={{ p: 0 }}>
                    {recentNotices.map((notice, index) => (
                      <Box key={index}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              {notice.isNew && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#ef4444',
                                  }}
                                />
                              )}
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1e293b',
                                  fontSize: '0.875rem',
                                  flex: 1,
                                }}
                              >
                                {notice.title}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#94a3b8',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {notice.time}
                              </Typography>
                              <Chip
                                label={notice.tag}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  fontWeight: 500,
                                  backgroundColor: `${notice.tagColor}15`,
                                  color: notice.tagColor,
                                  border: `1px solid ${notice.tagColor}40`,
                                }}
                              />
                            </Box>
                          </Box>
                        </ListItem>
                        {index < recentNotices.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: '#16a34a',
                    '&:hover': {
                      backgroundColor: '#15803d',
                    },
                  }}
                >
                  View All Notices
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

        {/* Quick Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Button
                  fullWidth
                  onClick={action.onClick}
                  sx={{
                    p: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    textTransform: 'none',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#16a34a',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: '#16a34a',
                      fontSize: 24,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: '#1e293b',
                      fontSize: '0.875rem',
                    }}
                  >
                    {action.label}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
};

export default PremiumDashboard;
