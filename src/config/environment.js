// Environment Configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'College Portal',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
  GMAIL_SCOPES: import.meta.env.VITE_GMAIL_SCOPES,
  DRIVE_SCOPES: import.meta.env.VITE_DRIVE_SCOPES,
};

export default config;
// 'http://localhost:5000' - Local development
//'https://jarvis-1-muxr.onrender.com' - Production
