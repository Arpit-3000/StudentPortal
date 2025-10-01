import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  EventNote as LeaveIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const LeaveFormDetails = ({ formId, onBack, onEdit }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusConfig = {
    pending: {
      color: 'warning',
      label: 'Pending',
      icon: <PendingIcon />,
      description: 'Your leave request is under review',
    },
    approved: {
      color: 'success',
      label: 'Approved',
      icon: <CheckCircleIcon />,
      description: 'Your leave request has been approved',
    },
    rejected: {
      color: 'error',
      label: 'Rejected',
      icon: <CancelIcon />,
      description: 'Your leave request has been rejected',
    },
    cancelled: {
      color: 'default',
      label: 'Cancelled',
      icon: <CancelIcon />,
      description: 'Your leave request has been cancelled',
    },
  };

  useEffect(() => {
    fetchFormDetails();
  }, [formId]);

  const fetchFormDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentAPI.getLeaveForm(formId);
      
      if (response.data.success) {
        setFormData(response.data.data.leaveForm);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch form details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const response = await studentAPI.deleteLeaveForm(formId);
      
      if (response.data.success) {
        setDeleteDialogOpen(false);
        onBack(); // Go back to the list
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete leave form. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (exitDate, entryDate) => {
    const exit = new Date(exitDate);
    const entry = new Date(entryDate);
    const diffTime = Math.abs(entry - exit);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Forms
        </Button>
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Form not found
        </Alert>
        <Button variant="outlined" onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Forms
        </Button>
      </Box>
    );
  }

  const status = statusConfig[formData.status] || statusConfig.pending;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <LeaveIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Leave Form Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Form ID: {formData.id}
            </Typography>
          </Box>
        </Box>

        {/* Status Card */}
        <Card sx={{ mb: 3, backgroundColor: `${status.color}.light` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {status.icon}
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                {status.label}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {status.description}
            </Typography>
            {formData.rejectionReason && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <strong>Rejection Reason:</strong> {formData.rejectionReason}
              </Alert>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Student Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              Student Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Student Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.studentName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Roll Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.rollNumber}
            </Typography>
          </Grid>

          {formData.studentPhone && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Student Phone
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {formData.studentPhone}
              </Typography>
            </Grid>
          )}

          {/* Hostel Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
              Hostel Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Hostel Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.hostelName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Room Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.roomNumber}
            </Typography>
          </Grid>

          {/* Leave Schedule */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
              Leave Schedule
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Exit Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formatDate(formData.exitDate)} at {formData.exitTime}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Entry Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formatDate(formData.entryDate)} at {formData.entryTime}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Leave Duration
            </Typography>
            <Chip
              label={`${formData.leaveDuration || getDuration(formData.exitDate, formData.entryDate)} days`}
              color="primary"
              variant="outlined"
            />
          </Grid>

          {/* Reason */}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Reason for Leave
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>
              {formData.reason}
            </Typography>
          </Grid>

          {/* Emergency Contact */}
          {formData.emergencyContact && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Emergency Contact
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Contact Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formData.emergencyContact.name}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formData.emergencyContact.phone}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Relation
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formData.emergencyContact.relation}
                </Typography>
              </Grid>
            </>
          )}

          {/* Timestamps */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Timeline
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Submitted At
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formatDateTime(formData.submittedAt)}
            </Typography>
          </Grid>

          {formData.approvedAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {formData.status === 'approved' ? 'Approved At' : 'Processed At'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {formatDateTime(formData.approvedAt)}
              </Typography>
            </Grid>
          )}

          {formData.approvedBy && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Processed By
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {formData.approvedBy}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button variant="outlined" onClick={onBack}>
            Back to Forms
          </Button>
          {formData.status === 'pending' && onEdit && (
            <Button variant="contained" onClick={() => onEdit(formData.id)}>
              Edit Form
            </Button>
          )}
          {formData.status === 'pending' && (
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleDeleteClick}
              startIcon={<DeleteIcon />}
            >
              Delete Form
            </Button>
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Leave Form</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this leave form? This action cannot be undone.
          </Typography>
          {formData && (
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Leave Period:</strong> {formatDate(formData.exitDate)} - {formatDate(formData.entryDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Reason:</strong> {formData.reason?.substring(0, 100)}{formData.reason?.length > 100 ? '...' : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {status.label}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? 'Deleting...' : 'Delete Form'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveFormDetails;
