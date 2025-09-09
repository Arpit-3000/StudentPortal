// Environment Configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://jarvis-1-muxr.onrender.com/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'College Portal',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export default config;
