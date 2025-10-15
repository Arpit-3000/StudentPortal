import React, { useState } from 'react';
import { Home, Clock, User, Send, Eye } from 'lucide-react';
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
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(to bottom right, #f7fafc, #edf2f7)',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Compact Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '8px',
          color: 'white',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1px', margin: 0 }}>
                Apply for Leave
              </h1>
              <p style={{ fontSize: '0.7rem', opacity: 0.9, margin: 0 }}>
                Fill in the details to submit your leave request
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
          {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#c00',
          }}>
              {error}
          </div>
          )}
          {success && (
          <div style={{
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#060',
          }}>
              {success}
          </div>
        )}

        {/* Main Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
              {/* Hostel Information */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '6px',
              }}>
                <Home size={14} color="#667eea" />
                <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                  Hostel Information
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Hostel Name *
                  </label>
                  <select
                    value={formData.hostelName}
                    onChange={(e) => handleInputChange('hostelName', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  >
                    <option value="">Select hostel</option>
                    {hostelOptions.map((hostel) => (
                      <option key={hostel} value={hostel}>{hostel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    placeholder="e.g., 101, 205"
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />

            {/* Leave Schedule */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '6px',
              }}>
                <Clock size={14} color="#667eea" />
                <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                  Leave Schedule
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Exit Date *
                  </label>
                  <input
                    type="date"
                    value={formData.exitDate}
                    onChange={(e) => handleInputChange('exitDate', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Entry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => handleInputChange('entryDate', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Exit Time *
                  </label>
                  <input
                    type="time"
                    value={formData.exitTime}
                    onChange={(e) => handleInputChange('exitTime', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Entry Time *
                  </label>
                  <input
                    type="time"
                    value={formData.entryTime}
                    onChange={(e) => handleInputChange('entryTime', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                  Reason for Leave *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Please provide a detailed reason (10-500 characters)"
                  rows="2"
                  maxLength="500"
                  required
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: '0.8rem',
                    border: formData.reason.length > 0 && formData.reason.length < 10 ? '2px solid #f87171' : '2px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '0.65rem', color: '#6b7280' }}>
                  <span>
                    {formData.reason.length < 10 
                      ? `${10 - formData.reason.length} more characters required`
                      : 'Minimum length met'}
                  </span>
                  <span>{formData.reason.length}/500 characters</span>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />

              {/* Emergency Contact */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '6px',
              }}>
                <User size={14} color="#667eea" />
                <h2 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                  Emergency Contact
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
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
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    placeholder="10-digit number"
                    maxLength="10"
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '3px', fontSize: '0.75rem', color: '#4a5568' }}>
                    Relation *
                  </label>
                  <select
                    value={formData.emergencyContact.relation}
                    onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                    }}
                  >
                    <option value="">Select relation</option>
                    {relationOptions.map((relation) => (
                      <option key={relation} value={relation}>{relation}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
              paddingTop: '8px',
              borderTop: '1px solid #e2e8f0',
              marginTop: '12px'
            }}>
              <button
                type="button"
                    disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '2px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <Eye size={12} />
                    View My Forms
              </button>
              <button
                    type="submit"
                    disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '6px 16px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    Submit Form
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ApplyLeaveForm;
