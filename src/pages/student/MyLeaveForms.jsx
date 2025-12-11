import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Clock, User, Send, Eye, Search, RefreshCw, Plus, Trash2, Filter, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { studentAPI } from '../../services/api';

const MyLeaveForms = ({ onAddNew, onViewForm }) => {
  const [leaveForms, setLeaveForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeaveForms: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    cancelled: 'default',
  };

  const statusLabels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  };

  const fetchLeaveForms = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.status && { status: filters.status }),
      };

      const response = await studentAPI.getMyLeaveForms(params);
      
      if (response.data.success) {
        setLeaveForms(response.data.data.leaveForms);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveForms();
  }, [filters]);

  const handleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handlePageChange = (event, page) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleRefresh = () => {
    fetchLeaveForms();
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formToDelete) return;

    setDeleting(true);
    try {
      const response = await studentAPI.deleteLeaveForm(formToDelete.id);
      
      if (response.data.success) {
        setDeleteDialogOpen(false);
        setFormToDelete(null);
        fetchLeaveForms(); // Refresh the list
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete leave form. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  const handleCancelForm = async (formId) => {
    if (window.confirm('Are you sure you want to cancel this leave form?')) {
      try {
        setLoading(true);
        const response = await studentAPI.cancelLeaveForm(formId);
        
        if (response.data.success) {
          fetchLeaveForms(); // Refresh the list
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel leave form. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
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

  if (loading && leaveForms.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '24px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <Loader size={48} className="animate-spin" style={{ color: '#1e293b' }} />
          <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>
            Loading your leave forms...
          </p>
        </motion.div>
      </div>
    );
  }

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
          maxWidth: '1200px', 
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
              My Leave Forms
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9, 
              margin: '0 0 24px 0',
              fontWeight: 400
            }}>
              View and manage your leave applications
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <motion.button
                onClick={handleRefresh}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <RefreshCw size={18} />
                Refresh
              </motion.button>
              <motion.button
                onClick={onAddNew}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Plus size={18} />
                Apply New Leave
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Professional Error Alert */}
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
        </div>

        {/* Professional Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '0 32px 32px 32px'
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            padding: '24px',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search by reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div style={{ minWidth: '180px' }}>
              <select
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
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
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Professional Leave Forms Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            padding: '0 32px 32px 32px'
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            padding: '24px',
            border: '1px solid #f1f5f9'
          }}>
            {leaveForms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  color: '#64748b'
                }}
              >
                <Calendar size={64} style={{ marginBottom: '20px', opacity: 0.6, color: '#1e293b' }} />
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  marginBottom: '12px', 
                  margin: '0 0 12px 0',
                  color: '#1e293b'
                }}>
                  No leave forms found
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  margin: 0, 
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  {filters.status ? 'Try changing the status filter to see more results.' : 'Start by applying for a new leave form to get started.'}
                </p>
              </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {leaveForms
                .filter(form => 
                  !searchTerm || 
                  form.reason.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((form) => (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: '20px',
                      backgroundColor: '#fafafa',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#1e293b';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 41, 59, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          padding: '4px 8px',
                          backgroundColor: statusColors[form.status] === 'warning' ? '#fef3c7' : 
                                          statusColors[form.status] === 'success' ? '#d1fae5' :
                                          statusColors[form.status] === 'error' ? '#fee2e2' : '#f3f4f6',
                          color: statusColors[form.status] === 'warning' ? '#92400e' : 
                                 statusColors[form.status] === 'success' ? '#065f46' :
                                 statusColors[form.status] === 'error' ? '#991b1b' : '#374151',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {statusLabels[form.status]}
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: '#6b7280',
                          backgroundColor: '#f3f4f6',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          #{form.id.slice(-8)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                          onClick={() => onViewForm(form.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '2px solid #1e293b',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            color: '#1e293b',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Eye size={16} />
                          View
                        </motion.button>
                        {form.status === 'pending' && (
                          <>
                            <motion.button
                              onClick={() => handleCancelForm(form.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                border: '2px solid #f59e0b',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                color: '#f59e0b',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <AlertCircle size={16} />
                              Cancel
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteClick(form)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                border: '2px solid #ef4444',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                color: '#ef4444',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Trash2 size={16} />
                              Delete
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Hostel & Room</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                          {form.hostelName} - Room {form.roomNumber}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Leave Period</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                          {formatDate(form.exitDate)} - {formatDate(form.entryDate)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {form.exitTime} - {form.entryTime}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Duration</div>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: '#1e293b',
                          color: 'white',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 4px rgba(30, 41, 59, 0.2)'
                        }}>
                          {getDuration(form.exitDate, form.entryDate)} days
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Submitted</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                          {formatDateTime(form.submittedAt)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Reason</div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#374151',
                        lineHeight: '1.4',
                        maxHeight: '3em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {form.reason}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}

          {/* Professional Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', gap: '12px' }}>
              <motion.button
                onClick={() => handlePageChange(null, pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 20px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasPrev ? 1 : 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Previous
              </motion.button>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                fontSize: '0.95rem',
                color: '#64748b',
                fontWeight: 500,
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <motion.button
                onClick={() => handlePageChange(null, pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 20px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasNext ? 1 : 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Next
              </motion.button>
            </div>
          )}

          {/* Summary */}
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '0.8rem',
            color: '#6b7280'
          }}>
            <span>Showing {leaveForms.length} of {pagination.totalLeaveForms} forms</span>
            <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Professional Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '1px solid #f1f5f9'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', margin: 0 }}>
              Delete Leave Form
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '16px', margin: '0 0 16px 0' }}>
              Are you sure you want to delete this leave form? This action cannot be undone.
            </p>
            {formToDelete && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                  <strong>Leave Period:</strong> {formatDate(formToDelete.exitDate)} - {formatDate(formToDelete.entryDate)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                  <strong>Reason:</strong> {formToDelete.reason?.substring(0, 100)}{formToDelete.reason?.length > 100 ? '...' : ''}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  <strong>Status:</strong> {statusLabels[formToDelete.status] || formToDelete.status}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <motion.button
                onClick={handleDeleteCancel}
                disabled={deleting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                {deleting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Form
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

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

export default MyLeaveForms;
