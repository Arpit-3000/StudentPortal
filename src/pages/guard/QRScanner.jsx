import React, { useState, useEffect, useRef } from 'react';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  QrCodeScanner as QrScannerIcon,
  CheckCircle as CheckIcon,
  X as XIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  CameraAlt as CameraIcon,
  Keyboard as KeyboardIcon,
} from '@mui/icons-material';
import { BrowserQRCodeReader } from '@zxing/library';
import { guardAPI } from '../../services/api';

const QRScanner = ({ user }) => {
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingToken, setPendingToken] = useState(null);
  const [pendingRemarks, setPendingRemarks] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  // Initialize QR scanner when camera mode is enabled
  useEffect(() => {
    if (useCamera && !cameraError) {
      initializeScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [useCamera]);

  const initializeScanner = async () => {
    try {
      setIsScanning(true);
      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;

      // Get list of video devices
      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('No camera found');
      }

      // Use the first camera (or back camera if available)
      const selectedDeviceId = videoInputDevices[0].deviceId;

      // Start scanning
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            console.log('QR Code detected:', result.getText());
            const decodedText = result.getText();
            setQrToken(decodedText);
            handleScan(decodedText);
            stopScanner();
          }
          if (err && err.name !== 'NotFoundException') {
            console.error('QR scanning error:', err);
          }
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setCameraError(true);
      setError('Failed to initialize camera scanner. Please use manual entry mode.');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (err) {
        console.log('Scanner stop error:', err);
      }
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = async (token = null) => {
    const tokenToUse = token || qrToken;
    
    if (!tokenToUse.trim()) {
      setError('Please enter a QR token to scan');
      return;
    }

    // Show confirmation dialog instead of directly processing
    setPendingToken(tokenToUse.trim());
    setPendingRemarks(remarks.trim() || 'Normal entry');
    setShowConfirmation(true);
    setError('');
    setSuccess('');
    setScanResult(null);
  };

  const handleConfirmProcess = async () => {
    if (!pendingToken) return;

    setLoading(true);
    setShowConfirmation(false);
    setError('');
    setSuccess('');
    setScanResult(null);

    try {
      const response = await guardAPI.scanPass({
        token: pendingToken,
        remarks: pendingRemarks,
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'QR pass processed successfully!');
        setScanResult(response.data.data);
        setQrToken('');
        setRemarks('');
        
        // Stop camera scanner after successful scan
        stopScanner();
        setUseCamera(false);
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
      setPendingToken(null);
      setPendingRemarks('');
    }
  };

  const handleCancelProcess = () => {
    setShowConfirmation(false);
    setPendingToken(null);
    setPendingRemarks('');
    setError('');
    setSuccess('');
    setScanResult(null);
  };

  const handleClear = () => {
    setQrToken('');
    setRemarks('');
    setError('');
    setSuccess('');
    setScanResult(null);
  };

  const handleRestartScanner = () => {
    stopScanner();
    setError('');
    setSuccess('');
    setScanResult(null);
    setCameraError(false);
    
    // Restart scanner
    if (useCamera) {
      setTimeout(() => {
        initializeScanner();
      }, 100);
    }
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
    <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
          QR Code Scanner
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280' }}>
          Scan student QR codes to process gate entries and exits
        </Typography>
      </Box>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 2, textAlign: 'center' }}>
              Confirm Token Processing
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, textAlign: 'center' }}>
              Do you want to process this token and update the student's status?
            </Typography>
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                Token:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                {pendingToken}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleCancelProcess}
                disabled={loading}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: '#fef2f2',
                  },
                  px: 3,
                  py: 1,
                }}
              >
                No, Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmProcess}
                disabled={loading}
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                  px: 3,
                  py: 1,
                }}
              >
                {loading ? 'Processing...' : 'Yes, Process'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Scanner Mode Toggle */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <KeyboardIcon color={!useCamera ? 'primary' : 'disabled'} />
             <FormControlLabel
               control={
                 <Switch
                   checked={useCamera && !cameraError}
                   onChange={(e) => {
                     if (e.target.checked) {
                       if (cameraError) {
                         setCameraError(false);
                         setError('');
                       }
                       setUseCamera(true);
                     } else {
                       setUseCamera(false);
                       stopScanner();
                     }
                   }}
                   color="primary"
                 />
               }
               label={cameraError ? "Camera Scanner (Error - Click to retry)" : "Camera Scanner"}
             />
            <CameraIcon color={useCamera ? 'primary' : 'disabled'} />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Scanner Input */}
        <Grid item xs={12} md={useCamera ? 6 : 12}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
                {useCamera ? 'Manual Entry (Bypass)' : 'Manual QR Token Entry'}
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
                  placeholder="Paste JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
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
                  placeholder="e.g., Normal entry, Late arrival, etc."
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleScan()}
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
                    {loading ? 'Processing...' : 'Verify Token'}
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
                
                {useCamera && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      <strong>Bypass Mode:</strong> If camera is not working, paste the JWT token here and click "Verify Token"
                    </Typography>
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Camera Scanner */}
        {useCamera && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
                  Camera Scanner
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '2px dashed #d1d5db',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {cameraError ? (
                    <Box sx={{ textAlign: 'center', color: '#ef4444', p: 3 }}>
                      <XIcon sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Camera access denied or not available
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', mb: 2, display: 'block' }}>
                        Please use manual entry mode or allow camera access
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={handleRestartScanner}
                        size="small"
                        sx={{
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          '&:hover': {
                            borderColor: '#dc2626',
                            backgroundColor: '#fef2f2',
                          },
                        }}
                      >
                        Retry Camera
                      </Button>
                    </Box>
                  ) : !isScanning ? (
                    <Box sx={{ textAlign: 'center', color: '#6b7280' }}>
                      <CameraIcon sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="body2">
                        {useCamera ? 'Initializing camera...' : 'Camera not active'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                      <video
                        ref={videoRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '200px',
                          height: '200px',
                          border: '3px solid #10b981',
                          borderRadius: '8px',
                          pointerEvents: 'none',
                          boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-3px',
                            left: '-3px',
                            right: '-3px',
                            bottom: '-3px',
                            border: '3px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '8px',
                            animation: 'pulse 2s infinite',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', mt: 2, display: 'block', textAlign: 'center' }}>
                  Point camera at QR code to scan automatically
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handleRestartScanner}
                    startIcon={<RefreshIcon />}
                    size="small"
                    disabled={!isScanning && !cameraError}
                    sx={{
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      '&:hover': {
                        borderColor: '#2563eb',
                        backgroundColor: '#eff6ff',
                      },
                    }}
                  >
                    Restart Scanner
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Scan Result */}
        <Grid item xs={12}>
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
                      p: 3,
                      backgroundColor: '#f8fafc',
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: getActionColor(scanResult.gateLog.action),
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                        }}>
                          {getActionIcon(scanResult.gateLog.action)}
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {scanResult.student.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {scanResult.student.rollNumber} • {scanResult.student.department}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {scanResult.student.year} • Student ID: {scanResult.student.studentId}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                            Action
                          </Typography>
                          <Chip
                            label={scanResult.gateLog.action.toUpperCase()}
                            size="medium"
                            sx={{
                              backgroundColor: getActionColor(scanResult.gateLog.action) + '20',
                              color: getActionColor(scanResult.gateLog.action),
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                            Destination
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#374151' }}>
                            {scanResult.gateLog.destination}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                            Phone
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#374151' }}>
                            {scanResult.student.phone}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                            Current Status
                          </Typography>
                          <Chip
                            label={scanResult.student.currentStatus.toUpperCase()}
                            size="medium"
                            sx={{
                              backgroundColor: scanResult.student.currentStatus === 'in' ? '#10b981' : '#ef4444',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Processing Info */}
                    <Box sx={{
                      p: 3,
                      backgroundColor: '#f0f9ff',
                      borderRadius: 2,
                      border: '1px solid #bfdbfe',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CheckIcon sx={{ color: '#10b981', fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                          {scanResult.gateLog.action === 'exit' ? 'Student Exited Campus' : 'Student Entered Campus'}
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                            Processed by
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                            {scanResult.gateLog.processedBy}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                            Time
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                            {formatDateTime(scanResult.gateLog.processedAt)}
                          </Typography>
                        </Grid>
                        {scanResult.gateLog.remarks && (
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                              Remarks
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                              {scanResult.gateLog.remarks}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  py: 6,
                  color: '#6b7280',
                }}>
                  <QrScannerIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    No scan result yet
                  </Typography>
                  <Typography variant="caption">
                    Scan a QR code or paste a token to see the result here
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
