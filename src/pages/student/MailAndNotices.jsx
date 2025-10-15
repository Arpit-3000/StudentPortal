import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Fade,
  Slide,
  Collapse,
  CardActionArea,
  Stack,
} from '@mui/material';
import {
  Email as EmailIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  MarkEmailRead as ReadIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AttachFile as AttachmentIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import gmailService from '../../services/gmailService.js';

const MailAndNotices = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [readEmails, setReadEmails] = useState(new Set());
  const [starredEmails, setStarredEmails] = useState(new Set());

  useEffect(() => {
    checkSignInStatus();
  }, []);

  const checkSignInStatus = async () => {
    try {
      const signedIn = await gmailService.isSignedIn();
      setIsSignedIn(signedIn);
      
      if (signedIn) {
        await loadEmails();
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await gmailService.signIn();
      
      if (result.success) {
        setIsSignedIn(true);
        setUserProfile({
          name: result.user.getName(),
          email: result.user.getEmail(),
          imageUrl: result.user.getImageUrl()
        });
        await loadEmails();
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (error) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      const result = await gmailService.signOut();
      
      if (result.success) {
        setIsSignedIn(false);
        setUserProfile(null);
        setEmails([]);
        setError('');
      } else {
        setError(result.error || 'Failed to sign out');
      }
    } catch (error) {
      setError('An error occurred during sign out');
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmails = async () => {
    setRefreshing(true);
    setError('');
    
    try {
      const result = await gmailService.getEmails(10);
      
      if (result.success) {
        setEmails(result.emails);
      } else {
        setError(result.error || 'Failed to load emails');
      }
    } catch (error) {
      setError('An error occurred while loading emails');
      console.error('Load emails error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const cleanEmailContent = (content) => {
    if (!content) return '';
    
    return content
      // Remove HTML entities and special characters
      .replace(/&[a-zA-Z0-9#]+;/g, ' ')
      .replace(/[#&]/g, ' ')
      .replace(/[^\w\s.,!?@-]/g, ' ')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleEmailClick = (emailId) => {
    setReadEmails(prev => new Set([...prev, emailId]));
    setExpandedEmail(expandedEmail === emailId ? null : emailId);
  };

  const handleStarEmail = (emailId, event) => {
    event.stopPropagation();
    setStarredEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
      } else {
        newSet.add(emailId);
      }
      return newSet;
    });
  };

  if (!isSignedIn) {
    return (
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <SchoolIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Mail & Notices
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Connect your college Gmail account to view important notices and emails
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              onClick={handleSignIn}
              disabled={isLoading}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign in with Gmail'}
            </Button>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={userProfile?.imageUrl}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {userProfile?.name ? getInitials(userProfile.name) : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Mail & Notices
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {userProfile?.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    onClick={loadEmails}
                    disabled={refreshing}
                    sx={{
                      background: '#f8fafc',
                      '&:hover': { background: '#e2e8f0' }
                    }}
                  >
                    <RefreshIcon sx={{ 
                      color: '#6366f1',
                      animation: refreshing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip title="Sign Out">
                <span>
                  <IconButton
                    onClick={handleSignOut}
                    disabled={isLoading}
                    sx={{
                      background: '#fef2f2',
                      '&:hover': { background: '#fee2e2' }
                    }}
                  >
                    <LogoutIcon sx={{ color: '#dc2626' }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          
          <Divider />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Simple Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>
            {emails.length} emails
          </Typography>
        </Box>

        {/* Simple Emails List */}
        <AnimatePresence>
          {emails.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={1}>
                {emails.map((email, index) => {
                  const isRead = readEmails.has(email.id);
                  const isStarred = starredEmails.has(email.id);
                  const isExpanded = expandedEmail === email.id;
                  
                  return (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        elevation={isExpanded ? 2 : 0}
                        sx={{
                          borderRadius: 2,
                          border: isRead ? '1px solid #e2e8f0' : '1px solid #d1d5db',
                          backgroundColor: isRead ? '#ffffff' : '#f9fafb',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            elevation: 1,
                            borderColor: '#9ca3af',
                          },
                        }}
                        onClick={() => handleEmailClick(email.id)}
                      >
                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Sender Avatar */}
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: '#6b7280',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                              }}
                            >
                              {getInitials(cleanEmailContent(email.from))}
                            </Avatar>

                            {/* Main Content */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  component="div"
                                  sx={{
                                    fontWeight: isRead ? 500 : 600,
                                    color: '#111827',
                                    fontSize: '0.9rem',
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {cleanEmailContent(email.from)}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {!isRead && (
                                    <Box
                                      sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                      }}
                                    />
                                  )}
                                  {isStarred && (
                                    <StarIcon sx={{ color: '#f59e0b', fontSize: 14 }} />
                                  )}
                                </Box>
                              </Box>

                              <Typography
                                variant="body2"
                                component="div"
                                sx={{
                                  fontWeight: isRead ? 400 : 500,
                                  color: '#374151',
                                  fontSize: '0.85rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {cleanEmailContent(email.subject) || '(No Subject)'}
                              </Typography>
                            </Box>

                            {/* Time and Expand Button */}
                            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#6b7280',
                                  fontSize: '0.75rem',
                                  display: 'block',
                                  mb: 0.5,
                                }}
                              >
                                {gmailService.formatDate(email.date)}
                              </Typography>
                              
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedEmail(isExpanded ? null : email.id);
                                }}
                                sx={{ 
                                  p: 0.5,
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                  }
                                }}
                              >
                                {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Expanded Content */}
                          <Collapse in={isExpanded}>
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                              <Typography 
                                variant="body2" 
                                component="div"
                                sx={{
                                  color: '#374151',
                                  fontSize: '0.9rem',
                                  lineHeight: 1.6,
                                  whiteSpace: 'pre-wrap',
                                  mb: 2,
                                  wordBreak: 'break-word',
                                }}
                              >
                                {cleanEmailContent(email.snippet)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                Received: {email.date.toLocaleString()}
                              </Typography>
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </Stack>
            </motion.div>
          ) : !refreshing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed #e2e8f0',
                  borderRadius: 2,
                }}
              >
                <EmailIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  No emails found
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Your inbox appears to be empty or there was an error loading emails.
                </Typography>
              </Paper>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Loading State */}
        {refreshing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default MailAndNotices;
