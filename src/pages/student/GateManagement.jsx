import React, { useState } from 'react';
import { History, Plus } from 'lucide-react';
import GatePass from './GatePass';
import MyGateLogs from './MyGateLogs';

const GateManagement = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'transparent',
      padding: 0,
    }}>
      <GatePass />
    </div>
  );
};

export default GateManagement;
