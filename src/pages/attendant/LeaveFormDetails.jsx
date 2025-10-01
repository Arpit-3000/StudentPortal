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
  TextField,
  IconButton,
} from '@mui/material';
import {
  EventNote as LeaveIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as VerifyIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { nonTeachingAPI } from '../../services/api';

const LeaveFormDetails = ({ formId, onBack, onVerify }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const statusConfig = {
    pending: {
      color: 'warning',
      label: 'Pending',
      description: 'Awaiting verification',
    },
    verified_by_attendant: {
      color: 'info',
      label: 'Verified by Attendant',
      description: 'Verified by attendant, awaiting approval',
    },
    approved: {
      color: 'success',
      label: 'Approved',
      description: 'Leave request has been approved',
    },
    rejected: {
      color: 'error',
      label: 'Rejected',
      description: 'Leave request has been rejected',
    },
    rejected_by_attendant: {
      color: 'error',
      label: 'Rejected by Attendant',
      description: 'Leave request has been rejected by attendant',
    },
    cancelled: {
      color: 'default',
      label: 'Cancelled',
      description: 'Leave request has been cancelled',
    },
  };

  useEffect(() => {
    fetchFormDetails();
  }, [formId]);

  const fetchFormDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await nonTeachingAPI.getFormDetails(formId);
      
      if (response.data.success) {
        setFormData(response.data.data.leaveForm);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch form details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!remarks.trim()) {
      alert('Please enter remarks for verification');
      return;
    }

    setVerifying(true);

    try {
      const response = await nonTeachingAPI.verifyForm(formId, { remarks });
      
      if (response.data.success) {
        setVerifyDialogOpen(false);
        setRemarks('');
        fetchFormDetails(); // Refresh form data
        if (onVerify) {
          onVerify();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify form. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      alert('Rejection reason must be at least 10 characters long');
      return;
    }

    if (rejectionReason.trim().length > 200) {
      alert('Rejection reason must not exceed 200 characters');
      return;
    }

    setRejecting(true);

    try {
      const response = await nonTeachingAPI.rejectForm(formId, { rejectionReason: rejectionReason.trim() });
      
      if (response.data.success) {
        setRejectDialogOpen(false);
        setRejectionReason('');
        fetchFormDetails(); // Refresh form data
        if (onVerify) {
          onVerify();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject form. Please try again.');
    } finally {
      setRejecting(false);
    }
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
  const canVerify = formData.status === 'pending';
  const canReject = formData.status === 'pending';

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <LeaveIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Leave Form Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Form ID: {formId}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {canVerify && (
              <Button
                variant="contained"
                startIcon={<VerifyIcon />}
                onClick={() => setVerifyDialogOpen(true)}
                color="success"
              >
                Verify Form
              </Button>
            )}
            {canReject && (
              <Button
                variant="contained"
                startIcon={<RejectIcon />}
                onClick={() => setRejectDialogOpen(true)}
                color="error"
              >
                Reject Form
              </Button>
            )}
          </Box>
        </Box>

        {/* Status Card */}
        <Card sx={{ mb: 3, backgroundColor: `${status.color}.light` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {status.label}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {status.description}
            </Typography>
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
              {formData.studentName || formData.student?.name || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Roll Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.rollNumber || formData.student?.rollNumber || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.student?.department || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Year
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.student?.year || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.studentPhone || formData.student?.phone || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.student?.email || 'N/A'}
            </Typography>
          </Grid>

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
              {formData.hostelName || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Room Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formData.roomNumber || 'N/A'}
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
              {formData.reason || 'N/A'}
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
                {formData.approvedBy.name || formData.approvedBy}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button variant="outlined" onClick={onBack}>
            Back to Forms
          </Button>
          {canVerify && (
            <Button 
              variant="contained" 
              onClick={() => setVerifyDialogOpen(true)}
              startIcon={<VerifyIcon />}
              color="success"
            >
              Verify Form
            </Button>
          )}
          {canReject && (
            <Button 
              variant="contained" 
              onClick={() => setRejectDialogOpen(true)}
              startIcon={<RejectIcon />}
              color="error"
            >
              Reject Form
            </Button>
          )}
        </Box>
      </Paper>

      {/* Verify Dialog */}
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Verify Leave Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Verification Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter your verification remarks..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleVerify} 
            variant="contained" 
            disabled={verifying || !remarks.trim()}
            startIcon={verifying ? <CircularProgress size={20} /> : <VerifyIcon />}
          >
            {verifying ? 'Verifying...' : 'Verify Form'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Leave Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection (10-200 characters)..."
            inputProps={{ maxLength: 200 }}
            helperText={`${rejectionReason.length}/200 characters (minimum 10 characters required)`}
            error={rejectionReason.length > 0 && (rejectionReason.length < 10 || rejectionReason.length > 200)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            disabled={rejecting || !rejectionReason.trim() || rejectionReason.length < 10 || rejectionReason.length > 200}
            startIcon={rejecting ? <CircularProgress size={20} /> : <RejectIcon />}
            color="error"
          >
            {rejecting ? 'Rejecting...' : 'Reject Form'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveFormDetails;
