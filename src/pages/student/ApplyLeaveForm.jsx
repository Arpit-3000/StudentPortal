import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Home, 
  Smartphone,
  Loader2,
  Eye
} from 'lucide-react';
import { studentAPI } from '../../services/api';

const ApplyLeaveForm = ({ onViewForm }) => {
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveStats, setLeaveStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    hostelName: '',
    roomNumber: '',
    phone: '',
    leaveType: 'Personal',
    exitDate: '',
    entryDate: '',
    exitTime: '',
    entryTime: '',
    reason: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
  });

  const hostelOptions = ['ASKINI HOSTEL', 'KALINDI HOSTEL', 'VIPASHA HOSTEL', 'IRAVATI HOSTEL'];
  const relationOptions = ['Father', 'Mother', 'Brother', 'Sister', 'Guardian', 'Other'];
  const leaveTypes = ['Personal', 'Medical', 'Family', 'Academic', 'Other'];

  // Fetch student profile and leave data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        // Fetch student profile
        try {
          const profileResponse = await studentAPI.getProfile();
          if (profileResponse.data.success) {
            const profile = profileResponse.data.data;
            setProfileData(profile);
            
            // Update form data with profile information
            setFormData(prev => ({
              ...prev,
              name: profile.name || '',
              roll: profile.rollNumber || '',
              hostelName: profile.hostelName || '',
              roomNumber: profile.roomNumber || '',
              phone: profile.phone || '',
            }));
          }
        } catch (profileError) {
          console.error('Profile fetch error:', profileError);
          // Continue with default values if profile fetch fails
        }

        // Fetch leave forms history
        try {
          const leaveResponse = await studentAPI.getMyLeaveForms();
          if (leaveResponse.data.success) {
            // The backend returns { leaveForms: [...], pagination: {...} }
            const forms = leaveResponse.data.data.leaveForms || [];
            // Ensure forms is an array
            const formsArray = Array.isArray(forms) ? forms : [];
            setLeaveHistory(formsArray);
            
            // Calculate statistics
            const stats = {
              total: formsArray.length,
              approved: formsArray.filter(f => f.status === 'approved').length,
              pending: formsArray.filter(f => f.status === 'pending').length,
              rejected: formsArray.filter(f => f.status === 'rejected').length
            };
            setLeaveStats(stats);
          } else {
            // If API call is not successful, set empty array
            setLeaveHistory([]);
            setLeaveStats({ total: 0, approved: 0, pending: 0, rejected: 0 });
          }
        } catch (leaveError) {
          console.error('Leave history fetch error:', leaveError);
          // Continue with empty history if fetch fails
          setLeaveHistory([]);
          setLeaveStats({ total: 0, approved: 0, pending: 0, rejected: 0 });
        }
        
      } catch (error) {
        console.error('General error fetching data:', error);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { color: '#3B82F6', icon: CheckCircle };
      case 'pending':
        return { color: '#6366F1', icon: Clock };
      case 'rejected':
        return { color: '#D8412E', icon: XCircle };
      default:
        return { color: '#646464', icon: Clock };
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.hostelName || !formData.roomNumber || !formData.exitDate || 
        !formData.entryDate || !formData.exitTime || !formData.entryTime || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Phone number validation (10 digits, starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Contact number must be a valid 10-digit Indian mobile number (starting with 6-9)');
      return;
    }
    
    // Emergency contact phone validation (if provided)
    if (formData.emergencyContact.phone && !phoneRegex.test(formData.emergencyContact.phone.replace(/\D/g, ''))) {
      setError('Emergency contact phone must be a valid 10-digit Indian mobile number (starting with 6-9)');
      return;
    }
    
    if (formData.reason.length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }
    
    if (new Date(formData.entryDate) <= new Date(formData.exitDate)) {
      setError('Entry date must be after exit date');
      return;
    }
    
    if (new Date(formData.exitDate) < new Date()) {
      setError('Exit date cannot be in the past');
      return;
    }
    
    // Clear any previous errors
    setError('');
    setShowForm(false);
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);

    try {
      // Submit the form to API
      const response = await studentAPI.submitLeaveForm(formData);
      
      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        
        // Reset only form-specific fields, keep profile data
        setFormData(prev => ({
          ...prev,
          leaveType: 'Personal',
          exitDate: '',
          entryDate: '',
          exitTime: '',
          entryTime: '',
          reason: '',
          emergencyContact: {
            name: '',
            phone: '',
            relation: '',
          },
        }));
        
        // Refresh leave history and stats
        const leaveResponse = await studentAPI.getMyLeaveForms();
        if (leaveResponse.data.success) {
          const forms = leaveResponse.data.data.leaveForms || [];
          // Ensure forms is an array
          const formsArray = Array.isArray(forms) ? forms : [];
          setLeaveHistory(formsArray);
          
          const stats = {
            total: formsArray.length,
            approved: formsArray.filter(f => f.status === 'approved').length,
            pending: formsArray.filter(f => f.status === 'pending').length,
            rejected: formsArray.filter(f => f.status === 'rejected').length
          };
          setLeaveStats(stats);
        }
        
      } else {
        setError(response.data.message || 'Failed to submit leave form');
      }
    } catch (error) {
      console.error('Submit leave form error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors.map(err => err.msg).join('\n• ');
        setError('Validation errors:\n• ' + validationErrors);
      } else if (error.response?.status === 400) {
        setError('Please check all required fields and try again.');
      } else {
        setError('Failed to submit leave form. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to calculate duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  // Helper function to format and validate phone numbers
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 10 digits and ensure it starts with 6-9 if not empty
    const limitedDigits = digits.slice(0, 10);
    return limitedDigits;
  };

  const validatePhoneNumber = (phone) => {
    if (!phone || phone.length === 0) return true; // Empty is valid (optional)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (field, value) => {
    const formattedPhone = formatPhoneNumber(value);
    handleInputChange(field, formattedPhone);
  };

  const handlePhoneKeyPress = (e) => {
    // Allow only digits, backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (allowedKeys.includes(e.key)) return;
    
    // Allow only digits 0-9
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Handler functions for leave form actions
  const handleViewLeaveForm = (formId) => {
    // This will be handled by the parent component (LeaveManagement)
    if (onViewForm) {
      onViewForm(formId);
    }
  };

  const handleCancelLeaveForm = async (formId) => {
    if (window.confirm('Are you sure you want to cancel this leave form?')) {
      try {
        setLoading(true);
        const response = await studentAPI.cancelLeaveForm(formId);
        
        if (response.data.success) {
          // Refresh leave history
          const leaveResponse = await studentAPI.getMyLeaveForms();
          if (leaveResponse.data.success) {
            const forms = leaveResponse.data.data.leaveForms || [];
            const formsArray = Array.isArray(forms) ? forms : [];
            setLeaveHistory(formsArray);
            
            const stats = {
              total: formsArray.length,
              approved: formsArray.filter(f => f.status === 'approved').length,
              pending: formsArray.filter(f => f.status === 'pending').length,
              rejected: formsArray.filter(f => f.status === 'rejected').length
            };
            setLeaveStats(stats);
          }
        }
      } catch (error) {
        console.error('Cancel leave form error:', error);
        setError(error.response?.data?.message || 'Failed to cancel leave form');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteLeaveForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this leave form? This action cannot be undone.')) {
      try {
        setLoading(true);
        const response = await studentAPI.deleteLeaveForm(formId);
        
        if (response.data.success) {
          // Refresh leave history
          const leaveResponse = await studentAPI.getMyLeaveForms();
          if (leaveResponse.data.success) {
            const forms = leaveResponse.data.data.leaveForms || [];
            const formsArray = Array.isArray(forms) ? forms : [];
            setLeaveHistory(formsArray);
            
            const stats = {
              total: formsArray.length,
              approved: formsArray.filter(f => f.status === 'approved').length,
              pending: formsArray.filter(f => f.status === 'pending').length,
              rejected: formsArray.filter(f => f.status === 'rejected').length
            };
            setLeaveStats(stats);
          }
        }
      } catch (error) {
        console.error('Delete leave form error:', error);
        setError(error.response?.data?.message || 'Failed to delete leave form');
      } finally {
        setLoading(false);
      }
    }
  };

  if (pageLoading) {
    return (
      <div style={{ 
        padding: '24px',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f5f3ef, rgba(156, 197, 161, 0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 style={{ 
              width: '48px', 
              height: '48px', 
              color: '#3B82F6'
            }} />
          </motion.div>
          <p style={{ 
            marginTop: '16px', 
            color: '#646464',
            fontSize: '1.1rem'
          }}>
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f5f3ef, rgba(156, 197, 161, 0.05))'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#2A2A2A',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em'
              }}>
                Permission with Ease
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#646464',
                margin: 0,
                fontWeight: 500
              }}>
                Apply for leave and track your applications
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(to right, #3B82F6, #6366F1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {showForm ? 'Cancel' : 'Apply for Leave'}
            </motion.button>
          </div>
        </motion.div>

        {/* Success Animation with Confetti */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '48px',
                  maxWidth: '400px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Confetti Particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, y: 0, x: 0 }}
                    animate={{
                      opacity: 0,
                      y: [0, -200],
                      x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 400],
                      rotate: [0, Math.random() * 360],
                    }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: ['#3B82F6', '#6366F1', '#D8412E', '#60A5FA', '#1D4ED8'][Math.floor(Math.random() * 5)],
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  style={{
                    width: '96px',
                    height: '96px',
                    background: '#3B82F6',
                    borderRadius: '50%',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)'
                  }}
                >
                  <CheckCircle size={48} color="white" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#2A2A2A',
                    margin: '0 0 8px 0'
                  }}
                >
                  Leave Request Submitted!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    color: '#646464',
                    margin: 0,
                    fontSize: '1rem'
                  }}
                >
                  Your leave application has been submitted successfully and is pending approval.
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}
              onClick={() => setShowConfirmation(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  maxWidth: '400px',
                  width: '100%',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(156, 197, 161, 0.2)'
                }}
              >
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#2A2A2A',
                  margin: '0 0 16px 0'
                }}>
                  Confirm Leave Application
                </h2>
                
                <div style={{
                  padding: '16px',
                  background: 'rgba(156, 197, 161, 0.05)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#646464' }}>Name:</span>
                    <span style={{ color: '#2A2A2A', fontWeight: 600 }}>{formData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#646464' }}>Roll No:</span>
                    <span style={{ color: '#2A2A2A', fontWeight: 600 }}>{formData.roll}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#646464' }}>Leave Type:</span>
                    <span style={{ color: '#2A2A2A', fontWeight: 600 }}>{formData.leaveType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#646464' }}>Duration:</span>
                    <span style={{ color: '#2A2A2A', fontWeight: 600 }}>{formData.exitDate} to {formData.entryDate}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConfirmation(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid rgba(100, 100, 100, 0.3)',
                      color: '#646464',
                      background: 'white',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmSubmit}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'linear-gradient(to right, #3B82F6, #6366F1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    Confirm & Submit
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(156, 197, 161, 0.1)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '24px'
              }}
            >
              {/* Decorative Pine Outline */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '256px',
                height: '256px',
                opacity: 0.04,
                pointerEvents: 'none'
              }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M100,20 L80,60 L90,60 L70,100 L85,100 L60,150 L140,150 L115,100 L130,100 L110,60 L120,60 Z"
                    fill="#3B82F6"
                  />
                </svg>
              </div>

              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#2A2A2A',
                margin: '0 0 16px 0'
              }}>
                New Leave Application
              </h2>

              <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 10 }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        color: '#646464'
                      }} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={{
                          width: '100%',
                          paddingLeft: '44px',
                          paddingRight: '16px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderRadius: '12px',
                          border: '2px solid rgba(156, 197, 161, 0.3)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          background: 'white',
                          fontSize: '0.95rem'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={formData.roll}
                      onChange={(e) => handleInputChange('roll', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(156, 197, 161, 0.3)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'white',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Hostel
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Home style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        color: '#646464'
                      }} />
                      <select
                        value={formData.hostelName}
                        onChange={(e) => handleInputChange('hostelName', e.target.value)}
                        style={{
                          width: '100%',
                          paddingLeft: '44px',
                          paddingRight: '16px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderRadius: '12px',
                          border: '2px solid rgba(156, 197, 161, 0.3)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          appearance: 'none',
                          background: 'white',
                          fontSize: '0.95rem',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                      >
                        {hostelOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(156, 197, 161, 0.3)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'white',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Contact Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Smartphone style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        color: '#646464'
                      }} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange('phone', e.target.value)}
                        onKeyDown={handlePhoneKeyPress}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        style={{
                          width: '100%',
                          paddingLeft: '44px',
                          paddingRight: '16px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderRadius: '12px',
                          border: `2px solid ${formData.phone && !validatePhoneNumber(formData.phone) && formData.phone.length > 0 ? '#EF4444' : 'rgba(156, 197, 161, 0.3)'}`,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          background: 'white',
                          fontSize: '0.95rem'
                        }}
                        onFocus={(e) => e.target.style.borderColor = formData.phone && !validatePhoneNumber(formData.phone) && formData.phone.length > 0 ? '#EF4444' : '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = formData.phone && !validatePhoneNumber(formData.phone) && formData.phone.length > 0 ? '#EF4444' : 'rgba(156, 197, 161, 0.3)'}
                        required
                      />
                      {formData.phone && !validatePhoneNumber(formData.phone) && formData.phone.length > 0 && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#EF4444',
                          marginTop: '4px'
                        }}>
                          Enter a valid 10-digit mobile number starting with 6-9
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Leave Type
                    </label>
                    <select
                      value={formData.leaveType}
                      onChange={(e) => handleInputChange('leaveType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(156, 197, 161, 0.3)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        appearance: 'none',
                        background: 'white',
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                    >
                      {leaveTypes.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Leave From
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Calendar style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        color: '#646464'
                      }} />
                      <input
                        type="date"
                        value={formData.exitDate}
                        onChange={(e) => handleInputChange('exitDate', e.target.value)}
                        style={{
                          width: '100%',
                          paddingLeft: '44px',
                          paddingRight: '16px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderRadius: '12px',
                          border: '2px solid rgba(156, 197, 161, 0.3)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          background: 'white',
                          fontSize: '0.95rem'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Return On
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Calendar style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        color: '#646464'
                      }} />
                      <input
                        type="date"
                        value={formData.entryDate}
                        onChange={(e) => handleInputChange('entryDate', e.target.value)}
                        style={{
                          width: '100%',
                          paddingLeft: '44px',
                          paddingRight: '16px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderRadius: '12px',
                          border: '2px solid rgba(156, 197, 161, 0.3)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          background: 'white',
                          fontSize: '0.95rem'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Exit Time
                    </label>
                    <input
                      type="time"
                      value={formData.exitTime}
                      onChange={(e) => handleInputChange('exitTime', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(156, 197, 161, 0.3)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'white',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#2A2A2A',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Entry Time
                    </label>
                    <input
                      type="time"
                      value={formData.entryTime}
                      onChange={(e) => handleInputChange('entryTime', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid rgba(156, 197, 161, 0.3)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'white',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    color: '#2A2A2A',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}>
                    Reason for Leave
                  </label>
                  <textarea
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Explain the reason for your leave application..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(156, 197, 161, 0.3)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      resize: 'none',
                      background: 'white',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                    required
                  />
                </div>

                {/* Emergency Contact Section */}
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#2A2A2A',
                    margin: '0 0 16px 0'
                  }}>
                    Emergency Contact (Optional)
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#2A2A2A',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}>
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                        placeholder="Emergency contact name"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid rgba(156, 197, 161, 0.3)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          background: 'white',
                          fontSize: '0.95rem'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        color: '#2A2A2A',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}>
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handlePhoneChange('emergencyContact.phone', e.target.value)}
                        onKeyDown={handlePhoneKeyPress}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: `2px solid ${formData.emergencyContact.phone && !validatePhoneNumber(formData.emergencyContact.phone) && formData.emergencyContact.phone.length > 0 ? '#EF4444' : 'rgba(156, 197, 161, 0.3)'}`,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          background: 'white',
                          fontSize: '0.95rem'
                        }}
                        onFocus={(e) => e.target.style.borderColor = formData.emergencyContact.phone && !validatePhoneNumber(formData.emergencyContact.phone) && formData.emergencyContact.phone.length > 0 ? '#EF4444' : '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = formData.emergencyContact.phone && !validatePhoneNumber(formData.emergencyContact.phone) && formData.emergencyContact.phone.length > 0 ? '#EF4444' : 'rgba(156, 197, 161, 0.3)'}
                      />
                      {formData.emergencyContact.phone && !validatePhoneNumber(formData.emergencyContact.phone) && formData.emergencyContact.phone.length > 0 && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#EF4444',
                          marginTop: '4px'
                        }}>
                          Enter a valid 10-digit mobile number starting with 6-9
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        color: '#2A2A2A',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}>
                        Relation
                      </label>
                      <select
                        value={formData.emergencyContact.relation}
                        onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid rgba(156, 197, 161, 0.3)',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          appearance: 'none',
                          background: 'white',
                          fontSize: '0.95rem',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(156, 197, 161, 0.3)'}
                      >
                        <option value="">Select relation</option>
                        {relationOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: loading 
                      ? 'linear-gradient(to right, #9CA3AF, #9CA3AF)' 
                      : 'linear-gradient(to right, #3B82F6, #6366F1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading 
                      ? '0 4px 12px rgba(156, 163, 175, 0.3)' 
                      : '0 4px 12px rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {loading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 style={{ width: '16px', height: '16px' }} />
                    </motion.div>
                  )}
                  {loading ? 'Submitting...' : 'Submit Application'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Applications', value: leaveStats.total.toString(), color: '#3B82F6', icon: Calendar },
            { label: 'Approved', value: leaveStats.approved.toString(), color: '#10B981', icon: CheckCircle },
            { label: 'Pending', value: leaveStats.pending.toString(), color: '#6366F1', icon: Clock },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(156, 197, 161, 0.1)',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${stat.color}15`
                  }}
                >
                  <Icon style={{ width: '24px', height: '24px', color: stat.color }} />
                </div>
                <div style={{
                  color: '#646464',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: stat.color
                }}>
                  {stat.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Leave History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(156, 197, 161, 0.1)'
          }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#2A2A2A',
            margin: '0 0 16px 0'
          }}>
            Leave History
          </h2>
          
          {error && (
            <div style={{
              padding: '16px',
              background: 'rgba(216, 65, 46, 0.1)',
              border: '1px solid rgba(216, 65, 46, 0.3)',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <pre style={{
                color: '#D8412E',
                margin: 0,
                fontSize: '0.9rem',
                fontWeight: 500,
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap'
              }}>
                {error}
              </pre>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(!Array.isArray(leaveHistory) || leaveHistory.length === 0) ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#646464'
              }}>
                <FileText style={{ 
                  width: '48px', 
                  height: '48px', 
                  margin: '0 auto 16px',
                  opacity: 0.5 
                }} />
                <p style={{ 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  margin: '0 0 8px 0'
                }}>
                  No Leave Applications Yet
                </p>
                <p style={{ 
                  fontSize: '0.9rem',
                  margin: 0,
                  opacity: 0.8
                }}>
                  Your leave application history will appear here once you submit your first application.
                </p>
              </div>
            ) : (
              (Array.isArray(leaveHistory) ? leaveHistory : []).map((leave, index) => {
              const statusConfig = getStatusConfig(leave.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 6 }}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(156, 197, 161, 0.1)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(156, 197, 161, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: `${statusConfig.color}15`,
                          flexShrink: 0
                        }}
                      >
                        <FileText style={{ width: '24px', height: '24px', color: statusConfig.color }} />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#2A2A2A',
                          margin: '0 0 4px 0'
                        }}>
                          {leave.leaveType || leave.type} Leave
                        </h3>
                        <p style={{
                          color: '#646464',
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem'
                        }}>
                          {leave.reason}
                        </p>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px',
                          color: '#646464',
                          fontSize: '0.85rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar style={{ width: '16px', height: '16px' }} />
                            <span>{formatDate(leave.exitDate)} to {formatDate(leave.entryDate)}</span>
                          </div>
                          <span>• {calculateDuration(leave.exitDate, leave.entryDate)}</span>
                        </div>
                        <p style={{
                          color: '#646464',
                          marginTop: '8px',
                          fontSize: '0.85rem',
                          margin: '8px 0 0 0'
                        }}>
                          Applied on {formatDate(leave.createdAt)}
                        </p>
                        {leave.status === 'rejected' && (leave.rejectionReason || leave.rejectReason) && (
                          <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: 'rgba(216, 65, 46, 0.05)',
                            border: '1px solid rgba(216, 65, 46, 0.2)',
                            borderRadius: '8px'
                          }}>
                            <p style={{
                              color: '#D8412E',
                              margin: 0,
                              fontSize: '0.85rem',
                              fontWeight: 500
                            }}>
                              Rejection Reason: {leave.rejectionReason || leave.rejectReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          color: 'white',
                          textTransform: 'capitalize',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          backgroundColor: statusConfig.color,
                          flexShrink: 0
                        }}
                      >
                        <StatusIcon style={{ width: '16px', height: '16px' }} />
                        {leave.status}
                      </span>
                      
                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewLeaveForm(leave._id || leave.id);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye style={{ width: '12px', height: '12px' }} />
                          View
                        </motion.button>
                        
                        {leave.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelLeaveForm(leave._id || leave.id);
                              }}
                              style={{
                                padding: '6px 12px',
                                background: '#F59E0B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <XCircle style={{ width: '12px', height: '12px' }} />
                              Cancel
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLeaveForm(leave._id || leave.id);
                              }}
                              style={{
                                padding: '6px 12px',
                                background: '#EF4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <XCircle style={{ width: '12px', height: '12px' }} />
                              Delete
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplyLeaveForm;
