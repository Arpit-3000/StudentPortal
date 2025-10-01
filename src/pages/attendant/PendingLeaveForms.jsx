import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  EventNote as LeaveIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as VerifyIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { nonTeachingAPI } from '../../services/api';

const PendingLeaveForms = ({ onViewForm, showVerifyOnly = false }) => {
  const [leaveForms, setLeaveForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPendingForms: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    hostelName: '',
    rollNumber: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPendingForms = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.hostelName && { hostelName: filters.hostelName }),
        ...(filters.rollNumber && { rollNumber: filters.rollNumber }),
      };

      const response = await nonTeachingAPI.getPendingForms(params);
      
      if (response.data.success) {
        setLeaveForms(response.data.data.leaveForms);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingForms();
  }, [filters]);

  const handlePageChange = (event, page) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleRefresh = () => {
    fetchPendingForms();
  };

  const handleHostelFilter = (hostelName) => {
    setFilters(prev => ({
      ...prev,
      hostelName,
      page: 1,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
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

  if (loading && leaveForms.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LeaveIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {showVerifyOnly ? 'Verify Leave Forms' : 'Pending Leave Forms'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by student name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Hostel</InputLabel>
            <Select
              value={filters.hostelName}
              onChange={(e) => handleHostelFilter(e.target.value)}
              label="Hostel"
            >
              <MenuItem value="">All Hostels</MenuItem>
              <MenuItem value="Boys Hostel A">Boys Hostel A</MenuItem>
              <MenuItem value="Boys Hostel B">Boys Hostel B</MenuItem>
              <MenuItem value="Girls Hostel A">Girls Hostel A</MenuItem>
              <MenuItem value="Girls Hostel B">Girls Hostel B</MenuItem>
              <MenuItem value="Boys Hostel C">Boys Hostel C</MenuItem>
              <MenuItem value="Girls Hostel C">Girls Hostel C</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Leave Forms Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Student Details</strong></TableCell>
                <TableCell><strong>Hostel & Room</strong></TableCell>
                <TableCell><strong>Leave Period</strong></TableCell>
                <TableCell><strong>Duration</strong></TableCell>
                <TableCell><strong>Reason</strong></TableCell>
                <TableCell><strong>Submitted</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveForms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No pending leave forms found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leaveForms
                  .filter(form => 
                    !searchTerm || 
                    form.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    form.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((form) => (
                    <TableRow key={form.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {form.studentName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Roll: {form.rollNumber || 'N/A'}
                        </Typography>
                        {form.studentId?.department && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {form.studentId.department} - {form.studentId.year}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {form.hostelName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Room: {form.roomNumber || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(form.exitDate)} - {formatDate(form.entryDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {form.exitTime} - {form.entryTime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${getDuration(form.exitDate, form.entryDate)} days`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 200, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {form.reason || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(form.submittedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => onViewForm(form.id)}
                            color="primary"
                            title="View Details"
                          >
                            <ViewIcon />
                          </IconButton>
                          {showVerifyOnly && (
                            <IconButton
                              size="small"
                              onClick={() => onViewForm(form.id)}
                              color="success"
                              title="Verify Form"
                            >
                              <VerifyIcon />
                            </IconButton>
                          )}
                          {form.status === 'pending' && (
                            <IconButton
                              size="small"
                              onClick={() => onViewForm(form.id)}
                              color="error"
                              title="Reject Form"
                            >
                              <RejectIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* Summary */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {leaveForms.length} of {pagination.totalPendingForms} pending forms
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page {pagination.currentPage} of {pagination.totalPages}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PendingLeaveForms;
