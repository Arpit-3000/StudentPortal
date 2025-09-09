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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            p: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" color="error" gutterBottom>
                  Oops! Something went wrong
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  We encountered an error while loading the dashboard. Please try refreshing the page.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                  sx={{ mr: 2 }}
                >
                  Refresh Page
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.location.href = '/login'}
                >
                  Go to Login
                </Button>
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
