import React, { useState, useEffect } from 'react';
import { Home, Clock, User, Send, Eye, ArrowLeft, CheckCircle, X, AlertCircle, Trash2, Phone } from 'lucide-react';
import { studentAPI } from '../../services/api';

const LeaveFormDetails = ({ formId, onBack, onEdit }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusConfig = {
    pending: {
      color: 'warning',
      label: 'Pending',
      icon: <AlertCircle size={20} />,
      description: 'Your leave request is under review',
      bgColor: '#fef3c7',
      textColor: '#92400e',
    },
    approved: {
      color: 'success',
      label: 'Approved',
      icon: <CheckCircle size={20} />,
      description: 'Your leave request has been approved',
      bgColor: '#d1fae5',
      textColor: '#065f46',
    },
    rejected: {
      color: 'error',
      label: 'Rejected',
      icon: <X size={20} />,
      description: 'Your leave request has been rejected',
      bgColor: '#fee2e2',
      textColor: '#991b1b',
    },
    cancelled: {
      color: 'default',
      label: 'Cancelled',
      icon: <X size={20} />,
      description: 'Your leave request has been cancelled',
      bgColor: '#f3f4f6',
      textColor: '#374151',
    },
  };

  useEffect(() => {
    fetchFormDetails();
  }, [formId]);

  const fetchFormDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentAPI.getLeaveForm(formId);
      
      if (response.data.success) {
        setFormData(response.data.data.leaveForm);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch form details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const response = await studentAPI.deleteLeaveForm(formId);
      
      if (response.data.success) {
        setDeleteDialogOpen(false);
        onBack(); // Go back to the list
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete leave form. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (exitDate, entryDate) => {
    const exit = new Date(exitDate);
    const entry = new Date(entryDate);
    const diffTime = Math.abs(entry - exit);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        minHeight: '400px',
        background: 'linear-gradient(to bottom right, #f7fafc, #edf2f7)',
        padding: '8px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #667eea',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(to bottom right, #f7fafc, #edf2f7)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            color: '#c00',
          }}>
            {error}
          </div>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: '2px solid #667eea',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#667eea',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(to bottom right, #f7fafc, #edf2f7)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            color: '#92400e',
          }}>
            Form not found
          </div>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: '2px solid #667eea',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#667eea',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[formData.status] || statusConfig.pending;

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(to bottom right, #f7fafc, #edf2f7)',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '16px',
          color: 'white',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px', margin: 0 }}>
                Leave Form Details
              </h1>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>
                Form ID: {formData.id}
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div style={{
          backgroundColor: status.bgColor,
          border: `1px solid ${status.textColor}20`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          color: status.textColor,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {status.icon}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
              {status.label}
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
            {status.description}
          </p>
          {formData.rejectionReason && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              padding: '12px',
              marginTop: '12px',
              color: '#991b1b',
            }}>
              <strong>Rejection Reason:</strong> {formData.rejectionReason}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Student Information */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <User size={18} color="#667eea" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                Student Information
              </h2>
            </div>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Student Name</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  {formData.studentName}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Roll Number</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  {formData.rollNumber}
                </div>
              </div>
              {formData.studentPhone && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Student Phone</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                    {formData.studentPhone}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hostel Information */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <Home size={18} color="#667eea" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                Hostel Information
              </h2>
            </div>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Hostel Name</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  {formData.hostelName}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Room Number</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  {formData.roomNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Leave Schedule */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <Clock size={18} color="#667eea" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                Leave Schedule
              </h2>
            </div>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Exit Date & Time</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  {formatDate(formData.exitDate)} at {formData.exitTime}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Entry Date & Time</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  {formatDate(formData.entryDate)} at {formData.entryTime}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Leave Duration</div>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {formData.leaveDuration || getDuration(formData.exitDate, formData.entryDate)} days
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Reason for Leave</div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#374151',
              lineHeight: '1.5',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              {formData.reason}
            </div>
          </div>

          {/* Emergency Contact */}
          {formData.emergencyContact && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <Phone size={18} color="#667eea" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                  Emergency Contact
                </h2>
              </div>
              <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '16px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Contact Name</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                    {formData.emergencyContact.name}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Phone Number</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                    {formData.emergencyContact.phone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Relation</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                    {formData.emergencyContact.relation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', margin: '0 0 12px 0' }}>
              Timeline
            </h2>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Submitted At</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  {formatDateTime(formData.submittedAt)}
                </div>
              </div>
              {formData.approvedAt && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                    {formData.status === 'approved' ? 'Approved At' : 'Processed At'}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                    {formatDateTime(formData.approvedAt)}
                  </div>
                </div>
              )}
              {formData.approvedBy && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Processed By</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                    {formData.approvedBy}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
            marginTop: 'auto'
          }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: 600,
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              Back to Forms
            </button>
            {formData.status === 'pending' && onEdit && (
              <button
                onClick={() => onEdit(formData.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <Send size={16} />
                Edit Form
              </button>
            )}
            {formData.status === 'pending' && (
              <button
                onClick={handleDeleteClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={16} />
                Delete Form
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', margin: 0 }}>
              Delete Leave Form
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '16px', margin: '0 0 16px 0' }}>
              Are you sure you want to delete this leave form? This action cannot be undone.
            </p>
            {formData && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                  <strong>Leave Period:</strong> {formatDate(formData.exitDate)} - {formatDate(formData.entryDate)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                  <strong>Reason:</strong> {formData.reason?.substring(0, 100)}{formData.reason?.length > 100 ? '...' : ''}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  <strong>Status:</strong> {status.label}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Form
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LeaveFormDetails;
