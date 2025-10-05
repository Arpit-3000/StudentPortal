import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Construction as ConstructionIcon } from '@mui/icons-material';

const UnderDevelopment = ({ pageName = "This page" }) => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card 
          sx={{ 
            maxWidth: 500, 
            textAlign: 'center', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <ConstructionIcon 
                sx={{ 
                  fontSize: 80, 
                  color: '#6366f1', 
                  mb: 3,
                  filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))',
                }} 
              />
            </motion.div>
            
            <Typography 
              variant="h4" 
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
              Under Development
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b', 
                fontWeight: 500,
                mb: 3 
              }}
            >
              {pageName} is currently under development
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748b', 
                fontSize: '1rem',
                lineHeight: 1.6,
                mb: 4 
              }}
            >
              We're working hard to bring you an amazing experience. 
              This feature will be available soon!
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: '#94a3b8',
                fontSize: '0.9rem',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ConstructionIcon sx={{ fontSize: 16 }} />
              </motion.div>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Coming Soon
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default UnderDevelopment;
