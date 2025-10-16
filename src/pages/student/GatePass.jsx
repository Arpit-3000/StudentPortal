import React, { useState, useEffect } from 'react';
import { QrCode, Clock, MapPin, User, Calendar, RefreshCw, CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react';
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
  const [currentStudentStatus, setCurrentStudentStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  // localStorage keys
  const QR_STORAGE_KEY = 'student_qr_data';
  const QR_TIMER_KEY = 'student_qr_timer';

  const destinationOptions = [
   
    'Una City',
    'HPMC',
    'Jaijon Morh',
    'Home',
    'Gym',
    'Music Room',
    'Dance Room',
    'Transit House',
    'Other',
  ];

  // Save QR data to localStorage
  const saveQRToStorage = (qrData) => {
    try {
      const dataToSave = {
        qrCode: qrData.qrCode,
        qrToken: qrData.qrToken,
        qrExpiry: qrData.qrExpiry,
        studentInfo: qrData.studentInfo,
        generatedAt: new Date().toISOString(),
        timeLeft: 300 // 5 minutes
      };
      localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(QR_TIMER_KEY, JSON.stringify({
        startTime: Date.now(),
        duration: 300000 // 5 minutes in milliseconds
      }));
    } catch (err) {
      console.error('Error saving QR to localStorage:', err);
    }
  };

  // Load QR data from localStorage
  const loadQRFromStorage = () => {
    try {
      const savedData = localStorage.getItem(QR_STORAGE_KEY);
      const savedTimer = localStorage.getItem(QR_TIMER_KEY);
      
      if (savedData && savedTimer) {
        const qrData = JSON.parse(savedData);
        const timerData = JSON.parse(savedTimer);
        
        // Calculate remaining time
        const elapsed = Date.now() - timerData.startTime;
        const remaining = Math.max(0, timerData.duration - elapsed);
        
        // If time hasn't expired, restore the QR data
        if (remaining > 0) {
          setQrCode(qrData.qrCode);
          setQrToken(qrData.qrToken);
          setQrExpiry(qrData.qrExpiry);
          setStudentInfo(qrData.studentInfo);
          setTimeLeft(Math.ceil(remaining / 1000)); // Convert to seconds
          return true;
        } else {
          // Time expired, clear storage
          clearQRFromStorage();
        }
      }
    } catch (err) {
      console.error('Error loading QR from localStorage:', err);
    }
    return false;
  };

  // Clear QR data from localStorage
  const clearQRFromStorage = () => {
    try {
      localStorage.removeItem(QR_STORAGE_KEY);
      localStorage.removeItem(QR_TIMER_KEY);
    } catch (err) {
      console.error('Error clearing QR from localStorage:', err);
    }
  };

  useEffect(() => {
    fetchGateStatus();
    // Try to load QR data from localStorage on component mount
    loadQRFromStorage();
    
    // Listen for storage changes (when QR is processed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === QR_STORAGE_KEY && e.newValue === null) {
        // QR was cleared in another tab, clear it here too
        setQrCode(null);
        setQrToken(null);
        setQrExpiry(null);
        setTimeLeft(0);
        setSuccess('QR code was processed in another tab.');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Check if QR was processed and remove from UI
  useEffect(() => {
    if (qrCode && qrToken) {
      const checkQRStatus = async () => {
        try {
          // Check if QR is still valid by trying to get current status
          const response = await studentAPI.getGateStatus();
          if (response.data.success) {
            const newStatus = response.data.data.currentStatus;
            // If status changed, QR was processed
            if (currentStudentStatus && newStatus !== currentStudentStatus) {
              setQrCode(null);
              setQrToken(null);
              setQrExpiry(null);
              setTimeLeft(0);
              setSuccess('QR code processed successfully! Your status has been updated.');
              setCurrentStudentStatus(newStatus);
              // Clear localStorage when QR is processed
              clearQRFromStorage();
              // Clear any existing intervals
              return true; // Signal to stop checking
            }
          }
        } catch (err) {
          console.error('Error checking QR status:', err);
        }
        return false;
      };

      // Check every 3 seconds if QR was processed
      const interval = setInterval(async () => {
        const shouldStop = await checkQRStatus();
        if (shouldStop) {
          clearInterval(interval);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [qrCode, qrToken, currentStudentStatus]);

  // Handle QR expiry after 5 minutes (300 seconds)
  useEffect(() => {
    let interval = null;
    if (qrCode && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          // If time expires, clear QR code
          if (newTime <= 0) {
            setQrCode(null);
            setQrToken(null);
            setQrExpiry(null);
            setSuccess('QR code has expired. Please generate a new one.');
            // Clear localStorage when QR expires
            clearQRFromStorage();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrCode, timeLeft]);

  const fetchGateStatus = async () => {
    try {
      const response = await studentAPI.getGateStatus();
      if (response.data.success) {
        setGateStatus(response.data.data);
        setCurrentStudentStatus(response.data.data.currentStatus);
      }
    } catch (err) {
      console.error('Failed to fetch gate status:', err);
    }
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    // Only require destination for exit (when student is IN)
    if (currentStudentStatus === 'in' && !destination.trim()) {
      setError('Please select a destination for exit');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // For entry pass (when student is out), send default destination
      // For exit pass (when student is in), send selected destination
      const requestData = currentStudentStatus === 'out' 
        ? { destination: 'Campus Entry' } 
        : { destination };
      const response = await studentAPI.generateGatePass(requestData);
      
      if (response.data.success) {
        const data = response.data.data;
        setQrCode(data.qrCode);
        setQrToken(data.token);
        setQrExpiry(data.expiresAt);
        setStudentInfo(data.studentInfo);
        setTimeLeft(300); // 5 minutes in seconds
        setSuccess(data.message || 'Gate pass generated successfully!');
        
        // Save QR data to localStorage for persistence
        saveQRToStorage({
          qrCode: data.qrCode,
          qrToken: data.token,
          qrExpiry: data.expiresAt,
          studentInfo: data.studentInfo
        });
        
        // Refresh student status after generating QR
        setTimeout(() => {
          fetchGateStatus();
        }, 1000);
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
              {currentStudentStatus === 'out' ? 'Generate Entry Pass' : 'Generate Exit Pass'}
            </h2>
          </div>

          {/* Student Status Alert */}
          {currentStudentStatus && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: currentStudentStatus === 'out' ? '#fef2f2' : '#f0f9ff',
              border: `1px solid ${currentStudentStatus === 'out' ? '#fecaca' : '#bfdbfe'}`,
              borderRadius: '6px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {currentStudentStatus === 'out' ? (
                <>
                  <XCircle size={16} color="#dc2626" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#dc2626', marginBottom: '2px' }}>
                      You are currently OUTSIDE campus
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7f1d1d' }}>
                      Generate a QR code to enter the campus.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle size={16} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981', marginBottom: '2px' }}>
                      You are currently INSIDE campus
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#065f46' }}>
                      Generate a QR code to exit the campus.
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

            <form onSubmit={handleGenerateQR} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Only show destination field when student is IN (exiting) */}
              {currentStudentStatus === 'in' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#4a5568', fontWeight: 600 }}>
                    Destination *
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required={true}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '0.9rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Select destination</option>
                    {destinationOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Show info message when student is OUT (entering) */}
              {currentStudentStatus === 'out' && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  color: '#1d4ed8',
                  textAlign: 'center'
                }}>
                  <strong>Entry Pass:</strong> Click generate to create your campus entry QR code. No destination selection needed.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (currentStudentStatus === 'in' && !destination.trim())}
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
                  background: loading || (currentStudentStatus === 'in' && !destination.trim())
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  cursor: loading || (currentStudentStatus === 'in' && !destination.trim()) ? 'not-allowed' : 'pointer',
                  opacity: loading || (currentStudentStatus === 'in' && !destination.trim()) ? 0.7 : 1,
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
                    Generate {currentStudentStatus === 'out' ? 'Entry' : 'Exit'} QR Code
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
                    {currentStudentStatus === 'out' ? 'Entry Type' : 'Destination'}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
                    {currentStudentStatus === 'out' ? 'Campus Entry' : destination}
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

                {/* JWT Token Display */}
                {qrToken && (
                  <div style={{ 
                    marginBottom: '12px', 
                    width: '100%',
                    maxWidth: '400px'
                  }}>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#6b7280', 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>JWT Token</span>
                      <button
                        onClick={() => copyToClipboard(qrToken)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          backgroundColor: copied ? '#10b981' : 'white',
                          color: copied ? 'white' : '#6b7280',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      color: '#374151',
                      wordBreak: 'break-all',
                      lineHeight: '1.4',
                      maxHeight: '80px',
                      overflow: 'auto'
                    }}>
                      {qrToken}
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
                  {currentStudentStatus === 'out' 
                    ? 'Generate a QR code to enter the campus' 
                    : 'Select a destination and generate a QR code to exit the campus'
                  }
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
            {currentStudentStatus === 'out' ? 'How to Enter Campus' : 'How to Exit Campus'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {currentStudentStatus === 'out' ? (
              <>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#ef4444',
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
                      Generate QR Code
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Click generate to create your entry pass
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#ef4444',
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
                      Show to Guard
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Present the QR code to the security guard
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                      Choose where you're going outside campus
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
                      Click generate to create your exit pass
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
              </>
            )}
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
