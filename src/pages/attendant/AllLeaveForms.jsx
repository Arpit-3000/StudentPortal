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
} from '@mui/icons-material';
import { nonTeachingAPI } from '../../services/api';

const AllLeaveForms = ({ onViewForm }) => {
  const [leaveForms, setLeaveForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeaveForms: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    hostelName: '',
    rollNumber: '',
    dateFrom: '',
    dateTo: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    cancelled: 'default',
    verified_by_attendant: 'info',
  };

  const statusLabels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    verified_by_attendant: 'Verified',
  };

  const fetchAllForms = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.hostelName && { hostelName: filters.hostelName }),
        ...(filters.rollNumber && { rollNumber: filters.rollNumber }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      };

      const response = await nonTeachingAPI.getAllForms(params);
      
      if (response.data.success) {
        setLeaveForms(response.data.data.leaveForms);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllForms();
  }, [filters]);

  const handlePageChange = (event, page) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleRefresh = () => {
    fetchAllForms();
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status,
      page: 1,
    }));
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
              All Leave Forms
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="verified_by_attendant">Verified</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
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
          <TextField
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value, page: 1 }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value, page: 1 }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
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
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Submitted</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveForms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No leave forms found.
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
                        <Chip
                          label={statusLabels[form.status] || form.status}
                          color={statusColors[form.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(form.submittedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => onViewForm(form.id)}
                          color="primary"
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
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
            Showing {leaveForms.length} of {pagination.totalLeaveForms} forms
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page {pagination.currentPage} of {pagination.totalPages}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AllLeaveForms;
