import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  EventNote as LeaveIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const ApplyLeaveForm = ({ onFormSubmit, onViewForms }) => {
  const [formData, setFormData] = useState({
    hostelName: '',
    roomNumber: '',
    exitDate: null,
    entryDate: null,
    exitTime: null,
    entryTime: null,
    reason: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hostelOptions = [
    'Boys Hostel A',
    'Boys Hostel B',
    'Girls Hostel A',
    'Girls Hostel B',
    'Boys Hostel C',
    'Girls Hostel C',
  ];

  const relationOptions = [
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Guardian',
    'Other',
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.hostelName) errors.push('Hostel name is required');
    if (!formData.roomNumber) errors.push('Room number is required');
    if (!formData.exitDate) errors.push('Exit date is required');
    if (!formData.entryDate) errors.push('Entry date is required');
    if (!formData.exitTime) errors.push('Exit time is required');
    if (!formData.entryTime) errors.push('Entry time is required');
    if (!formData.reason.trim()) errors.push('Reason is required');
    
    // Validate reason length (10-500 characters as per server validation)
    if (formData.reason.trim() && formData.reason.trim().length < 10) {
      errors.push('Reason must be at least 10 characters long');
    }
    if (formData.reason.trim() && formData.reason.trim().length > 500) {
      errors.push('Reason must not exceed 500 characters');
    }
    if (!formData.emergencyContact.name.trim()) errors.push('Emergency contact name is required');
    if (!formData.emergencyContact.phone.trim()) errors.push('Emergency contact phone is required');
    if (!formData.emergencyContact.relation) errors.push('Emergency contact relation is required');

    // Validate dates
    if (formData.exitDate && formData.entryDate) {
      const exitDate = new Date(formData.exitDate);
      const entryDate = new Date(formData.entryDate);
      if (exitDate >= entryDate) {
        errors.push('Entry date must be after exit date');
      }
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.emergencyContact.phone && !phoneRegex.test(formData.emergencyContact.phone)) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    // Additional validation for date/time objects
    if (formData.exitDate && !(formData.exitDate instanceof Date) && !formData.exitDate.getTime) {
      errors.push('Invalid exit date format');
    }
    if (formData.entryDate && !(formData.entryDate instanceof Date) && !formData.entryDate.getTime) {
      errors.push('Invalid entry date format');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);

    try {
      // Format dates and times properly
      const formatDate = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
      };

      const formatTime = (time) => {
        if (!time) return null;
        // Handle both Date objects and time strings
        if (time instanceof Date) {
          return time.toTimeString().slice(0, 5);
        }
        return time;
      };

      const submitData = {
        hostelName: formData.hostelName,
        roomNumber: formData.roomNumber,
        exitDate: formatDate(formData.exitDate),
        entryDate: formatDate(formData.entryDate),
        exitTime: formatTime(formData.exitTime),
        entryTime: formatTime(formData.entryTime),
        reason: formData.reason,
        emergencyContact: {
          name: formData.emergencyContact.name,
          phone: formData.emergencyContact.phone,
          relation: formData.emergencyContact.relation,
        },
      };

      const response = await studentAPI.submitLeaveForm(submitData);
      
      if (response.data.success) {
        setSuccess('Leave form submitted successfully!');
        setFormData({
          hostelName: '',
          roomNumber: '',
          exitDate: null,
          entryDate: null,
          exitTime: null,
          entryTime: null,
          reason: '',
          emergencyContact: {
            name: '',
            phone: '',
            relation: '',
          },
        });
        if (onFormSubmit) {
          onFormSubmit(response.data.data.leaveForm);
        }
      }
    } catch (err) {
      let errorMessage = 'Failed to submit leave form. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        
        // Handle validation errors from server
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          const validationErrors = err.response.data.errors.map(error => error.msg).join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid form data. Please check all fields and try again.';
      } else if (err.response?.status === 401) {
        errorMessage = 'You are not authorized. Please login again.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LeaveIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Apply for Leave
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Hostel Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Hostel Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Hostel Name</InputLabel>
                  <Select
                    value={formData.hostelName}
                    onChange={(e) => handleInputChange('hostelName', e.target.value)}
                    label="Hostel Name"
                  >
                    {hostelOptions.map((hostel) => (
                      <MenuItem key={hostel} value={hostel}>
                        {hostel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Room Number"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  placeholder="e.g., 101, 205"
                />
              </Grid>

              {/* Leave Dates and Times */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Leave Schedule
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Exit Date"
                  value={formData.exitDate}
                  onChange={(date) => handleInputChange('exitDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Entry Date"
                  value={formData.entryDate}
                  onChange={(date) => handleInputChange('entryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Exit Time"
                  value={formData.exitTime}
                  onChange={(time) => handleInputChange('exitTime', time)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Entry Time"
                  value={formData.entryTime}
                  onChange={(time) => handleInputChange('entryTime', time)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>

              {/* Reason */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Reason for Leave"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Please provide a detailed reason for your leave request (10-500 characters)..."
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.reason.length}/500 characters (minimum 10 characters required)`}
                  error={formData.reason.length > 0 && (formData.reason.length < 10 || formData.reason.length > 500)}
                />
              </Grid>

              {/* Emergency Contact */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Emergency Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Contact Name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  placeholder="Full name"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  placeholder="9876543210"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Relation</InputLabel>
                  <Select
                    value={formData.emergencyContact.relation}
                    onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                    label="Relation"
                  >
                    {relationOptions.map((relation) => (
                      <MenuItem key={relation} value={relation}>
                        {relation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={onViewForms}
                    disabled={loading}
                  >
                    View My Forms
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <LeaveIcon />}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? 'Submitting...' : 'Submit Leave Form'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ApplyLeaveForm;
