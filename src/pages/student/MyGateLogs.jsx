import React, { useState, useEffect } from 'react';
import { QrCode, Clock, MapPin, User, Calendar, RefreshCw, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { studentAPI } from '../../services/api';

const MyGateLogs = () => {
  const [gateLogs, setGateLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGateLogs();
  }, []);

  const fetchGateLogs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentAPI.getMyGateLogs();
      
      if (response.data.success) {
        setGateLogs(response.data.data || []);
      }
    } catch (err) {
      console.error('Fetch gate logs error:', err);
      setError(err.response?.data?.message || 'Failed to fetch gate logs. Please try again.');
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'scanned': return '#10b981';
      case 'expired': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scanned': return <CheckCircle size={16} />;
      case 'expired': return <XCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) {
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
          border: '4px solid #3b82f6',
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '16px',
          color: 'white',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <QrCode size={24} />
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px', margin: 0 }}>
                  My Gate Logs
                </h1>
                <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>
                  View your gate pass history and access records
                </p>
              </div>
            </div>
            <button
              onClick={fetchGateLogs}
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

        {/* Gate Logs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {gateLogs.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <QrCode size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', margin: 0 }}>
                No Gate Logs Found
              </h3>
              <p style={{ fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
                You haven't generated any gate passes yet. Start by creating your first gate pass.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {gateLogs.map((log, index) => (
                <div
                  key={log.id || index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        padding: '4px 8px',
                        backgroundColor: getStatusColor(log.status) === '#10b981' ? '#d1fae5' : 
                                        getStatusColor(log.status) === '#ef4444' ? '#fee2e2' :
                                        getStatusColor(log.status) === '#f59e0b' ? '#fef3c7' : '#f3f4f6',
                        color: getStatusColor(log.status),
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getStatusIcon(log.status)}
                        {log.status}
                      </div>
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        backgroundColor: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        #{log.id ? log.id.slice(-8) : `LOG${index + 1}`}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#6b7280',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {formatDate(log.createdAt || log.generatedAt)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Destination</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                        {log.destination}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Action</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>
                        {log.action}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Generated At</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                        {formatDateTime(log.createdAt || log.generatedAt)}
                      </div>
                    </div>
                    {log.scannedAt && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Scanned At</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                          {formatDateTime(log.scannedAt)}
                        </div>
                      </div>
                    )}
                    {log.expiresAt && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Expires At</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                          {formatDateTime(log.expiresAt)}
                        </div>
                      </div>
                    )}
                  </div>

                  {log.scannedBy && (
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: '#1d4ed8'
                    }}>
                      <strong>Scanned by:</strong> {log.scannedBy}
                    </div>
                  )}

                  {log.remarks && (
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: '#374151',
                      marginTop: '8px'
                    }}>
                      <strong>Remarks:</strong> {log.remarks}
                    </div>
                  )}

                  {log.qrCode && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      marginTop: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>
                        <strong>QR Code Used:</strong>
                      </div>
                      <img 
                        src={log.qrCode} 
                        alt="Gate Pass QR Code"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'contain',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {gateLogs.length > 0 && (
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              fontSize: '0.8rem',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Showing {gateLogs.length} gate log{gateLogs.length !== 1 ? 's' : ''}
            </div>
          )}
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

export default MyGateLogs;
