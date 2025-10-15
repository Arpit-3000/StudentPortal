import React, { useState } from 'react';
import { QrCode, History, Plus } from 'lucide-react';
import GatePass from './GatePass';
import MyGateLogs from './MyGateLogs';

const GateManagement = () => {
  const [activeTab, setActiveTab] = useState('generate');

  const tabs = [
    {
      id: 'generate',
      label: 'Generate Pass',
      icon: <Plus size={16} />,
      component: <GatePass />
    },
    {
      id: 'logs',
      label: 'My Logs',
      icon: <History size={16} />,
      component: <MyGateLogs />
    }
  ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <QrCode size={24} />
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px', margin: 0 }}>
                Gate Management
              </h1>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>
                Generate gate passes and view your access history
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '8px',
          marginBottom: '16px',
          display: 'flex',
          gap: '4px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1 }}>
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default GateManagement;
