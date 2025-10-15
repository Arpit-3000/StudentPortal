import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import {
  List as ListIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  X as XIcon,
  AccessTime as ClockIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { guardAPI } from '../../services/api';

const GateLogs = ({ user }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchGateLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      if (filterStatus) params.status = filterStatus;
      if (filterAction) params.action = filterAction;

      const response = await guardAPI.getGateLogs(params);
      if (response.data.success) {
        setLogs(response.data.data.logs || []);
        setTotalLogs(response.data.data.pagination.totalLogs || 0);
      } else {
        setError(response.data.message || 'Failed to fetch gate logs');
      }
    } catch (err) {
      console.error('Fetch gate logs error:', err);
      setError(err.response?.data?.message || 'Failed to fetch gate logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateLogs();
  }, [page, rowsPerPage, filterStatus, filterAction]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.studentSnapshot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.studentSnapshot.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
          Gate Logs
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Complete history of all gate pass activities
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Search Logs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, roll number, or destination"
              size="small"
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
              SelectProps={{ native: true }}
            >
              <option value="">All Status</option>
              <option value="processed">Processed</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </TextField>
            <TextField
              select
              label="Action"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
              SelectProps={{ native: true }}
            >
              <option value="">All Actions</option>
              <option value="exit">Exit</option>
              <option value="enter">Enter</option>
            </TextField>
            <Button
              variant="outlined"
              onClick={fetchGateLogs}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: '#3b82f6',
                color: '#3b82f6',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: '#eff6ff',
                },
              }}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Destination</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Issued At</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Processed At</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Processed By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <ListIcon sx={{ fontSize: 48, color: '#d1d5db' }} />
                      <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        No gate logs found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: getActionColor(log.action),
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          {log.studentSnapshot.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {log.studentSnapshot.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {log.studentSnapshot.rollNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getActionColor(log.action) + '20',
                          color: getActionColor(log.action),
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        {log.destination}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(log.status)}
                        label={log.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(log.status) + '20',
                          color: getStatusColor(log.status),
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {formatDateTime(log.issuedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {log.scannedAt ? formatDateTime(log.scannedAt) : 'Not processed'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {log.scannedBy?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalLogs}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
};

export default GateLogs;
