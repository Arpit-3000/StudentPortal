import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
import {
  QrCodeScanner as QrScannerIcon,
  CheckCircle as CheckIcon,
  X as XIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { guardAPI } from '../../services/api';

const QRScanner = ({ user }) => {
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [remarks, setRemarks] = useState('');

  const handleScan = async () => {
    if (!qrToken.trim()) {
      setError('Please enter a QR token to scan');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setScanResult(null);

    try {
      const response = await guardAPI.scanPass({
        token: qrToken.trim(),
        remarks: remarks.trim() || undefined,
      });

      if (response.data.success) {
        setSuccess('QR pass processed successfully!');
        setScanResult(response.data.data);
        setQrToken('');
        setRemarks('');
      } else {
        setError(response.data.message || 'Failed to process QR pass');
      }
    } catch (err) {
      console.error('Scan QR error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to process QR pass. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQrToken('');
    setRemarks('');
    setError('');
    setSuccess('');
    setScanResult(null);
  };

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

  const getActionColor = (action) => {
    return action === 'exit' ? '#ef4444' : '#10b981';
  };

  const getActionIcon = (action) => {
    return action === 'exit' ? '↗' : '↘';
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
          QR Code Scanner
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Scan student QR codes to process gate entries and exits
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Scanner Input */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
                Scan QR Code
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="QR Token"
                  value={qrToken}
                  onChange={(e) => setQrToken(e.target.value)}
                  placeholder="Enter QR token from student's QR code"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    },
                  }}
                />

                <TextField
                  label="Remarks (Optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any remarks about this scan"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleScan}
                    disabled={loading || !qrToken.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <QrScannerIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      },
                      flex: 1,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'Processing...' : 'Scan QR Code'}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleClear}
                    disabled={loading}
                    startIcon={<RefreshIcon />}
                    sx={{
                      borderColor: '#6b7280',
                      color: '#6b7280',
                      '&:hover': {
                        borderColor: '#374151',
                        backgroundColor: '#f9fafb',
                      },
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Scan Result */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
                Scan Result
              </Typography>

              {scanResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Student Info */}
                    <Box sx={{
                      p: 2,
                      backgroundColor: '#f8fafc',
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: getActionColor(scanResult.gateLog.action),
                          fontSize: '1.2rem',
                        }}>
                          {getActionIcon(scanResult.gateLog.action)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {scanResult.student.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {scanResult.student.rollNumber} • {scanResult.student.department}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                            Action
                          </Typography>
                          <Chip
                            label={scanResult.gateLog.action.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: getActionColor(scanResult.gateLog.action) + '20',
                              color: getActionColor(scanResult.gateLog.action),
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                            Destination
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                            {scanResult.gateLog.destination}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Processing Info */}
                    <Box sx={{
                      p: 2,
                      backgroundColor: '#f0f9ff',
                      borderRadius: 2,
                      border: '1px solid #bfdbfe',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                          Successfully Processed
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        Processed by: {scanResult.gateLog.processedBy}
                      </Typography>
                      <br />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        Time: {formatDateTime(scanResult.gateLog.processedAt)}
                      </Typography>
                      {scanResult.gateLog.remarks && (
                        <>
                          <br />
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            Remarks: {scanResult.gateLog.remarks}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Student Status Update */}
                    <Box sx={{
                      p: 2,
                      backgroundColor: scanResult.student.currentStatus === 'in' ? '#f0fdf4' : '#fef2f2',
                      borderRadius: 2,
                      border: `1px solid ${scanResult.student.currentStatus === 'in' ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}>
                        Student Status Updated
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        Current Status: 
                        <Chip
                          label={scanResult.student.currentStatus.toUpperCase()}
                          size="small"
                          sx={{
                            ml: 1,
                            backgroundColor: scanResult.student.currentStatus === 'in' ? '#10b981' : '#ef4444',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  py: 4,
                  color: '#6b7280',
                }}>
                  <QrScannerIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                  <Typography variant="body2">
                    Scan a QR code to see the result here
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRScanner;
