import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Clock, 
  User, 
  Send, 
  Eye, 
  Calendar,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { studentAPI } from '../../services/api';

const ApplyLeaveForm = () => {
  const [formData, setFormData] = useState({
    hostelName: '',
    roomNumber: '',
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hostelOptions = ['Iravati', 'Vipasha', 'Kalindi', 'Askini'];
  const relationOptions = ['Father', 'Mother', 'Brother', 'Sister', 'Guardian', 'Other'];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form data before submission
      if (!formData.hostelName || !formData.roomNumber || !formData.exitDate || 
          !formData.entryDate || !formData.exitTime || !formData.entryTime || 
          !formData.reason || !formData.emergencyContact.name || 
          !formData.emergencyContact.phone || !formData.emergencyContact.relation) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate reason length
      if (formData.reason.length < 10) {
        setError('Reason must be at least 10 characters long');
        setLoading(false);
        return;
      }

      // Validate phone number
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.emergencyContact.phone)) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
      }

      // Submit the form to API
      const response = await studentAPI.submitLeaveForm(formData);
      
      if (response.data.success) {
        setSuccess('Leave form submitted successfully!');
        // Reset form after successful submission
        setFormData({
          hostelName: '',
          roomNumber: '',
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
      } else {
        setError(response.data.message || 'Failed to submit leave form');
      }
    } catch (error) {
      console.error('Submit leave form error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const validationErrors = error.response.data.errors.map(err => err.msg).join(', ');
        setError(validationErrors);
      } else {
        setError('Failed to submit leave form. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          maxWidth: '900px', 
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Professional Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '32px',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'rotate(45deg)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-30%',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%'
          }} />
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Calendar size={48} style={{ marginBottom: '16px' }} />
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              margin: '0 0 8px 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Apply for Leave
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9, 
              margin: 0,
              fontWeight: 400
            }}>
              Submit your leave request with complete details
            </p>
          </motion.div>
        </div>

        {/* Professional Alerts */}
        <div style={{ padding: '0 32px', marginTop: '24px' }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                color: '#16a34a',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            >
              <CheckCircle size={20} />
              {success}
            </motion.div>
          )}
        </div>

        {/* Professional Form */}
        <div style={{ padding: '0 32px 32px 32px' }}>
          <form onSubmit={handleSubmit}>
            {/* Hostel Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: '32px' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #f1f5f9'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Home size={20} color="white" />
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: '#1e293b', 
                    margin: '0 0 4px 0' 
                  }}>
                    Hostel Information
                  </h2>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#64748b', 
                    margin: 0 
                  }}>
                    Provide your accommodation details
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px' 
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Hostel Name *
                  </label>
                  <select
                    value={formData.hostelName}
                    onChange={(e) => handleInputChange('hostelName', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      backgroundColor: '#fafafa',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 41, 59, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fafafa';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select your hostel</option>
                    {hostelOptions.map((hostel) => (
                      <option key={hostel} value={hostel}>{hostel} Hostel</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Room Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin 
                      size={18} 
                      style={{ 
                        position: 'absolute', 
                        left: '16px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} 
                    />
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                      placeholder="e.g., 101, 205, 301"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        backgroundColor: '#fafafa',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Leave Schedule Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: '32px' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #f1f5f9'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={20} color="white" />
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: '#1e293b', 
                    margin: '0 0 4px 0' 
                  }}>
                    Leave Schedule
                  </h2>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#64748b', 
                    margin: 0 
                  }}>
                    Specify your departure and return details
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Exit Date *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar 
                      size={18} 
                      style={{ 
                        position: 'absolute', 
                        left: '16px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} 
                    />
                    <input
                      type="date"
                      value={formData.exitDate}
                      onChange={(e) => handleInputChange('exitDate', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        backgroundColor: '#fafafa',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Entry Date *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar 
                      size={18} 
                      style={{ 
                        position: 'absolute', 
                        left: '16px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} 
                    />
                    <input
                      type="date"
                      value={formData.entryDate}
                      onChange={(e) => handleInputChange('entryDate', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        backgroundColor: '#fafafa',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Exit Time *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Clock 
                      size={18} 
                      style={{ 
                        position: 'absolute', 
                        left: '16px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} 
                    />
                    <input
                      type="time"
                      value={formData.exitTime}
                      onChange={(e) => handleInputChange('exitTime', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        backgroundColor: '#fafafa',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Entry Time *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Clock 
                      size={18} 
                      style={{ 
                        position: 'absolute', 
                        left: '16px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} 
                    />
                    <input
                      type="time"
                      value={formData.entryTime}
                      onChange={(e) => handleInputChange('entryTime', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        backgroundColor: '#fafafa',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.9rem', 
                  fontWeight: 600,
                  color: '#374151' 
                }}>
                  Reason for Leave *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Please provide a detailed reason for your leave (minimum 10 characters)"
                  rows="4"
                  maxLength="500"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '0.95rem',
                    border: formData.reason.length > 0 && formData.reason.length < 10 ? '2px solid #f87171' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: '#fafafa',
                    transition: 'all 0.2s ease',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.backgroundColor = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = formData.reason.length > 0 && formData.reason.length < 10 ? '#f87171' : '#e5e7eb';
                    e.target.style.backgroundColor = '#fafafa';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px', 
                  fontSize: '0.8rem', 
                  color: formData.reason.length < 10 ? '#dc2626' : '#6b7280' 
                }}>
                  <span style={{ fontWeight: 500 }}>
                    {formData.reason.length < 10 
                      ? `${10 - formData.reason.length} more characters required`
                      : 'Minimum length requirement met'}
                  </span>
                  <span>{formData.reason.length}/500 characters</span>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: '32px' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #f1f5f9'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={20} color="white" />
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: '#1e293b', 
                    margin: '0 0 4px 0' 
                  }}>
                    Emergency Contact
                  </h2>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#64748b', 
                    margin: 0 
                  }}>
                    Provide contact details for emergency situations
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '20px' 
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    placeholder="Full name"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      backgroundColor: '#fafafa',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 41, 59, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fafafa';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Phone Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone 
                      size={18} 
                      style={{ 
                        position: 'absolute', 
                        left: '16px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} 
                    />
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      placeholder="10-digit number"
                      maxLength="10"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        backgroundColor: '#fafafa',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#374151' 
                  }}>
                    Relation *
                  </label>
                  <select
                    value={formData.emergencyContact.relation}
                    onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      backgroundColor: '#fafafa',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1e293b';
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 41, 59, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fafafa';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select relation</option>
                    {relationOptions.map((relation) => (
                      <option key={relation} value={relation}>{relation}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Professional Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '2px solid #f1f5f9',
                marginTop: '24px'
              }}
            >
              <motion.button
                type="button"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = '#1e293b';
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.boxShadow = '0 4px 12px rgba(30, 41, 59, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = 'white';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                <Eye size={18} />
                View My Forms
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(30, 41, 59, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 6px 20px rgba(30, 41, 59, 0.4)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 4px 12px rgba(30, 41, 59, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Leave Form
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ApplyLeaveForm;
