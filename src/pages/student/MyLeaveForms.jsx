import React, { useState, useEffect } from 'react';
import { Home, Clock, User, Send, Eye, Search, RefreshCw, Plus, Trash2, Filter } from 'lucide-react';
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

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(to bottom right, #f7fafc, #edf2f7)',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px', margin: 0 }}>
                  My Leave Forms
                </h1>
                <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>
                  View and manage your leave applications
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleRefresh}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={onAddNew}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                Apply New Leave
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
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
        )}

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search by reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                fontSize: '0.9rem',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
          <div style={{ minWidth: '150px' }}>
            <select
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.9rem',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white',
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

        {/* Leave Forms Cards */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {leaveForms.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '16px', opacity: 0.5 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', margin: 0 }}>
                No leave forms found
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
                {filters.status ? 'Try changing the status filter.' : 'Start by applying for a new leave form.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaveForms
                .filter(form => 
                  !searchTerm || 
                  form.reason.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((form) => (
                  <div
                    key={form.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#fafafa',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f9ff';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                      e.currentTarget.style.borderColor = '#e5e7eb';
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
                        <button
                          onClick={() => onViewForm(form.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            border: '2px solid #667eea',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            color: '#667eea',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                        {form.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteClick(form)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              border: '2px solid #ef4444',
                              borderRadius: '4px',
                              backgroundColor: 'white',
                              color: '#ef4444',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
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
                          padding: '2px 8px',
                          backgroundColor: '#667eea',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600
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
                  </div>
                ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', gap: '8px' }}>
              <button
                onClick={() => handlePageChange(null, pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasPrev ? 1 : 0.5,
                }}
              >
                Previous
              </button>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                fontSize: '0.9rem',
                color: '#6b7280'
              }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(null, pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: '2px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasNext ? 1 : 0.5,
                }}
              >
                Next
              </button>
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

export default MyLeaveForms;
