# Mail & Notices Feature Setup Guide

## Overview
The Mail & Notices feature allows students to connect their college Gmail account to view important notices and emails directly within the student portal. This feature provides a beautiful, responsive interface for viewing the last 10 emails with smart categorization and highlighting.

## Features
- 🔐 **Google OAuth Integration**: Secure sign-in with college Gmail accounts
- 📧 **Email Fetching**: Automatically fetches the last 10 emails from inbox
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 🏷️ **Smart Categorization**: Automatically identifies important emails and college notices
- 🔄 **Real-time Refresh**: Manual refresh functionality
- 📱 **Mobile Responsive**: Works perfectly on all device sizes

## Setup Instructions

### 1. Google Cloud Console Setup

1. **Create/Select Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Gmail API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click on it and press "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized origins:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### 2. Environment Configuration

Create a `.env` file in the `StudentPortal` directory:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Other environment variables
VITE_APP_NAME=College Portal
VITE_APP_VERSION=1.0.0
```

### 3. Install Dependencies

The required dependencies are already included in the project:
- `@mui/material` - UI components
- `@mui/icons-material` - Icons
- `framer-motion` - Animations
- `axios` - HTTP requests

### 4. Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Mail & Notices**:
   - Click on "Mail & Notices" in the sidebar
   - Click "Sign in with Gmail"
   - Authorize the application
   - View your emails!

## File Structure

```
StudentPortal/src/
├── services/
│   └── gmailService.js          # Gmail API integration service
├── pages/student/
│   └── MailAndNotices.jsx       # Main component
├── components/
│   └── PremiumSidebar.jsx       # Updated sidebar with Mail & Notices
├── config/
│   └── environment.js           # Environment configuration
└── pages/student/
    └── StudentPortal.jsx        # Updated main portal
```

## Key Components

### GmailService (`services/gmailService.js`)
- Handles Google OAuth authentication
- Manages Gmail API calls
- Fetches and formats email data
- Provides utility functions for date formatting

### MailAndNotices (`pages/student/MailAndNotices.jsx`)
- Main UI component
- Handles authentication state
- Displays email list with beautiful styling
- Manages loading and error states

## Smart Features

### Email Categorization
- **Important Emails**: Automatically detected based on keywords like "notice", "announcement", "urgent", "exam", "result", "deadline"
- **College Emails**: Identified by college domain patterns (@iiitu.ac.in, @iiituna.ac.in, @college.edu)

### Visual Indicators
- 🏷️ **Important Badge**: Red chip for important emails
- 🏫 **College Badge**: Green chip for college emails
- ⏰ **Time Stamps**: Smart relative time formatting
- 👤 **Avatars**: Generated from sender names

### Responsive Design
- Mobile-first approach
- Smooth animations and transitions
- Touch-friendly interface
- Adaptive layouts

## Security Considerations

1. **OAuth 2.0**: Uses Google's secure OAuth 2.0 flow
2. **Read-Only Access**: Only requests read permissions for Gmail
3. **Client-Side Only**: No server-side storage of credentials
4. **HTTPS Required**: Production deployment requires HTTPS

## Troubleshooting

### Common Issues

1. **"Failed to load Google API script"**
   - Check internet connection
   - Verify Google API script is accessible

2. **"User not signed in"**
   - Clear browser cache and cookies
   - Try signing out and back in

3. **"Failed to load emails"**
   - Check Gmail API is enabled
   - Verify OAuth credentials are correct
   - Ensure user has granted necessary permissions

4. **CORS Errors**
   - Add your domain to authorized origins in Google Cloud Console
   - Ensure HTTPS is used in production

### Debug Mode
Enable console logging by adding this to your browser's developer console:
```javascript
localStorage.setItem('debug', 'gmail-service');
```

## Customization

### Styling
The component uses Material-UI theming. You can customize colors, fonts, and spacing by modifying the `sx` props in the component.

### Email Filtering
Modify the `isImportantEmail` and `isFromCollege` functions in `MailAndNotices.jsx` to customize email categorization logic.

### Number of Emails
Change the `maxResults` parameter in the `getEmails` function call to fetch more or fewer emails.

## Production Deployment

1. **Update Environment Variables**:
   - Set production URLs in Google Cloud Console
   - Update `.env` with production values

2. **Build the Application**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   - Deploy the `dist` folder to your hosting service
   - Ensure HTTPS is enabled

## Support

For issues or questions regarding this feature, please check:
1. Browser console for error messages
2. Google Cloud Console for API status
3. Network tab for failed requests

The feature is designed to be robust and user-friendly, with comprehensive error handling and fallback states.
