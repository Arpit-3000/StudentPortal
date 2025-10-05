import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            p: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ maxWidth: 600, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 6 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b',
                      mb: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    🚧 Under Development
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#64748b', 
                      fontWeight: 500,
                      mb: 3 
                    }}
                  >
                    This page is currently under development
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#64748b', 
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      mb: 4 
                    }}
                  >
                    We're working hard to bring you an amazing experience. 
                    This feature will be available soon!
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={() => window.location.href = '/login'}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                      }
                    }}
                  >
                    Back to Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#cbd5e1',
                      color: '#64748b',
                      '&:hover': {
                        borderColor: '#94a3b8',
                        backgroundColor: '#f8fafc',
                      }
                    }}
                  >
                    Try Again
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
