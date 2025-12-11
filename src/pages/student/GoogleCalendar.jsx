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
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import calendarService from '../../services/calendarService.js';

const GoogleCalendar = () => {
  const { calendarAuth, signInCalendar, signOutCalendar } = useGoogleAuth();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const handleSignIn = async () => {
    setError('');
    
    try {
      const result = await signInCalendar();
      
      if (result.success) {
        await loadEvents();
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
      const result = await signOutCalendar();
      
      if (result.success) {
        setEvents([]);
        setError('');
      } else {
        setError(result.error || 'Failed to sign out');
      }
    } catch (error) {
      setError('An error occurred during sign out');
      console.error('Sign out error:', error);
    }
  };

  const loadEvents = async () => {
    setRefreshing(true);
    setError('');
    
    try {
      // Load events for the current month
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);
      
      const result = await calendarService.getEvents(
        startOfMonth.toISOString(),
        endOfMonth.toISOString()
      );
      
      if (result.success) {
        setEvents(result.events);
      } else {
        setError(result.error || 'Failed to load events');
      }
    } catch (error) {
      setError('An error occurred while loading events');
      console.error('Load events error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadEventsForDate = async (date) => {
    try {
      const result = await calendarService.getEventsForDate(date);
      return result.success ? result.events : [];
    } catch (error) {
      console.error('Error loading events for date:', error);
      return [];
    }
  };

  useEffect(() => {
    if (calendarAuth.isSignedIn) {
      loadEvents();
    }
  }, [calendarAuth.isSignedIn, currentMonth]);

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.startTime || !eventForm.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const startDateTime = new Date(`${eventForm.date}T${eventForm.startTime}`);
      const endDateTime = new Date(`${eventForm.date}T${eventForm.endTime}`);

      if (endDateTime <= startDateTime) {
        setError('End time must be after start time');
        return;
      }

      const result = await calendarService.createEvent({
        summary: eventForm.title,
        description: eventForm.description,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        location: eventForm.location,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      if (result.success) {
        setCreateDialogOpen(false);
        setEventForm({
          title: '',
          description: '',
          date: '',
          startTime: '',
          endTime: '',
          location: '',
        });
        await loadEvents();
      } else {
        setError(result.error || 'Failed to create event');
      }
    } catch (error) {
      setError('Error creating event: ' + error.message);
    }
  };

  const handleEditEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.startTime || !eventForm.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const startDateTime = new Date(`${eventForm.date}T${eventForm.startTime}`);
      const endDateTime = new Date(`${eventForm.date}T${eventForm.endTime}`);

      if (endDateTime <= startDateTime) {
        setError('End time must be after start time');
        return;
      }

      const result = await calendarService.updateEvent(selectedEvent.id, {
        summary: eventForm.title,
        description: eventForm.description,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        location: eventForm.location,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      if (result.success) {
        setEditDialogOpen(false);
        setSelectedEvent(null);
        setEventForm({
          title: '',
          description: '',
          date: '',
          startTime: '',
          endTime: '',
          location: '',
        });
        await loadEvents();
      } else {
        setError(result.error || 'Failed to update event');
      }
    } catch (error) {
      setError('Error updating event: ' + error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const result = await calendarService.deleteEvent(eventId);
      
      if (result.success) {
        await loadEvents();
      } else {
        setError(result.error || 'Failed to delete event');
      }
    } catch (error) {
      setError('Error deleting event: ' + error.message);
    }
  };

  const openCreateDialog = (date) => {
    const dateStr = calendarService.formatDateForInput(date || selectedDate);
    setEventForm({
      ...eventForm,
      date: dateStr,
      startTime: '09:00',
      endTime: '10:00',
    });
    setCreateDialogOpen(true);
  };

  const openEditDialog = (event) => {
    const startDate = new Date(event.start.dateTime || event.start.date);
    const endDate = new Date(event.end.dateTime || event.end.date);
    
    setSelectedEvent(event);
    setEventForm({
      title: event.summary || '',
      description: event.description || '',
      date: calendarService.formatDateForInput(startDate),
      startTime: calendarService.formatTimeForInput(startDate),
      endTime: calendarService.formatTimeForInput(endDate),
      location: event.location || '',
    });
    setEditDialogOpen(true);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['1', '2', '3', '4', '5'];

  if (!calendarAuth.isSignedIn) {
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
            <CalendarIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Google Calendar
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Connect your Google Calendar to view and manage your events, tasks, and schedule
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={calendarAuth.loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              onClick={handleSignIn}
              disabled={calendarAuth.loading}
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
              {calendarAuth.loading ? 'Signing In...' : 'Sign in with Google Calendar'}
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

  const daysInMonth = getDaysInMonth(currentMonth);
  const calendarDays = [];

  // Add all days of the month in groups of 5
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  }

  const selectedDateEvents = getEventsForDate(selectedDate);
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

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
                src={calendarAuth.user?.imageUrl}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {calendarAuth.user?.name ? getInitials(calendarAuth.user.name) : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Google Calendar
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {calendarAuth.user?.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    onClick={loadEvents}
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
                    disabled={calendarAuth.loading}
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

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Calendar Card - Centered */}
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, maxWidth: 900, width: '100%' }}>
            <CardContent sx={{ p: 3.5 }}>
              {/* Month Navigation */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <IconButton 
                    onClick={() => navigateMonth(-1)} 
                    size="small"
                    sx={{ 
                      color: '#667eea',
                      '&:hover': { backgroundColor: '#f0f4ff' }
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center', color: '#1e293b', fontSize: '1.1rem' }}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </Typography>
                  <IconButton 
                    onClick={() => navigateMonth(1)} 
                    size="small"
                    sx={{ 
                      color: '#667eea',
                      '&:hover': { backgroundColor: '#f0f4ff' }
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<TodayIcon />}
                    onClick={goToToday}
                    size="small"
                    sx={{
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        borderColor: '#667eea',
                        backgroundColor: '#f0f4ff',
                      },
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => openCreateDialog(selectedDate)}
                    size="small"
                    sx={{
                      backgroundColor: '#667eea',
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2.5,
                      fontWeight: 600,
                      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)',
                      '&:hover': {
                        backgroundColor: '#5a67d8',
                        boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    Add Event
                  </Button>
                </Box>
              </Box>

                {/* Calendar Grid */}
                <Box>
                  {/* Day Headers */}
                  <Grid container spacing={0}>
                    {dayNames.map(day => (
                      <Grid 
                        item 
                        xs 
                        key={day} 
                        sx={{ 
                          aspectRatio: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRight: '1px solid #e2e8f0',
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          '&:last-child': {
                            borderRight: 'none',
                          }
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem' }}>
                          {day}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Calendar Days - Square Format */}
                  <Grid container spacing={0}>
                    {calendarDays.map((date, index) => {
                      const dayEvents = date ? getEventsForDate(date) : [];
                      const hasEvents = dayEvents.length > 0;
                      const isTodayDate = isToday(date);
                      const isSelectedDate = isSelected(date);

                      return (
                        <Grid 
                          item 
                          xs 
                          key={index}
                          sx={{
                            aspectRatio: '1',
                            borderRight: '1px solid #e2e8f0',
                            borderBottom: '1px solid #e2e8f0',
                            '&:nth-child(5n)': {
                              borderRight: 'none',
                            }
                          }}
                        >
                          {date ? (
                            <Box
                              onClick={() => setSelectedDate(date)}
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: isSelectedDate 
                                  ? '#dbeafe' 
                                  : isTodayDate
                                  ? '#d1fae5'
                                  : '#ffffff',
                                '&:hover': {
                                  backgroundColor: isSelectedDate ? '#bfdbfe' : isTodayDate ? '#a7f3d0' : '#f8fafc',
                                },
                              }}
                            >
                              {/* Date Number - Perfectly Centered */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  backgroundColor: isSelectedDate 
                                    ? '#3b82f6' 
                                    : isTodayDate
                                    ? '#10b981'
                                    : 'transparent',
                                  transition: 'all 0.2s ease',
                                  mb: hasEvents ? 1 : 0,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: isTodayDate ? 700 : isSelectedDate ? 600 : 500,
                                    color: isSelectedDate || isTodayDate ? '#ffffff' : '#111827',
                                    fontSize: '0.9rem',
                                    lineHeight: 1,
                                  }}
                                >
                                  {date.getDate()}
                                </Typography>
                              </Box>
                              {/* Event Dots - Centered Below Date */}
                              {hasEvents && (
                                <Box sx={{ 
                                  display: 'flex', 
                                  gap: 0.4, 
                                  flexWrap: 'wrap',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '100%',
                                  px: 1,
                                }}>
                                  {dayEvents.slice(0, 3).map((event, idx) => (
                                    <Box
                                      key={event.id}
                                      sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: idx === 0 ? '#667eea' : idx === 1 ? '#10b981' : '#f59e0b',
                                        flexShrink: 0,
                                      }}
                                    />
                                  ))}
                                  {dayEvents.length > 3 && (
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        color: '#64748b', 
                                        fontSize: '0.65rem',
                                        lineHeight: 1,
                                        ml: 0.25,
                                      }}
                                    >
                                      +{dayEvents.length - 3}
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Box sx={{ width: '100%', height: '100%', backgroundColor: '#fafafa' }} />
                          )}
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
        </Box>

        {/* Create Event Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 2 }}>Create New Event</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="Event Title"
                required
                fullWidth
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                label="Date"
                type="date"
                required
                fullWidth
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start Time"
                  type="time"
                  required
                  fullWidth
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  label="End Time"
                  type="time"
                  required
                  fullWidth
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              <TextField
                label="Location"
                fullWidth
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={() => setCreateDialogOpen(false)}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEvent} 
              variant="contained" 
              sx={{ 
                backgroundColor: '#667eea',
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': { 
                  backgroundColor: '#5a67d8' 
                }
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 2 }}>Edit Event</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="Event Title"
                required
                fullWidth
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                label="Date"
                type="date"
                required
                fullWidth
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start Time"
                  type="time"
                  required
                  fullWidth
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  label="End Time"
                  type="time"
                  required
                  fullWidth
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              <TextField
                label="Location"
                fullWidth
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={() => setEditDialogOpen(false)}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditEvent} 
              variant="contained" 
              sx={{ 
                backgroundColor: '#667eea',
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': { 
                  backgroundColor: '#5a67d8' 
                }
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default GoogleCalendar;

