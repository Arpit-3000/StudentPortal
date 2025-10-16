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
} from '@mui/material';
import {
  People as PeopleIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  X as XIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { guardAPI } from '../../services/api';

const ActiveStudents = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const fetchActiveStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: 1,
        limit: 100
      };
      if (filterDepartment) params.department = filterDepartment;
      if (filterYear) params.year = filterYear;

      console.log('🚀 Fetching outside students with params:', params);
      console.log('🔗 API URL: /api/gate/outside-without-qr');
      
      const response = await guardAPI.getOutsideStudents(params);
      console.log('📡 Full API Response:', response);
      console.log('📊 Response Data:', response.data);
      console.log('✅ Success Status:', response.data?.success);
      console.log('📝 Message:', response.data?.message);
      console.log('👥 Students Array:', response.data?.data?.students);
      
      if (response.data && response.data.success) {
        const students = response.data.data?.students || [];
        console.log('🎯 Final Students Count:', students.length);
        console.log('👤 Students Data:', students);
        setStudents(students);
      } else {
        console.log('❌ API Failed:', response.data?.message);
        // Show dummy data for testing
        console.log('🧪 Showing dummy data for testing...');
        const dummyStudents = [
          {
            id: 'dummy1',
            name: 'Test Student',
            rollNumber: 'TEST001',
            studentId: 'STU001',
            department: 'Computer Science',
            year: '3rd',
            phone: '9876543210',
            currentStatus: 'out',
            lastGateLog: {
              action: 'exit',
              destination: 'Home',
              issuedAt: new Date().toISOString(),
              status: 'processed'
            }
          }
        ];
        setStudents(dummyStudents);
        setError('API failed, showing dummy data for testing');
      }
    } catch (err) {
      console.error('💥 Fetch students outside error:', err);
      console.error('💥 Error response:', err.response);
      console.error('💥 Error data:', err.response?.data);
      
      // Show dummy data even on error for testing
      console.log('🧪 Showing dummy data due to error...');
      const dummyStudents = [
        {
          id: 'dummy2',
          name: 'Error Test Student',
          rollNumber: 'ERROR001',
          studentId: 'STU002',
          department: 'Computer Science',
          year: '3rd',
          phone: '9876543210',
          currentStatus: 'out',
          lastGateLog: {
            action: 'exit',
            destination: 'Home',
            issuedAt: new Date().toISOString(),
            status: 'processed'
          }
        }
      ];
      setStudents(dummyStudents);
      setError('API error, showing dummy data for testing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveStudents();
  }, [filterDepartment, filterYear]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDepartments = () => {
    const departments = [...new Set(students.map(s => s.department))];
    return departments.sort();
  };

  const getYears = () => {
    const years = [...new Set(students.map(s => s.year))];
    return years.sort();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
          Students Outside Campus
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Students who have exited campus but not returned ({filteredStudents.length} students)
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
              label="Search Students"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll number, or student ID"
              size="small"
              sx={{ minWidth: 250 }}
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
              label="Department"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
              SelectProps={{ native: true }}
            >
              <option value="">All Departments</option>
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </TextField>
            <TextField
              select
              label="Year"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
              SelectProps={{ native: true }}
            >
              <option value="">All Years</option>
              {getYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </TextField>
            <Button
              variant="outlined"
              onClick={fetchActiveStudents}
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

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <SchoolIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              {students.length === 0 ? 'No Students Outside' : 'No Students Found'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              {students.length === 0 
                ? 'All students are currently on campus'
                : 'Try adjusting your search or filter criteria'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
         <Grid container spacing={2}>
           {filteredStudents.map((student, index) => (
             <Grid item xs={12} sm={6} md={4} key={student.id || student._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  height: '100%',
                  border: '1px solid #e5e7eb',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: '#10b981',
                          fontSize: '1.2rem',
                          fontWeight: 600,
                        }}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          color: '#1f2937',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {student.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {student.rollNumber}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<XIcon />}
                        label="Outside"
                        size="small"
                        sx={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {student.studentId}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {student.department} • {student.year}
                        </Typography>
                      </Box>
                      {student.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            📞 {student.phone}
                          </Typography>
                        </Box>
                      )}
                      {student.lastGateLog && (
                        <Box sx={{ 
                          mt: 1, 
                          p: 1, 
                          backgroundColor: '#fef2f2', 
                          borderRadius: 1,
                          border: '1px solid #fecaca',
                        }}>
                          <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 600 }}>
                            Last Exit
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            Exited to {student.lastGateLog.destination}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {formatDateTime(student.lastGateLog.issuedAt)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ActiveStudents;
