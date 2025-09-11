import React, { useState, useEffect } from 'react';
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
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import iiitUnaLogo from '../assets/iiitunaLogo.png';
import iiitUnaBG from '../assets/iiitUnaBG.png';
import capIcon from '../assets/cap.svg';
import idCardIcon from '../assets/idcard.svg';

const userTypes = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'admin', label: 'Administrator' },
  { id: 'accountant', label: 'Accountant' },
];

const adminSubRoles = [
  { id: 'super_admin', label: 'Super Admin' },
  { id: 'moderator', label: 'Moderator' },
  { id: 'staff', label: 'Staff' },
];

const features = [
  "Helps you manage college",
  "Organize notes and attendance",
  "Track academic progress",
  "Streamline communication",
  "Simplify student records",
  "Order online from canteen",
  "Library management system",
  "Clubs and events management",
  "Exam schedule and results",
  "Campus announcements",
  "Student portal access",
  "Faculty collaboration tools",
  "Assignment submission system",
  "Grade book management"
];

const LoginPage = () => {
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedAdminSubRole, setSelectedAdminSubRole] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login'); // 'login', 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const { sendOTP, login } = useAuth();
  const navigate = useNavigate();

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => 
        (prevIndex + 1) % features.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSendOTP = async () => {
    if (!selectedUserType) {
      setError('Please select your role');
      return;
    }
    
    // If admin is selected, check for sub-role
    if (selectedUserType === 'admin' && !selectedAdminSubRole) {
      setError('Please select your admin sub-role');
      return;
    }
    
    // If teacher is selected, check for teacher ID
    if (selectedUserType === 'teacher' && !teacherId) {
      setError('Please enter your Teacher ID');
      return;
    }
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    console.log('LoginPage - Sending OTP with:', {
      email: email,
      role: selectedUserType,
      teacherId: teacherId
    });

    const result = await sendOTP(email, selectedUserType, teacherId);
    
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

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    // Determine the final role (admin sub-role if admin is selected)
    // Note: The backend will validate this role against the user's actual role
    const finalRole = selectedUserType === 'admin' ? selectedAdminSubRole : selectedUserType;
    console.log('Attempting login with role:', finalRole, 'for email:', email);
    const result = await login(email, otp, finalRole);
    
    if (result.success) {
      // Show success message briefly before redirecting
      setError('');
      // Navigate to dashboard - the RoleBasedDashboard will handle routing
      navigate('/dashboard');
    } else {
      // Show user-friendly error message
      const errorMessage = result.error || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login failed:', result.error);
    }
    
    setLoading(false);
  };

  const handleBack = () => {
    setStep('login');
    setOtpSent(false);
    setOtp('');
    setError('');
    setSelectedAdminSubRole('');
    setTeacherId('');
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (step === 'login') {
        handleSendOTP();
      } else if (step === 'otp') {
        handleVerifyOTP();
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
          position: 'relative',
          backgroundImage: `url(${iiitUnaBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
            zIndex: 1,
          },
        }}
      >
       {/* Colored Navbar */}
         <motion.div
         initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
         style={{
           position: 'relative',
           zIndex: 10,
         }}
       >
         <Box
           sx={{
             padding: '20px 32px',
             display: 'flex',
             justifyContent: 'space-between',
             alignItems: 'center',
             position: 'relative',
           }}
         >
           {/* Left side - Logo and Brand */}
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             <img 
               src={iiitUnaLogo} 
               alt="IIIT Una Logo" 
               style={{ 
                 width: '50px', 
                 height: '50px',
               }} 
             />
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               {/* Straight line */}
               <Box
                 sx={{
                   width: '2px',
                   height: '40px',
                   backgroundColor: '#ffffff',
                   borderRadius: '1px',
                 }}
               />
               <Box>
                 <Typography
                   variant="h5"
                   sx={{
                     color: '#ffffff',
                     fontWeight: 900,
                     fontFamily: '"Archivo Black", "Arial Black", sans-serif',
                     letterSpacing: '0.1em',
                     fontSize: '1.4rem',
                     textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                     lineHeight: 1,
                   }}
                 >
                   ALTIUS
                 </Typography>
                 <Typography
                   variant="body2"
                   sx={{
                     color: 'rgba(255,255,255,0.8)',
                     fontWeight: 300,
                     fontFamily: '"Inter", "Roboto", sans-serif',
                     fontSize: '0.7rem',
                     letterSpacing: '0.02em',
                     textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                     lineHeight: 1.2,
                     mt: 0.2,
                   }}
                 >
                   Indian Institute of Information Technology Una
                 </Typography>
               </Box>
             </Box>
           </Box>

           {/* Right side - Icons */}
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             {/* Cap icon removed */}
           </Box>

         </Box>
       </motion.div>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
      {/* Left Side - College Branding */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          paddingTop: 2,
          paddingBottom: 2,
          zIndex: 2,
          minHeight: 0,
        }}
      >
         {/* Top Content - Features Slideshow */}
         <motion.div
           initial={{ opacity: 0, y: -30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ 
             delay: 0.3, 
             duration: 0.8, 
             ease: "easeOut"
           }}
           style={{ 
             position: 'relative', 
             zIndex: 2, 
             textAlign: 'center',
             width: '100%',
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center'
           }}
           sx={{
             '&::after': {
               content: '""',
               position: 'absolute',
               bottom: '-12px',
               left: '50%',
               transform: 'translateX(-50%)',
               width: '120px',
               height: '1px',
               background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
             }
           }}
         >
           <Box sx={{ 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             width: '100%',
             maxWidth: '90%',
             minHeight: '60px',
             mb: 2
           }}>
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentFeatureIndex}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
                 style={{
                   width: '100%',
                   display: 'flex',
                   justifyContent: 'center',
                   alignItems: 'center'
                 }}
               >
                 <Typography
                   variant="h4"
                   sx={{
                     color: '#ffffff',
                     fontFamily: '"Poppins", "Arial", sans-serif',
                     fontSize: { md: '1.8rem', lg: '2.2rem' },
                     fontWeight: 300,
                     letterSpacing: '0.02em',
                     textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                     textAlign: 'center',
                     width: '100%',
                     maxWidth: '600px',
                     mx: 'auto',
                     lineHeight: 1.3
                   }}
                 >
                   {features[currentFeatureIndex]}
                 </Typography>
               </motion.div>
             </AnimatePresence>
           </Box>
         </motion.div>

         {/* Statistics & Tagline */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
           style={{ 
             position: 'relative', 
             zIndex: 2, 
             textAlign: 'center',
             width: '100%',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center'
           }}
         >
           {/* Statistics Cards */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
           >
             <Box sx={{ 
               display: 'flex', 
               justifyContent: 'center', 
               gap: { xs: 3, md: 5 }, 
               flexWrap: 'wrap',
               mb: 2
             }}>
               {[
                 { number: '1000+', label: 'Students' },
                 { number: '50+', label: 'Faculty' },
                 { number: '10+', label: 'Programs' }
               ].map((stat, index) => (
                 <motion.div
                   key={stat.label}
                   initial={{ opacity: 0, y: 20, scale: 0.9 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ 
                     delay: 0.8 + (index * 0.1), 
                     duration: 0.6, 
                     ease: "easeOut" 
                   }}
                 >
                   <Box 
                     sx={{
                       textAlign: 'center',
                       px: 3,
                       py: 2.5,
                       background: 'rgba(255, 255, 255, 0.1)',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(255, 255, 255, 0.2)',
                       borderRadius: '16px',
                       minWidth: '120px',
                       boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                       transition: 'all 0.3s ease',
                       '&:hover': {
                         background: 'rgba(255, 255, 255, 0.15)',
                         transform: 'translateY(-2px)',
                         boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                       }
                     }}
                   >
                     <Typography
                       variant="h3"
                       sx={{
                         color: '#ffffff',
                         fontWeight: 600,
                         fontFamily: '"Inter", "Roboto", sans-serif',
                         textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                         mb: 0.5,
                         fontSize: { xs: '2rem', md: '2.4rem' },
                         letterSpacing: '-0.01em',
                         lineHeight: 1.1,
                       }}
                     >
                       {stat.number}
                     </Typography>
                     <Typography
                       variant="body2"
                       sx={{
                         color: 'rgba(255,255,255,0.9)',
                         fontFamily: '"Inter", "Roboto", sans-serif',
                         fontSize: '0.9rem',
                         textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                         fontWeight: 500,
                         letterSpacing: '0.02em',
                         textTransform: 'uppercase',
                         lineHeight: 1.2,
                       }}
                     >
                       {stat.label}
                     </Typography>
                   </Box>
                 </motion.div>
               ))}
             </Box>
           </motion.div>

           {/* Tagline */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
           >
             <Typography
               variant="body1"
               sx={{
                 color: 'rgba(255,255,255,0.9)',
                 fontWeight: 300,
                 fontFamily: '"Inter", "Roboto", sans-serif',
                 lineHeight: 1.6,
                 maxWidth: '520px',
                 mx: 'auto',
                 fontSize: '1.1rem',
                 textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                 letterSpacing: '0.02em',
               }}
             >
               Excellence in Technology Education, Research & Innovation
             </Typography>
           </motion.div>
         </motion.div>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          paddingTop: 1,
          paddingBottom: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >


        {/* Login Form Container */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          style={{ 
            width: '100%', 
            maxWidth: 420, 
            position: 'relative', 
            zIndex: 2
          }}
        >
          <Card 
            sx={{ 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: '#ffffff',
                p: 3,
                textAlign: 'center',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              >
                {/* Logo */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <img 
                    src={idCardIcon} 
                    alt="ID Card Icon" 
                    style={{ 
                      width: '50px', 
                      height: '50px',
                      filter: 'brightness(0) saturate(100%)'
                    }} 
                  />
                </Box>
                
                <Typography 
                  variant="h5" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 0.5,
                    color: '#111827',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6b7280',
                    fontWeight: 500,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontSize: '0.9rem',
                  }}
                >
                  Sign in to your account
                </Typography>
              </motion.div>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <AnimatePresence mode="wait">
                {step === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FormControl fullWidth sx={{ mb: 2.5 }}>
                      <InputLabel 
                        sx={{ 
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#6b7280',
                          '&.Mui-focused': { color: '#374151' }
                        }}
                      >
                        Select Your Role
                      </InputLabel>
                      <Select
                        value={selectedUserType}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                        label="Select Your Role"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: '#ffffff',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9ca3af',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#374151',
                            borderWidth: '1px',
                          },
                        }}
                      >
                        {userTypes.map((userType) => (
                          <MenuItem key={userType.id} value={userType.id} sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 500 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {userType.id === 'student' && <PersonIcon sx={{ mr: 1.5, color: '#6b7280', fontSize: '1.2rem' }} />}
                              {userType.id === 'teacher' && <SchoolIcon sx={{ mr: 1.5, color: '#6b7280', fontSize: '1.2rem' }} />}
                              {userType.id === 'admin' && <AdminIcon sx={{ mr: 1.5, color: '#6b7280', fontSize: '1.2rem' }} />}
                              {userType.id === 'accountant' && <AccountantIcon sx={{ mr: 1.5, color: '#6b7280', fontSize: '1.2rem' }} />}
                              {userType.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Admin Sub-Role Selection */}
                    {selectedUserType === 'admin' && (
                      <FormControl fullWidth sx={{ mb: 2.5 }}>
                        <InputLabel 
                          sx={{ 
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#6b7280',
                            '&.Mui-focused': { color: '#374151' }
                          }}
                        >
                          Select Admin Sub-Role
                        </InputLabel>
                        <Select
                          value={selectedAdminSubRole}
                          onChange={(e) => setSelectedAdminSubRole(e.target.value)}
                          label="Select Admin Sub-Role"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#ffffff',
                              fontFamily: '"Inter", "Roboto", sans-serif',
                              fontWeight: 500,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d1d5db',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#9ca3af',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#374151',
                              borderWidth: '1px',
                            },
                          }}
                        >
                          {adminSubRoles.map((subRole) => (
                            <MenuItem key={subRole.id} value={subRole.id} sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 500 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AdminIcon sx={{ mr: 1.5, color: '#6b7280', fontSize: '1.2rem' }} />
                                {subRole.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {/* Teacher ID Field */}
                    {selectedUserType === 'teacher' && (
                      <TextField
                        fullWidth
                        label="Teacher ID"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        onKeyPress={handleKeyPress}
                        sx={{ 
                          mb: 2.5,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: '#ffffff',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#6b7280',
                            '&.Mui-focused': { color: '#374151' }
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9ca3af',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#374151',
                            borderWidth: '1px',
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SchoolIcon sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Enter your Teacher ID"
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      sx={{ 
                        mb: 2.5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          backgroundColor: '#ffffff',
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontWeight: 500,
                        },
                        '& .MuiInputLabel-root': {
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#6b7280',
                          '&.Mui-focused': { color: '#374151' }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#374151',
                          borderWidth: '1px',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && (
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 1.5,
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
                        py: 1.5,
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        backgroundColor: '#111827',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#1f2937',
                          boxShadow: 'none',
                        },
                        '&:disabled': {
                          backgroundColor: '#f3f4f6',
                          color: '#9ca3af',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={18} color="inherit" />
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                      <IconButton 
                        onClick={handleBack} 
                        sx={{ 
                          mr: 2,
                          backgroundColor: '#f9fafb',
                          color: '#6b7280',
                          '&:hover': {
                            backgroundColor: '#f3f4f6',
                          },
                        }}
                      >
                        <ArrowBack />
                      </IconButton>
                      <Box>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#111827',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            letterSpacing: '-0.01em',
                          }}
                        >
                        Verify OTP
                      </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#6b7280',
                            fontWeight: 500,
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontSize: '0.9rem',
                          }}
                        >
                      We've sent a verification code to <strong>{email}</strong>
                      {selectedUserType === 'teacher' && teacherId && (
                        <><br />Teacher ID: <strong>{teacherId}</strong></>
                      )}
                    </Typography>
                      </Box>
                    </Box>

                    <TextField
                      fullWidth
                      label="Enter OTP"
                      type={showPassword ? 'text' : 'password'}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onKeyPress={handleKeyPress}
                      inputProps={{ maxLength: 6 }}
                      helperText={`${otp.length}/6 characters`}
                      sx={{ 
                        mb: 2.5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          backgroundColor: '#ffffff',
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontWeight: 500,
                        },
                        '& .MuiInputLabel-root': {
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#6b7280',
                          '&.Mui-focused': { color: '#374151' }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#374151',
                          borderWidth: '1px',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SecurityIcon sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#6b7280' }}
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
                          mb: 1.5,
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
                          mb: 1.5,
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
                        py: 1.5,
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        backgroundColor: '#111827',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#1f2937',
                          boxShadow: 'none',
                        },
                        '&:disabled': {
                          backgroundColor: '#f3f4f6',
                          color: '#9ca3af',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={18} color="inherit" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
            style={{ marginTop: 16, textAlign: 'center', paddingBottom: 16 }}
          >
            <Typography
              variant="body2"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 300,
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '120px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }
              }}
            >
              © 2024 Altius • Excellence in Technology Education
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;