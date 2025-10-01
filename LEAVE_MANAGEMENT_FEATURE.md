# Leave Management Feature

## Overview
The Leave Management feature has been successfully integrated into the Student Portal, allowing students to apply for leave from their hostel and track their leave applications.

## Features Implemented

### 1. Apply Leave Form (`ApplyLeaveForm.jsx`)
- **Comprehensive form** with validation for all required fields
- **Hostel selection** from predefined options
- **Date and time pickers** for exit and entry times
- **Emergency contact information** with relation selection
- **Real-time validation** with user-friendly error messages
- **Responsive design** that works on all screen sizes

### 2. My Leave Forms (`MyLeaveForms.jsx`)
- **Tabular display** of all submitted leave forms
- **Status filtering** (Pending, Approved, Rejected, Cancelled)
- **Search functionality** by reason
- **Pagination** for large datasets
- **Status indicators** with color-coded chips
- **Quick actions** to view form details

### 3. Leave Form Details (`LeaveFormDetails.jsx`)
- **Detailed view** of individual leave forms
- **Status-specific styling** and messaging
- **Complete timeline** including submission and approval dates
- **Emergency contact information** display
- **Edit functionality** for pending forms

### 4. Leave Management Hub (`LeaveManagement.jsx`)
- **Tabbed interface** for easy navigation
- **Seamless integration** between all components
- **State management** for form navigation

## API Integration

The feature integrates with the following APIs:

### Submit Leave Form
```javascript
POST /api/leave-form/submit
```
- Submits new leave applications
- Validates all required fields
- Returns confirmation with form details

### Get My Leave Forms
```javascript
GET /api/leave-form/my-forms
```
- Retrieves paginated list of student's leave forms
- Supports filtering by status
- Includes pagination metadata

### Get Specific Leave Form
```javascript
GET /api/leave-form/:id
```
- Retrieves detailed information for a specific form
- Includes approval/rejection details if processed

## UI/UX Features

### Design Elements
- **Material-UI components** for consistent styling
- **Color-coded status indicators** for quick recognition
- **Responsive grid layout** for all screen sizes
- **Loading states** and error handling
- **Success notifications** for user feedback

### Navigation
- **Sidebar integration** with "Apply Leave" option
- **Dashboard quick action** button
- **Breadcrumb navigation** between components
- **Tab-based interface** for easy switching

### Form Validation
- **Client-side validation** for immediate feedback
- **Phone number format** validation
- **Date range validation** (entry must be after exit)
- **Required field validation**
- **Real-time error display**

## File Structure

```
src/pages/student/
├── ApplyLeaveForm.jsx      # Leave application form
├── MyLeaveForms.jsx        # List of submitted forms
├── LeaveFormDetails.jsx    # Detailed form view
├── LeaveManagement.jsx     # Main container component
└── StudentPortal.jsx       # Updated with leave integration

src/services/
└── api.js                  # Updated with leave API endpoints
```

## Usage

### For Students
1. **Access**: Click "Apply Leave" in the sidebar or dashboard
2. **Apply**: Fill out the comprehensive leave form
3. **Track**: View all submitted forms with status updates
4. **Details**: Click on any form to see detailed information

### For Developers
1. **API Calls**: All API calls are handled through the `studentAPI` service
2. **State Management**: Component-level state with React hooks
3. **Error Handling**: Comprehensive error handling with user feedback
4. **Validation**: Both client-side and server-side validation

## Dependencies Added

- `@mui/x-date-pickers` - For date and time picker components
- `date-fns` - For date manipulation and formatting

## Future Enhancements

1. **Edit Functionality**: Allow editing of pending leave forms
2. **Bulk Operations**: Select and perform actions on multiple forms
3. **Export Functionality**: Export leave history to PDF/Excel
4. **Notifications**: Real-time notifications for status changes
5. **Calendar Integration**: Visual calendar view of leave periods
6. **Approval Workflow**: Integration with staff approval system

## Testing

The feature includes:
- **Form validation testing** with various input scenarios
- **API integration testing** with mock responses
- **Responsive design testing** across different screen sizes
- **Error handling testing** for network failures

## Security Considerations

- **Authentication required** for all API calls
- **Input sanitization** for all form fields
- **CSRF protection** through API interceptors
- **Role-based access** (students only)

This implementation provides a complete, production-ready leave management system that integrates seamlessly with the existing student portal architecture.
