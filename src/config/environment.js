// Environment Configuration
export const config = {
  API_BASE_URL: 'http://localhost:5000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'College Portal',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export default config;
// 'http://localhost:5000' - Local development
//'https://jarvis-1-muxr.onrender.com' - Production
