import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import {
  EventNote as LeaveIcon,
  List as ListIcon,
  Add as AddIcon,
} from '@mui/icons-material';
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
      <Paper elevation={2} sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 60,
              fontSize: '1rem',
              fontWeight: 'medium',
            },
          }}
        >
          <Tab
            icon={<AddIcon />}
            label="Apply Leave"
            iconPosition="start"
            sx={{
              '&.Mui-selected': {
                color: 'primary.main',
                backgroundColor: 'primary.light',
              },
            }}
          />
          <Tab
            icon={<ListIcon />}
            label="My Leave Forms"
            iconPosition="start"
            sx={{
              '&.Mui-selected': {
                color: 'primary.main',
                backgroundColor: 'primary.light',
              },
            }}
          />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <ApplyLeaveForm
            onFormSubmit={handleFormSubmit}
            onViewForms={() => setActiveTab(1)}
          />
        )}
        {activeTab === 1 && (
          <MyLeaveForms
            onAddNew={handleAddNew}
            onViewForm={handleViewForm}
          />
        )}
      </Box>
    </Box>
  );
};

export default LeaveManagement;
