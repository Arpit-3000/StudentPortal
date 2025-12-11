import React, { useState, useEffect } from 'react';
import { QrCode, Clock, MapPin, RefreshCw, CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { studentAPI } from '../../services/api';

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
  const [showForm, setShowForm] = useState(true);
  const [gateLogs, setGateLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const QR_STORAGE_KEY = 'student_qr_data';
  const QR_TIMER_KEY = 'student_qr_timer';

  useEffect(() => {
    fetchGateStatus();
    fetchGateLogs();
    loadQRFromStorage();

    const handleStorageChange = (e) => {
      if (e.key === QR_STORAGE_KEY && e.newValue === null) {
        setQrCode(null);
        setQrToken(null);
        setQrExpiry(null);
        setTimeLeft(0);
        setSuccess('QR code was processed in another tab.');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!qrCode || !qrToken) return;

    const checkQRStatus = async () => {
      try {
        const response = await studentAPI.getGateStatus();
        if (response.data.success) {
          const newStatus = response.data.data.currentStatus;
          if (currentStudentStatus && newStatus !== currentStudentStatus) {
            setQrCode(null);
            setQrToken(null);
            setQrExpiry(null);
            setTimeLeft(0);
            setSuccess('QR code processed successfully! Your status was updated.');
            setCurrentStudentStatus(newStatus);
            clearQRFromStorage();
            return true;
          }
        }
      } catch (err) {
        console.error('Error checking QR status:', err);
      }
      return false;
    };

    const interval = setInterval(async () => {
      const shouldStop = await checkQRStatus();
      if (shouldStop) clearInterval(interval);
    }, 3000);

    return () => clearInterval(interval);
  }, [qrCode, qrToken, currentStudentStatus]);

  useEffect(() => {
    if (!qrCode || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setQrCode(null);
          setQrToken(null);
          setQrExpiry(null);
          setSuccess('QR code expired. Generate a new one.');
          clearQRFromStorage();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
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

  const fetchGateLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await studentAPI.getMyGateLogs();
      if (response.data.success) {
        const data = response.data.data;
        const logs = Array.isArray(data) ? data : data?.logs || [];
        setGateLogs(logs);
      }
    } catch (err) {
      console.error('Failed to fetch gate logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    if (currentStudentStatus === null) {
      setError('Fetching your current status. Please try again in 2 seconds.');
      return;
    }

    if (currentStudentStatus === 'in' && !destination.trim()) {
      setError('Please select a destination for exit');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const requestData =
        currentStudentStatus === 'out' ? { destination: 'Campus Entry' } : { destination };
      const response = await studentAPI.generateGatePass(requestData);

      if (response.data.success) {
        const data = response.data.data;
        setQrCode(data.qrCode);
        setQrToken(data.token);
        setQrExpiry(data.expiresAt);
        setStudentInfo(data.studentInfo);
        setTimeLeft(300);
        setSuccess(data.message || 'Gate pass generated successfully!');

        saveQRToStorage({
          qrCode: data.qrCode,
          qrToken: data.token,
          qrExpiry: data.expiresAt,
          studentInfo: data.studentInfo,
        });

        setTimeout(() => {
          fetchGateStatus();
          fetchGateLogs();
        }, 1000);
      } else {
        setError(response.data.message || 'Failed to generate gate pass');
      }
    } catch (err) {
      console.error('Generate gate pass error:', err);
      setError(err.response?.data?.message || 'Failed to generate gate pass. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveQRToStorage = (qrData) => {
    try {
      localStorage.setItem(QR_STORAGE_KEY, JSON.stringify({ ...qrData, generatedAt: new Date().toISOString() }));
      localStorage.setItem(
        QR_TIMER_KEY,
        JSON.stringify({ startTime: Date.now(), duration: 300000 })
      );
    } catch (err) {
      console.error('Error saving QR to localStorage:', err);
    }
  };

  const loadQRFromStorage = () => {
    try {
      const savedData = localStorage.getItem(QR_STORAGE_KEY);
      const savedTimer = localStorage.getItem(QR_TIMER_KEY);
      if (savedData && savedTimer) {
        const qrData = JSON.parse(savedData);
        const timer = JSON.parse(savedTimer);
        const elapsed = Date.now() - timer.startTime;
        const remaining = Math.max(0, timer.duration - elapsed);
        if (remaining > 0) {
          setQrCode(qrData.qrCode);
          setQrToken(qrData.qrToken);
          setQrExpiry(qrData.qrExpiry);
          setStudentInfo(qrData.studentInfo);
          setTimeLeft(Math.ceil(remaining / 1000));
        } else {
          clearQRFromStorage();
        }
      }
    } catch (err) {
      console.error('Error loading QR from localStorage:', err);
    }
  };

  const clearQRFromStorage = () => {
    try {
      localStorage.removeItem(QR_STORAGE_KEY);
      localStorage.removeItem(QR_TIMER_KEY);
    } catch (err) {
      console.error('Error clearing QR from localStorage:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeDisplay = (from, to) => {
    if (!from && !to) return '-';
    const opts = { hour: '2-digit', minute: '2-digit' };
    const fromStr = from ? new Date(from).toLocaleTimeString('en-IN', opts) : '';
    const toStr = to ? new Date(to).toLocaleTimeString('en-IN', opts) : '';
    if (fromStr && toStr) return `${fromStr} - ${toStr}`;
    return fromStr || toStr;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#3b82f6';
      case 'closed':
        return '#ef4444';
      case 'maintenance':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <CheckCircle size={16} />;
      case 'closed':
        return <XCircle size={16} />;
      case 'maintenance':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const isStatusLoading = currentStudentStatus === null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: '#1f2937', letterSpacing: '-0.02em' }}>
                🚪 Gate Pass System
              </h1>
              <p style={{ marginTop: '8px', fontSize: '1.1rem', color: '#6b7280', fontWeight: 500 }}>
                Generate QR codes for seamless campus entry & exit
              </p>
            </div>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem',
                background: showForm ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
              }}
            >
              <QrCode size={20} />
              {showForm ? 'Hide Form' : 'Generate QR Pass'}
            </button>
          </div>
        </div>

        {/* Gate status & Current Status */}
        <div style={{ display: 'grid', gridTemplateColumns: gateStatus ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '24px' }}>
          {gateStatus && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Gate Status</h3>
                <button
                  onClick={fetchGateStatus}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '12px', 
                  background: gateStatus.status === 'open' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  {getStatusIcon(gateStatus.status)}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Current Status</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getStatusColor(gateStatus.status), textTransform: 'capitalize' }}>
                    {gateStatus.status}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStudentStatus && (
            <div
              style={{
                background: currentStudentStatus === 'out' 
                  ? 'linear-gradient(135deg, #fef3c7, #fde68a)' 
                  : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                border: '2px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: '0 0 12px 0' }}>Your Status</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '12px', 
                  background: currentStudentStatus === 'out' ? '#f59e0b' : '#3b82f6',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                }}>
                  {currentStudentStatus === 'out' ? <XCircle size={24} /> : <CheckCircle size={24} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>You are currently</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: currentStudentStatus === 'out' ? '#d97706' : '#2563eb', textTransform: 'uppercase' }}>
                    {currentStudentStatus}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '24px',
              color: '#991b1b',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AlertCircle size={24} />
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              border: '2px solid #3b82f6',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '24px',
              color: '#1e40af',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckCircle size={24} />
            {success}
          </div>
        )}

        {/* Form + QR */}
        {showForm && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Form */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  padding: '32px',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                  }}>
                    <MapPin size={24} color="white" />
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1f2937' }}>
                    {currentStudentStatus === 'out' ? '🔓 Entry Pass' : '🚪 Exit Pass'}
                  </h2>
                </div>

                <form onSubmit={handleGenerateQR} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {currentStudentStatus === 'in' && (
                    <div>
                      <label style={{ display: 'block', marginBottom: 10, fontSize: '1rem', fontWeight: 700, color: '#374151' }}>
                        📍 Select Destination *
                      </label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          backgroundColor: 'white',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: '#1f2937',
                          transition: 'all 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      >
                        <option value="">Choose where you're going...</option>
                        {destinationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {currentStudentStatus === 'out' && (
                    <div
                      style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                        border: '2px solid #3b82f6',
                        borderRadius: '12px',
                        color: '#1e40af',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textAlign: 'center',
                      }}
                    >
                      🔓 <strong>Entry Pass:</strong> No destination needed. Click generate to enter campus!
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={isStatusLoading || loading || (currentStudentStatus === 'in' && !destination.trim())}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '18px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: 800,
                      color: '#fff',
                      fontSize: '1.1rem',
                      background:
                        isStatusLoading || loading || (currentStudentStatus === 'in' && !destination.trim())
                          ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                          : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      cursor:
                        isStatusLoading || loading || (currentStudentStatus === 'in' && !destination.trim())
                          ? 'not-allowed'
                          : 'pointer',
                      boxShadow:
                        isStatusLoading || loading || (currentStudentStatus === 'in' && !destination.trim())
                          ? 'none'
                          : '0 15px 40px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.3s ease',
                      transform: 'scale(1)',
                    }}
                    onMouseOver={(e) => {
                      if (!isStatusLoading && !loading && !(currentStudentStatus === 'in' && !destination.trim())) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {isStatusLoading || loading ? (
                      <>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            border: '3px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        {isStatusLoading ? 'Preparing...' : 'Generating...'}
                      </>
                    ) : (
                      <>
                        <QrCode size={22} />
                        Generate {currentStudentStatus === 'out' ? 'Entry' : 'Exit'} QR Pass
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* QR Preview */}
              <div
                style={{
                  background: qrCode ? 'linear-gradient(135deg, #ffffff, #f3f4f6)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 500,
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                {qrCode ? (
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div
                      style={{
                        width: 280,
                        height: 280,
                        background: 'white',
                        border: '4px solid #e5e7eb',
                        borderRadius: 20,
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                        padding: '16px',
                      }}
                    >
                      <img src={qrCode} alt='Gate QR' style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
                    </div>
                    
                    <div style={{ 
                      marginBottom: 20, 
                      padding: '16px 24px', 
                      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                      borderRadius: '12px',
                      border: '2px solid #3b82f6'
                    }}>
                      <div style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: 6, fontWeight: 600 }}>
                        {currentStudentStatus === 'out' ? '🔓 Entry Type' : '📍 Destination'}
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a' }}>
                        {currentStudentStatus === 'out' ? 'Campus Entry' : destination}
                      </div>
                    </div>
                    
                    {studentInfo && (
                      <div style={{ 
                        marginBottom: 20, 
                        padding: '16px 24px', 
                        background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                        borderRadius: '12px',
                        border: '2px solid #a855f7'
                      }}>
                        <div style={{ fontSize: '0.9rem', color: '#7e22ce', marginBottom: 6, fontWeight: 600 }}>👤 Student Info</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6b21a8', marginBottom: 4 }}>{studentInfo.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#7e22ce', fontWeight: 600 }}>
                          Roll: {studentInfo.rollNumber} • Status: {studentInfo.currentStatus.toUpperCase()}
                        </div>
                      </div>
                    )}
                    
                    <div
                      style={{
                        padding: '14px 24px',
                        background: timeLeft < 60 
                          ? 'linear-gradient(135deg, #fee2e2, #fecaca)' 
                          : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                        border: `3px solid ${timeLeft < 60 ? '#ef4444' : '#3b82f6'}`,
                        borderRadius: 12,
                        fontWeight: 800,
                        color: timeLeft < 60 ? '#991b1b' : '#1e40af',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '1.1rem',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Clock size={20} />
                      {timeLeft < 60 ? `⚠️ Expires in ${formatTime(timeLeft)}` : `✅ Valid for ${formatTime(timeLeft)}`}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ 
                      padding: '32px', 
                      borderRadius: '20px', 
                      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                      marginBottom: 24 
                    }}>
                      <QrCode size={80} style={{ opacity: 0.3 }} />
                    </div>
                    <h3 style={{ margin: '0 0 12px', fontSize: '1.5rem', fontWeight: 800, color: '#374151' }}>No QR Pass Yet</h3>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#6b7280', fontWeight: 500 }}>
                      {currentStudentStatus === 'out'
                        ? '🔓 Generate a QR code to enter the campus'
                        : '🚪 Choose a destination and generate your exit pass'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent gate passes */}
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginBottom: '20px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            📋 Recent Gate Passes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!logsLoading && gateLogs.length === 0 && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 16,
                  padding: '32px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  color: '#6b7280',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎫</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#374151' }}>No recent gate passes yet</div>
                <div style={{ fontSize: '1rem', marginTop: '8px' }}>Generate your first pass to see it here!</div>
              </div>
            )}

            {logsLoading && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 16,
                  padding: '32px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  color: '#6b7280',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>⏳ Loading your recent gate passes…</div>
              </div>
            )}

            {gateLogs.slice(0, 5).map((log, index) => {
              const status = log.status || 'pending';
              const isApproved = status === 'processed';
              const isPending = status === 'pending';
              const statusLabel = isApproved ? '✅ Approved' : isPending ? '⏳ Pending' : '❌ ' + status;
              const statusColor = isApproved ? '#1e40af' : isPending ? '#92400e' : '#991b1b';
              const statusBg = isApproved ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : isPending ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : 'linear-gradient(135deg, #fee2e2, #fecaca)';

              return (
                <div
                  key={log._id || index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 16,
                    padding: '24px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937', marginBottom: 8 }}>
                      {log.action === 'exit' ? '🚪' : '🔓'} {log.destination || 'Gate Visit'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.95rem', color: '#6b7280', fontWeight: 600 }}>
                      <span>📅 {formatDateDisplay(log.issuedAt || log.createdAt)}</span>
                      <span>•</span>
                      <span>⏰ {formatTimeDisplay(log.issuedAt, log.scannedAt || log.expiresAt)}</span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.95rem', color: '#9ca3af', fontWeight: 600 }}>
                      {log.action === 'exit' ? '→ Leaving campus' : '← Entering campus'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        padding: '10px 20px',
                        borderRadius: '12px',
                        background: statusBg,
                        color: statusColor,
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        border: `2px solid ${statusColor}`,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {statusLabel}
                    </div>
                  </div>
                </div>
              );
            })}
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
