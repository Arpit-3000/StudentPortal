import React, { useState } from 'react';
import { Box } from '@mui/material';
import ApplyLeaveForm from './ApplyLeaveForm';
import MyLeaveForms from './MyLeaveForms';
import LeaveFormDetails from './LeaveFormDetails';

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [showFormDetails, setShowFormDetails] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setShowFormDetails(false);
    setSelectedFormId(null);
  };

  const handleViewForm = (formId) => {
    setSelectedFormId(formId);
    setShowFormDetails(true);
  };

  const handleAddNew = () => {
    setActiveTab(0);
    setShowFormDetails(false);
    setSelectedFormId(null);
  };

  const handleBackFromDetails = () => {
    setShowFormDetails(false);
    setSelectedFormId(null);
  };

  const handleFormSubmit = (newForm) => {
    // Switch to forms list after successful submission
    setActiveTab(1);
  };

  const handleEditForm = (formId) => {
    // For now, just switch to add form tab
    // In a real implementation, you might want to pre-populate the form
    setActiveTab(0);
    setShowFormDetails(false);
    setSelectedFormId(null);
  };

  if (showFormDetails && selectedFormId) {
    return (
      <LeaveFormDetails
        formId={selectedFormId}
        onBack={handleBackFromDetails}
        onEdit={handleEditForm}
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <ApplyLeaveForm
        onFormSubmit={handleFormSubmit}
        onViewForms={() => setActiveTab(1)}
        onViewForm={handleViewForm}
      />
    </Box>
  );
};

export default LeaveManagement;
