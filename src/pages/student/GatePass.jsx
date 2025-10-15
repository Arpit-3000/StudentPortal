import React, { useState, useEffect } from 'react';
import { QrCode, Clock, MapPin, User, Calendar, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { studentAPI } from '../../services/api';

const GatePass = () => {
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [qrToken, setQrToken] = useState(null);
  const [qrExpiry, setQrExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gateStatus, setGateStatus] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);

  const destinationOptions = [
    'Library',
    'Canteen',
    'Sports Complex',
    'Computer Lab',
    'Physics Lab',
    'Chemistry Lab',
    'Mathematics Department',
    'Administrative Office',
    'Hostel',
    'Parking Area',
    'Other'
  ];

  useEffect(() => {
    fetchGateStatus();
  }, []);

  useEffect(() => {
    let interval = null;
    if (qrExpiry && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && qrCode) {
      setQrCode(null);
      setQrExpiry(null);
    }
    return () => clearInterval(interval);
  }, [timeLeft, qrCode]);

  const fetchGateStatus = async () => {
    try {
      const response = await studentAPI.getGateStatus();
      if (response.data.success) {
        setGateStatus(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch gate status:', err);
    }
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError('Please select a destination');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await studentAPI.generateGatePass({ destination });
      
      if (response.data.success) {
        const data = response.data.data;
        setQrCode(data.qrCode);
        setQrToken(data.token);
        setQrExpiry(data.expiresAt);
        setStudentInfo(data.studentInfo);
        setTimeLeft(300); // 5 minutes in seconds
        setSuccess('Gate pass generated successfully!');
      } else {
        setError(response.data.message || 'Failed to generate gate pass');
      }
    } catch (err) {
      console.error('Generate gate pass error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to generate gate pass. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#10b981';
      case 'closed': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <CheckCircle size={16} />;
      case 'closed': return <XCircle size={16} />;
      case 'maintenance': return <AlertCircle size={16} />;
      default: return <AlertCircle size={16} />;
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <QrCode size={24} />
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px', margin: 0 }}>
                Gate Pass
              </h1>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>
                Generate QR code for campus access
              </p>
            </div>
          </div>
        </div>

        {/* Gate Status */}
        {gateStatus && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {getStatusIcon(gateStatus.status)}
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                Gate Status: 
              </span>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: getStatusColor(gateStatus.status),
                textTransform: 'capitalize'
              }}>
                {gateStatus.status}
              </span>
            </div>
            <button
              onClick={fetchGateStatus}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#6b7280',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
        )}

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

        {/* Success Alert */}
        {success && (
          <div style={{
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            color: '#060',
          }}>
            {success}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Generate QR Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}>
              <MapPin size={18} color="#3b82f6" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                Generate Gate Pass
              </h2>
            </div>

            <form onSubmit={handleGenerateQR} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#4a5568', fontWeight: 600 }}>
                  Destination *
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <option value="">Select destination</option>
                  {destinationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !destination.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  background: loading || !destination.trim() 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  cursor: loading || !destination.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !destination.trim() ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode size={16} />
                    Generate QR Code
                  </>
                )}
              </button>
            </form>
          </div>

          {/* QR Code Display */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
          }}>
            {qrCode ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={qrCode} 
                    alt="Gate Pass QR Code"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '6px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                    Destination
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
                    {destination}
                  </div>
                </div>

                {studentInfo && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                      Student Info
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                      <div style={{ fontWeight: 600 }}>{studentInfo.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        Roll: {studentInfo.rollNumber} | Status: {studentInfo.currentStatus}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{
                  padding: '8px 16px',
                  backgroundColor: timeLeft < 60 ? '#fef2f2' : '#f0f9ff',
                  border: `1px solid ${timeLeft < 60 ? '#fecaca' : '#bfdbfe'}`,
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: timeLeft < 60 ? '#dc2626' : '#1d4ed8',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <Clock size={14} />
                  {timeLeft < 60 ? `Expires in ${formatTime(timeLeft)}` : `Valid for ${formatTime(timeLeft)}`}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <QrCode size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', margin: '0 0 8px 0' }}>
                  No QR Code Generated
                </h3>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                  Select a destination and generate a QR code to access the campus
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '20px',
          marginTop: '16px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', margin: '0 0 12px 0', color: '#2d3748' }}>
            How to use Gate Pass
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 600,
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Select Destination
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Choose where you're going on campus
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 600,
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Generate QR Code
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Click generate to create your gate pass
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 600,
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Show to Guard
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Present the QR code to the security guard
                </div>
              </div>
            </div>
          </div>
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

export default GatePass;
