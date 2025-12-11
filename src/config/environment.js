// Environment Configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'College Portal',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  GOOGLE_CLIENT_ID:  import.meta.env.VITE_GOOGLE_CLIENT_ID || '448392427521-dv94r0ipsdipl7anb38dotnn4b0o6cu6.apps.googleusercontent.com',
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyACd2R34fFoRCU7yZbnXdby_MW4XUIiH2Q',
  GMAIL_SCOPES: import.meta.env.VITE_GMAIL_SCOPES || 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  DRIVE_SCOPES: import.meta.env.VITE_DRIVE_SCOPES || 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  CLASSROOM_SCOPES: import.meta.env.VITE_CLASSROOM_SCOPES || 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.announcements.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  CALENDAR_SCOPES: import.meta.env.CALENDAR_SCOPES || 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
};

export default config;
// 'http://localhost:5000' - Local development
//'https://jarvis-1-muxr.onrender.com' - Production
