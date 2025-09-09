import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  AccountBalance as AdminIcon,
  Calculate as AccountantIcon,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const userTypes = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'admin', label: 'Administrator' },
  { id: 'accountant', label: 'Accountant' },
];

const LoginPage = () => {
  const [selectedUserType, setSelectedUserType] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login'); // 'login', 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { sendOTP, login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!selectedUserType) {
      setError('Please select your role');
      return;
    }
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    const result = await sendOTP(email);
    
    if (result.success) {
      setOtpSent(true);
      setStep('otp');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, otp);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleBack = () => {
    setStep('login');
    setOtpSent(false);
    setOtp('');
    setError('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 450 }}
      >
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <SchoolIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            IIIT Una Portal
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Welcome to your academic dashboard
          </Typography>
        </Paper>

        {/* Login Form */}
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <AnimatePresence mode="wait">
              {step === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" textAlign="center" gutterBottom sx={{ mb: 3 }}>
                    Login to Portal
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Select Your Role</InputLabel>
                    <Select
                      value={selectedUserType}
                      onChange={(e) => setSelectedUserType(e.target.value)}
                      label="Select Your Role"
                    >
                      {userTypes.map((userType) => (
                        <MenuItem key={userType.id} value={userType.id}>
                          {userType.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSendOTP}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                      <ArrowBack />
                    </IconButton>
                    <Typography variant="h5">
                      Verify OTP
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    We've sent a verification code to <strong>{email}</strong>
                  </Typography>

                  <TextField
                    fullWidth
                    label="Enter OTP"
                    type={showPassword ? 'text' : 'password'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {otpSent && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      OTP sent successfully!
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Verify & Login'
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mt: 3, color: 'text.secondary' }}
        >
          © 2024 Indian Institute of Information Technology, Una
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
