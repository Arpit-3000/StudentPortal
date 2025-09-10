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
  Container,
  Avatar,
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
import iiitUnaLogo from '../assets/iiitunaLogo.png';
import iiitUnaBG from '../assets/iiitUnaBG.png';

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
        height: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left Side - Background & Logo */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          backgroundImage: `url(${iiitUnaBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
            zIndex: 1,
          },
        }}
      >
        {/* Top Content - Institute Name */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ 
            position: 'relative', 
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '90%'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              mb: 1,
              fontSize: { md: '2.5rem', lg: '3rem' }
            }}
          >
            Indian Institute of Information Technology
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              mb: 2,
            }}
          >
            Una
          </Typography>
        </motion.div>

        {/* Center - Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1.3, 1],
            rotate: [0, 1080, 0], // 3 full rotations
          }}
          transition={{ 
            duration: 3.5,
            ease: "easeInOut",
            times: [0, 0.4, 1]
          }}
          style={{ 
            position: 'relative', 
            zIndex: 2,
            marginTop: '-50px'
          }}
        >
          <Avatar
            src={iiitUnaLogo}
            alt="IIIT Una Logo"
            sx={{
              width: 180,
              height: 180,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '6px solid rgba(255, 255, 255, 0.9)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </motion.div>

        {/* Bottom Content - Description & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{ 
            position: 'relative', 
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '90%'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              mb: 2,
            }}
          >
            IIIT Una
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              lineHeight: 1.6,
              mb: 3,
              maxWidth: '500px',
              mx: 'auto',
              fontSize: '1.1rem'
            }}
          >
            Excellence in Technology Education, Research & Innovation
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                1000+
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                Students
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                50+
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                Faculty
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                10+
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                Programs
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(102, 126, 234, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
              linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 20px 20px',
            zIndex: 0,
            animation: 'float 20s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
            },
          }}
        />

        {/* Floating Particles */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              top: '20%',
              left: '20%',
              animation: 'particle1 15s linear infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              top: '60%',
              right: '30%',
              animation: 'particle2 12s linear infinite',
            },
            '@keyframes particle1': {
              '0%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0 },
              '10%': { opacity: 1 },
              '90%': { opacity: 1 },
              '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: 0 },
            },
            '@keyframes particle2': {
              '0%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0 },
              '10%': { opacity: 1 },
              '90%': { opacity: 1 },
              '100%': { transform: 'translateY(-100vh) rotate(-360deg)', opacity: 0 },
            },
          }}
        />

        {/* Mobile Logo */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1.3, 1],
            rotate: [0, 1080, 0], // 3 full rotations
          }}
          transition={{ 
            duration: 3.5,
            ease: "easeInOut",
            times: [0, 0.4, 1]
          }}
          style={{
            position: 'absolute',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: { xs: 'block', md: 'none' }
          }}
        >
          <Avatar
            src={iiitUnaLogo}
            alt="IIIT Una Logo"
            sx={{
              width: { xs: 70, sm: 80, md: 90 },
              height: { xs: 70, sm: 80, md: 90 },
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              border: { xs: '3px solid rgba(255, 255, 255, 0.9)', sm: '4px solid rgba(255, 255, 255, 0.9)' },
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </motion.div>

        {/* Login Form Container */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ 
            width: '100%', 
            maxWidth: 450, 
            position: 'relative', 
            zIndex: 2,
            marginTop: { xs: 100, md: 0 }
          }}
        >
          <Card 
            sx={{ 
              borderRadius: 4, 
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 3,
                textAlign: 'center',
                color: 'white',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  Sign in to your account
                </Typography>
              </motion.div>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <AnimatePresence mode="wait">
                {step === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Select Your Role</InputLabel>
                      <Select
                        value={selectedUserType}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                        label="Select Your Role"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          },
                        }}
                      >
                        {userTypes.map((userType) => (
                          <MenuItem key={userType.id} value={userType.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {userType.id === 'student' && <PersonIcon sx={{ mr: 1, color: '#667eea' }} />}
                              {userType.id === 'teacher' && <SchoolIcon sx={{ mr: 1, color: '#667eea' }} />}
                              {userType.id === 'admin' && <AdminIcon sx={{ mr: 1, color: '#667eea' }} />}
                              {userType.id === 'accountant' && <AccountantIcon sx={{ mr: 1, color: '#667eea' }} />}
                              {userType.label}
                            </Box>
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
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 2,
                          borderRadius: 2,
                        }}
                      >
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
                        py: 1.8,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
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
                    transition={{ duration: 0.4 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <IconButton 
                        onClick={handleBack} 
                        sx={{ 
                          mr: 1,
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.2)',
                          },
                        }}
                      >
                        <ArrowBack />
                      </IconButton>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
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
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        },
                      }}
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
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 2,
                          borderRadius: 2,
                        }}
                      >
                        {error}
                      </Alert>
                    )}

                    {otpSent && (
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 2,
                          borderRadius: 2,
                        }}
                      >
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
                        py: 1.8,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{ marginTop: 20, textAlign: 'center' }}
          >
            <Typography
              variant="body2"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
              }}
            >
              © 2024 IIIT Una • Excellence in Technology Education
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginPage;
