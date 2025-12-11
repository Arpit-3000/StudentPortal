import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Stack,
  List,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  School as SchoolIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
  Announcement as AnnouncementIcon,
  OpenInNew as OpenInNewIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Class as ClassIcon,
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  AttachFile as AttachFileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import classroomService from '../../services/classroomService.js';

const GoogleClassroom = () => {
  const { classroomAuth, signInClassroom, signOutClassroom } = useGoogleAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [coursework, setCoursework] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [submissions, setSubmissions] = useState({}); // Map of courseworkId -> submission
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState({}); // Map of courseworkId -> boolean
  const [expandedCoursework, setExpandedCoursework] = useState(null);

  const handleSignIn = async () => {
    setError('');
    
    try {
      const result = await signInClassroom();
      
      if (result.success) {
        await loadCourses();
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (error) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOutClassroom();
      
      if (result.success) {
        setCourses([]);
        setSelectedCourse(null);
        setCoursework([]);
        setAnnouncements([]);
        setTeachers([]);
        setError('');
      } else {
        setError(result.error || 'Failed to sign out');
      }
    } catch (error) {
      setError('An error occurred during sign out');
      console.error('Sign out error:', error);
    }
  };

  const loadCourses = async () => {
    setRefreshing(true);
    setError('');
    
    try {
      const result = await classroomService.getCourses();
      
      if (result.success) {
        setCourses(result.courses);
        if (result.courses.length > 0 && !selectedCourse) {
          setSelectedCourse(result.courses[0]);
        }
      } else {
        setError(result.error || 'Failed to load courses');
      }
    } catch (error) {
      setError('An error occurred while loading courses');
      console.error('Load courses error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadCourseDetails = async (courseId) => {
    setLoadingDetails(true);
    setError('');
    
    try {
      console.log('Loading course details for course:', courseId);
      
      // Load coursework, announcements, and teachers in parallel
      const [courseworkResult, announcementsResult, rosterResult] = await Promise.all([
        classroomService.getCoursework(courseId, 20),
        classroomService.getAnnouncements(courseId, 20),
        classroomService.getRoster(courseId)
      ]);

      console.log('Coursework result:', courseworkResult);
      console.log('Announcements result:', announcementsResult);
      console.log('Roster result:', rosterResult);

      if (courseworkResult.success) {
        console.log('Coursework fetched successfully:', courseworkResult.coursework.length, 'items');
        setCoursework(courseworkResult.coursework);
        
        // Load submissions for each coursework
        const submissionsMap = {};
        for (const cw of courseworkResult.coursework) {
          const submissionResult = await classroomService.getStudentSubmission(courseId, cw.id);
          if (submissionResult.success && submissionResult.submission) {
            submissionsMap[cw.id] = submissionResult.submission;
          }
        }
        setSubmissions(submissionsMap);
      } else {
        console.error('Failed to fetch coursework:', courseworkResult.error);
        setError(courseworkResult.error || 'Failed to load coursework');
      }
      
      if (announcementsResult.success) {
        setAnnouncements(announcementsResult.announcements);
      }
      
      if (rosterResult.success) {
        setTeachers(rosterResult.teachers || []);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
      setError('Failed to load course details: ' + error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenAttachment = (material) => {
    if (material.driveFile?.driveFile) {
      classroomService.openDriveFile(material.driveFile.driveFile);
    } else if (material.driveFile) {
      classroomService.openDriveFile(material.driveFile);
    } else if (material.link) {
      window.open(material.link.url, '_blank');
    }
  };

  const handleTurnInSubmission = async (courseId, courseworkId, submissionId) => {
    setSubmitting(prev => ({ ...prev, [courseworkId]: true }));
    setError('');
    
    try {
      const result = await classroomService.turnInSubmission(courseId, courseworkId, submissionId);
      
      if (result.success) {
        // Reload submission
        const submissionResult = await classroomService.getStudentSubmission(courseId, courseworkId);
        if (submissionResult.success) {
          setSubmissions(prev => ({
            ...prev,
            [courseworkId]: submissionResult.submission
          }));
        }
      } else {
        setError(result.error || 'Failed to turn in submission');
      }
    } catch (error) {
      setError('Error turning in submission: ' + error.message);
    } finally {
      setSubmitting(prev => ({ ...prev, [courseworkId]: false }));
    }
  };

  const handleReclaimSubmission = async (courseId, courseworkId, submissionId) => {
    setSubmitting(prev => ({ ...prev, [courseworkId]: true }));
    setError('');
    
    try {
      const result = await classroomService.reclaimSubmission(courseId, courseworkId, submissionId);
      
      if (result.success) {
        // Reload submission
        const submissionResult = await classroomService.getStudentSubmission(courseId, courseworkId);
        if (submissionResult.success) {
          setSubmissions(prev => ({
            ...prev,
            [courseworkId]: submissionResult.submission
          }));
        }
      } else {
        setError(result.error || 'Failed to reclaim submission');
      }
    } catch (error) {
      setError('Error reclaiming submission: ' + error.message);
    } finally {
      setSubmitting(prev => ({ ...prev, [courseworkId]: false }));
    }
  };

  const getSubmissionStatus = (submission) => {
    if (!submission) return 'not_started';
    if (submission.state === 'TURNED_IN') return 'turned_in';
    if (submission.state === 'RETURNED') return 'returned';
    if (submission.state === 'RECLAIMED_BY_STUDENT') return 'reclaimed';
    return 'draft';
  };

  useEffect(() => {
    if (classroomAuth.isSignedIn && courses.length === 0) {
      loadCourses();
    }
  }, [classroomAuth.isSignedIn]);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseDetails(selectedCourse.id);
    }
  }, [selectedCourse]);

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setActiveTab(0);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


  // Helper function to extract name string from profile object or string
  const getNameString = (name) => {
    if (!name) return '';
    
    // If it's already a string, return it
    if (typeof name === 'string') {
      return name;
    }
    
    // If it's an object with name properties
    if (typeof name === 'object') {
      // Try fullName first, then construct from givenName and familyName
      if (name.fullName) {
        return name.fullName;
      }
      if (name.givenName || name.familyName) {
        return [name.givenName, name.familyName].filter(Boolean).join(' ');
      }
    }
    
    return '';
  };

  const getInitials = (name) => {
    // First extract the name string
    const nameString = getNameString(name);
    
    // Handle null, undefined, or empty string
    if (!nameString || typeof nameString !== 'string') {
      return '?';
    }
    
    // Handle empty string
    if (nameString.trim().length === 0) {
      return '?';
    }
    
    try {
      const initials = nameString
        .split(' ')
        .filter(word => word.length > 0) // Filter out empty strings
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      return initials || '?';
    } catch (error) {
      console.error('Error generating initials:', error, nameString);
      return '?';
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'No due date';
    return classroomService.formatDate(dateObj);
  };

  const formatTime = (timeObj) => {
    if (!timeObj) return '';
    return classroomService.formatTime(timeObj);
  };

  const getCourseColor = (index) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea'
    ];
    return colors[index % colors.length];
  };

  const openInClassroom = (courseId) => {
    window.open(`https://classroom.google.com/c/${courseId}`, '_blank');
  };

  if (!classroomAuth.isSignedIn) {
    return (
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <SchoolIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Google Classroom
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Connect your Google Classroom account to view courses, assignments, and announcements
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={classroomAuth.loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              onClick={handleSignIn}
              disabled={classroomAuth.loading}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {classroomAuth.loading ? 'Signing In...' : 'Sign in with Google Classroom'}
            </Button>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={classroomAuth.user?.imageUrl}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {classroomAuth.user?.name ? getInitials(classroomAuth.user.name) : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Google Classroom
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {classroomAuth.user?.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    onClick={loadCourses}
                    disabled={refreshing}
                    sx={{
                      background: '#f8fafc',
                      '&:hover': { background: '#e2e8f0' }
                    }}
                  >
                    <RefreshIcon sx={{ color: '#6366f1' }} />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip title="Sign Out">
                <span>
                  <IconButton
                    onClick={handleSignOut}
                    disabled={classroomAuth.loading}
                    sx={{
                      background: '#fef2f2',
                      '&:hover': { background: '#fee2e2' }
                    }}
                  >
                    <LogoutIcon sx={{ color: '#dc2626' }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          
          <Divider />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Course Selection Dropdown */}
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: 2, 
            mb: 3,
            position: 'relative',
            zIndex: 1, // Ensure card is above background but below dropdown menu
          }}
        >
          <CardContent sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControl 
                sx={{ 
                  minWidth: 300, 
                  flex: 1,
                  position: 'relative',
                  zIndex: 2, // Higher than card
                }}
              >
                <InputLabel id="course-select-label">Select Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  id="course-select"
                  value={selectedCourse?.id || ''}
                  label="Select Course"
                  onChange={handleCourseChange}
                  disabled={refreshing || courses.length === 0}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 500,
                        mt: 1,
                        borderRadius: 2,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #e2e8f0',
                        p: 1.5,
                        '& .MuiList-root': {
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                          gap: 0.75,
                          p: 1,
                        },
                        '& .MuiMenuItem-root': {
                          borderRadius: 1.5,
                          p: 1.25,
                          minHeight: '48px',
                          height: 'auto',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                          fontSize: '0.875rem',
                          '&:hover': {
                            backgroundColor: '#f0f4ff',
                            borderColor: '#667eea',
                            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#e0e7ff',
                            borderColor: '#667eea',
                            borderWidth: '2px',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: '#c7d2fe',
                            },
                          },
                        },
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    // Prevent the menu from affecting layout
                    disablePortal: false,
                    // Ensure proper z-index
                    style: {
                      zIndex: 1300, // Higher than most Material-UI components
                    },
                  }}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.5,
                    },
                  }}
                >
                  {courses.length > 0 ? (
                    courses.map((course, index) => (
                      <MenuItem key={course.id} value={course.id} sx={{ width: '100%', justifyContent: 'center', py: 1.25 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 400,
                            color: '#111827',
                            textAlign: 'center',
                            width: '100%',
                            fontSize: '0.875rem',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {course.name || 'Unnamed Course'}
                        </Typography>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {refreshing ? 'Loading courses...' : 'No courses available'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              
              {courses.length > 0 && (
                <Chip 
                  label={`${courses.length} ${courses.length === 1 ? 'Course' : 'Courses'}`}
                  sx={{ 
                    backgroundColor: '#667eea', 
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Box>
          {selectedCourse ? (
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <CardContent>
                {/* Course Header */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: getCourseColor(
                            courses.findIndex(c => c.id === selectedCourse.id)
                          ),
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: 600,
                        }}
                      >
                        {selectedCourse.name ? getInitials(selectedCourse.name) : <ClassIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {selectedCourse.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {selectedCourse.section || 'No section'} • {selectedCourse.enrollmentCode || 'No code'}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="Open in Google Classroom">
                      <IconButton
                        onClick={() => openInClassroom(selectedCourse.id)}
                        sx={{
                          background: '#f8fafc',
                          '&:hover': { background: '#e2e8f0' }
                        }}
                      >
                        <OpenInNewIcon sx={{ color: '#6366f1' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Divider />
                </Box>

                  {/* Teacher/Admin Info */}
                  {teachers.length > 0 && (
                    <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1.5 }}>
                        Teacher/Admin
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {teachers.map((teacher) => (
                          <Box key={teacher.userId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: '#667eea',
                                color: 'white',
                              }}
                            >
                              {teacher.profile?.name ? getInitials(teacher.profile.name) : <PersonIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                                {getNameString(teacher.profile?.name) || 'Teacher'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {teacher.profile?.emailAddress || ''}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                      <Tab 
                        icon={<AssignmentIcon />} 
                        iconPosition="start"
                        label="Coursework" 
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      />
                      <Tab 
                        icon={<AnnouncementIcon />} 
                        iconPosition="start"
                        label="Announcements" 
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      />
                    </Tabs>
                  </Box>

                  {/* Tab Content */}
                  {loadingDetails ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {/* Coursework Tab */}
                      {activeTab === 0 && (
                        <Box>
                          {coursework.length > 0 ? (
                            <Stack spacing={2}>
                              {coursework.map((cw) => {
                                const submission = submissions[cw.id];
                                const status = getSubmissionStatus(submission);
                                const isExpanded = expandedCoursework === cw.id;
                                
                                return (
                                  <Card
                                    key={cw.id}
                                    elevation={0}
                                    sx={{
                                      border: '1px solid #e2e8f0',
                                      borderRadius: 2,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        borderColor: '#9ca3af',
                                      },
                                    }}
                                  >
                                    <CardContent>
                                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                                        <AssignmentIcon sx={{ color: '#667eea', mt: 0.5 }} />
                                        <Box sx={{ flex: 1 }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                              {cw.title}
                                            </Typography>
                                            <IconButton
                                              size="small"
                                              onClick={() => setExpandedCoursework(isExpanded ? null : cw.id)}
                                            >
                                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                          </Box>
                                          
                                          {cw.description && (
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                              {cw.description}
                                            </Typography>
                                          )}
                                          
                                          {/* Attachments */}
                                          {cw.materials && cw.materials.length > 0 && (
                                            <Box sx={{ mb: 2 }}>
                                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
                                                Attachments:
                                              </Typography>
                                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {cw.materials.map((material, idx) => (
                                                  <Chip
                                                    key={idx}
                                                    icon={<AttachFileIcon />}
                                                    label={material.driveFile?.driveFile?.title || material.link?.title || 'Attachment'}
                                                    size="small"
                                                    onClick={() => handleOpenAttachment(material)}
                                                    sx={{
                                                      backgroundColor: '#f3f4f6',
                                                      color: '#374151',
                                                      cursor: 'pointer',
                                                      '&:hover': {
                                                        backgroundColor: '#e5e7eb',
                                                      },
                                                    }}
                                                  />
                                                ))}
                                              </Stack>
                                            </Box>
                                          )}
                                          
                                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                                            {cw.dueDate && (
                                              <Chip
                                                icon={<CalendarIcon />}
                                                label={`Due: ${formatDate(cw.dueDate)} ${cw.dueTime ? formatTime(cw.dueTime) : ''}`}
                                                size="small"
                                                sx={{
                                                  backgroundColor: '#fef3c7',
                                                  color: '#92400e',
                                                }}
                                              />
                                            )}
                                            {cw.maxPoints && (
                                              <Chip
                                                label={`${cw.maxPoints} points`}
                                                size="small"
                                                sx={{
                                                  backgroundColor: '#dbeafe',
                                                  color: '#1e40af',
                                                }}
                                              />
                                            )}
                                            {cw.workType && (
                                              <Chip
                                                label={cw.workType}
                                                size="small"
                                                sx={{
                                                  backgroundColor: '#e0e7ff',
                                                  color: '#3730a3',
                                                }}
                                              />
                                            )}
                                            {/* Submission Status */}
                                            {status === 'turned_in' && (
                                              <Chip
                                                icon={<CheckCircleIcon />}
                                                label="Turned In"
                                                size="small"
                                                sx={{
                                                  backgroundColor: '#d1fae5',
                                                  color: '#065f46',
                                                }}
                                              />
                                            )}
                                            {status === 'returned' && (
                                              <Chip
                                                icon={<CheckCircleIcon />}
                                                label="Returned"
                                                size="small"
                                                sx={{
                                                  backgroundColor: '#dbeafe',
                                                  color: '#1e40af',
                                                }}
                                              />
                                            )}
                                            {status === 'draft' && (
                                              <Chip
                                                label="Draft"
                                                size="small"
                                                sx={{
                                                  backgroundColor: '#fef3c7',
                                                  color: '#92400e',
                                                }}
                                              />
                                            )}
                                          </Box>
                                          
                                          {/* Submission Actions */}
                                          {submission && (
                                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                              {status === 'draft' && (
                                                <Button
                                                  variant="contained"
                                                  size="small"
                                                  startIcon={<SendIcon />}
                                                  onClick={() => handleTurnInSubmission(selectedCourse.id, cw.id, submission.id)}
                                                  disabled={submitting[cw.id]}
                                                  sx={{
                                                    backgroundColor: '#10b981',
                                                    '&:hover': { backgroundColor: '#059669' },
                                                  }}
                                                >
                                                  {submitting[cw.id] ? 'Turning In...' : 'Turn In'}
                                                </Button>
                                              )}
                                              {status === 'turned_in' && (
                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  startIcon={<VisibilityIcon />}
                                                  onClick={() => handleReclaimSubmission(selectedCourse.id, cw.id, submission.id)}
                                                  disabled={submitting[cw.id]}
                                                >
                                                  {submitting[cw.id] ? 'Reclaiming...' : 'Unsubmit'}
                                                </Button>
                                              )}
                                              <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<OpenInNewIcon />}
                                                onClick={() => window.open(`https://classroom.google.com/c/${selectedCourse.id}/a/${cw.id}`, '_blank')}
                                              >
                                                Open in Classroom
                                              </Button>
                                            </Box>
                                          )}
                                          
                                          {!submission && (
                                            <Button
                                              variant="outlined"
                                              size="small"
                                              startIcon={<OpenInNewIcon />}
                                              onClick={() => window.open(`https://classroom.google.com/c/${selectedCourse.id}/a/${cw.id}`, '_blank')}
                                              sx={{ mt: 2 }}
                                            >
                                              View Assignment
                                            </Button>
                                          )}
                                        </Box>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </Stack>
                          ) : (
                            <Paper
                              elevation={0}
                              sx={{
                                p: 4,
                                textAlign: 'center',
                                border: '2px dashed #e2e8f0',
                                borderRadius: 2,
                              }}
                            >
                              <AssignmentIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                No coursework found
                              </Typography>
                              {error && (
                                <Typography variant="caption" sx={{ color: '#dc2626', display: 'block', mt: 1 }}>
                                  Error: {error}
                                </Typography>
                              )}
                            </Paper>
                          )}
                        </Box>
                      )}

                      {/* Announcements Tab */}
                      {activeTab === 1 && (
                        <Box>
                          {announcements.length > 0 ? (
                            <Stack spacing={2}>
                              {announcements.map((announcement) => (
                                <Card
                                  key={announcement.id}
                                  elevation={0}
                                  sx={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      borderColor: '#9ca3af',
                                    },
                                  }}
                                >
                                  <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                                      <AnnouncementIcon sx={{ color: '#f59e0b', mt: 0.5 }} />
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                          {announcement.text || 'Announcement'}
                                        </Typography>
                                        {announcement.materials && announcement.materials.length > 0 && (
                                          <Box sx={{ mt: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                              Attachments:
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                                              {announcement.materials.map((material, idx) => (
                                                <Chip
                                                  key={idx}
                                                  icon={<AttachFileIcon />}
                                                  label={material.driveFile?.driveFile?.title || material.link?.title || 'Attachment'}
                                                  size="small"
                                                  onClick={() => handleOpenAttachment(material)}
                                                  sx={{
                                                    backgroundColor: '#f3f4f6',
                                                    color: '#374151',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                      backgroundColor: '#e5e7eb',
                                                    },
                                                  }}
                                                />
                                              ))}
                                            </Stack>
                                          </Box>
                                        )}
                                        {announcement.creationTime && (
                                          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mt: 1 }}>
                                            {new Date(announcement.creationTime).toLocaleString()}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                            </Stack>
                          ) : (
                            <Paper
                              elevation={0}
                              sx={{
                                p: 4,
                                textAlign: 'center',
                                border: '2px dashed #e2e8f0',
                                borderRadius: 2,
                              }}
                            >
                              <AnnouncementIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                No announcements found
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      )}

                    </>
                  )}
                </CardContent>
              </Card>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed #e2e8f0',
                borderRadius: 2,
              }}
            >
              <SchoolIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                Select a course
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                Choose a course from the dropdown above to view details, assignments, and announcements.
              </Typography>
            </Paper>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default GoogleClassroom;

