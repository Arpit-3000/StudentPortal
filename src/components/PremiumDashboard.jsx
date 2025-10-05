import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Stack,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  EventAvailable as AttendanceIcon,
  BookOnline as BookOnlineIcon,
  Notifications as NotificationIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryIcon,
  LocalDining as CanteenIcon,
  CalendarToday as CalendarIcon,
  Grade as GradeIcon,
  Class as ClassIcon,
} from '@mui/icons-material';

const PremiumDashboard = ({ user, onNavigate }) => {
  const stats = [
    {
      title: "Today's Classes",
      value: "4",
      change: "+2 from yesterday",
      icon: <ClassIcon />,
      color: "#6366f1",
      bgColor: "#eef2ff",
    },
    {
      title: "Pending Assignments",
      value: "3",
      change: "Due this week",
      icon: <AssignmentIcon />,
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
    {
      title: "Overall Grade",
      value: "85%",
      change: "+5% this semester",
      icon: <GradeIcon />,
      color: "#10b981",
      bgColor: "#d1fae5",
    },
  ];

  const quickActions = [
    {
      title: "My Classroom",
      description: "View classes & schedule",
      icon: <SchoolIcon />,
      color: "#6366f1",
      onClick: () => onNavigate('classroom'),
    },
    {
      title: "Library",
      description: "Browse books & resources",
      icon: <LibraryIcon />,
      color: "#8b5cf6",
      onClick: () => onNavigate('library'),
    },
    {
      title: "Attendance",
      description: "Check attendance records",
      icon: <AttendanceIcon />,
      color: "#10b981",
      onClick: () => onNavigate('attendance'),
    },
    {
      title: "Canteen Order",
      description: "Order food online",
      icon: <CanteenIcon />,
      color: "#f59e0b",
      onClick: () => onNavigate('canteen'),
    },
    {
      title: "Assignments",
      description: "View & submit assignments",
      icon: <AssignmentIcon />,
      color: "#ef4444",
      onClick: () => onNavigate('assignments'),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Class attended: Data Structures",
      time: "2 hours ago",
      icon: <SchoolIcon />,
      color: "#6366f1",
    },
    {
      id: 2,
      title: "Library book issued: Algorithm Design",
      time: "4 hours ago",
      icon: <LibraryIcon />,
      color: "#8b5cf6",
    },
    {
      id: 3,
      title: "Canteen order placed: Lunch",
      time: "6 hours ago",
      icon: <CanteenIcon />,
      color: "#f59e0b",
    },
    {
      id: 4,
      title: "Assignment submitted: Mathematics",
      time: "1 day ago",
      icon: <AssignmentIcon />,
      color: "#ef4444",
    },
  ];


  return (
    <Box sx={{ p: { xs: 1.5, md: 2 }, height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      {/* Welcome Header - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 0.5,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome back, {user?.name || 'Student'}! 👋
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#64748b', fontSize: '0.9rem' }}
          >
            Here's what's happening with your studies today.
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Grid - Compact */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ color: stat.color, fontSize: 20 }}>
                        {stat.icon}
                      </Box>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '2rem',
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.color,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid - Three Column Layout */}
      <Grid container spacing={2} sx={{ height: 'calc(100% - 180px)' }}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1rem',
                    }}
                  >
                    Recent Activities
                  </Typography>
                  <IconButton size="small">
                    <MoreVertIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </IconButton>
                </Box>
                
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: index < recentActivities.length - 1 ? '1px solid #f1f5f9' : 'none',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: `${activity.color}15`,
                              color: activity.color,
                            }}
                          >
                            {activity.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: '#1e293b',
                                fontSize: '0.8rem',
                              }}
                            >
                              {activity.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748b',
                                fontSize: '0.7rem',
                              }}
                            >
                              {activity.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Quick Actions
                </Typography>
                
                <Grid container spacing={1.5}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <Button
                          fullWidth
                          onClick={action.onClick}
                          sx={{
                            p: 1.5,
                            height: 80,
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 1.5,
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1.5,
                              backgroundColor: `${action.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 0.5,
                            }}
                          >
                            <Box sx={{ color: action.color, fontSize: 14 }}>
                              {action.icon}
                            </Box>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: '#1e293b',
                              fontSize: '0.65rem',
                              textAlign: 'center',
                              lineHeight: 1.2,
                            }}
                          >
                            {action.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#64748b',
                              fontSize: '0.6rem',
                              textAlign: 'center',
                              lineHeight: 1.2,
                              mt: 0.25,
                            }}
                          >
                            {action.description}
                          </Typography>
                        </Button>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Notifications & Upcoming Events */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1rem',
                    }}
                  >
                    Notifications
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: '#ef4444', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 20, 
                    height: 20, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    3
                  </Box>
                </Box>
                
                <List sx={{ p: 0, mb: 2 }}>
                  {[
                    { id: 1, title: "Assignment due tomorrow", time: "2h ago", urgent: true },
                    { id: 2, title: "Library book overdue", time: "1d ago", urgent: false },
                    { id: 3, title: "New grade posted", time: "2d ago", urgent: false },
                  ].map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          px: 0,
                          py: 0.75,
                          borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: notification.urgent ? '#ef4444' : '#10b981',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: '#1e293b',
                                fontSize: '0.8rem',
                                lineHeight: 1.3,
                              }}
                            >
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748b',
                                fontSize: '0.7rem',
                              }}
                            >
                              {notification.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '0.9rem',
                    }}
                  >
                    Upcoming Events
                  </Typography>
                </Box>

                <List sx={{ p: 0 }}>
                  {[
                    { id: 1, title: "Mid-term Exam", date: "Dec 15", type: "exam" },
                    { id: 2, title: "Project Submission", date: "Dec 20", type: "assignment" },
                    { id: 3, title: "Holiday Break", date: "Dec 25", type: "holiday" },
                  ].map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          px: 0,
                          py: 0.75,
                          borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: 
                                event.type === 'exam' ? '#ef4444' :
                                event.type === 'assignment' ? '#f59e0b' : '#10b981',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: '#1e293b',
                                fontSize: '0.8rem',
                                lineHeight: 1.3,
                              }}
                            >
                              {event.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748b',
                                fontSize: '0.7rem',
                              }}
                            >
                              {event.date}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PremiumDashboard;