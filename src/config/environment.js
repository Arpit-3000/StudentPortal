// Environment Configuration
export const config = {
  API_BASE_URL: 'http://localhost:5000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'College Portal',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  GOOGLE_CLIENT_ID: '448392427521-dv94r0ipsdipl7anb38dotnn4b0o6cu6.apps.googleusercontent.com',
  GOOGLE_API_KEY: 'AIzaSyACd2R34fFoRCU7yZbnXdby_MW4XUIiH2Q',
  GMAIL_SCOPES: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  DRIVE_SCOPES: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
};

export default config;
// 'http://localhost:5000' - Local development
//'https://jarvis-1-muxr.onrender.com' - Production
