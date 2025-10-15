import { config } from '../config/environment.js';

class DriveService {
  constructor() {
    this.clientId = config.GOOGLE_CLIENT_ID;
    this.apiKey = config.GOOGLE_API_KEY;
    this.scopes = config.DRIVE_SCOPES;
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    this.gapi = null;
    this.isInitialized = false;
    this.tokenClient = null;
    this.accessToken = null;
  }

  async initializeGapi() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Drive service can only be used in browser environment'));
        return;
      }

      // Load Google API script if not already loaded
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('client', () => {
            this.initializeClient(resolve, reject);
          });
        };
        script.onerror = () => reject(new Error('Failed to load Google API script'));
        document.head.appendChild(script);
      } else {
        window.gapi.load('client', () => {
          this.initializeClient(resolve, reject);
        });
      }
    });
  }

  async initializeClient(resolve, reject) {
    try {
      await window.gapi.client.init({
        apiKey: this.apiKey,
        discoveryDocs: [this.discoveryDoc]
      });

      // Load Google Identity Services
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          this.initializeTokenClient(resolve, reject);
        };
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(script);
      } else {
        this.initializeTokenClient(resolve, reject);
      }
    } catch (error) {
      console.error('Error initializing Drive client:', error);
      reject(error);
    }
  }

  initializeTokenClient(resolve, reject) {
    try {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scopes,
        callback: (response) => {
          if (response.error) {
            console.error('OAuth error:', response.error);
            reject(new Error(response.error));
          } else {
            this.gapi = window.gapi;
            this.isInitialized = true;
            resolve();
          }
        }
      });
      
      // Resolve immediately since token client is ready
      resolve();
    } catch (error) {
      console.error('Error initializing token client:', error);
      reject(error);
    }
  }

  async signIn() {
    try {
      await this.initializeGapi();
      
      if (!this.tokenClient) {
        throw new Error('Token client not initialized');
      }
      
      return new Promise((resolve) => {
        this.tokenClient.callback = (response) => {
          if (response.error) {
            console.error('OAuth error:', response.error);
            resolve({
              success: false,
              error: response.error
            });
          } else {
            // Store the access token
            this.accessToken = response.access_token;
            
            // Get user info using the access token
            this.getUserInfo(response.access_token).then(userInfo => {
              resolve({
                success: true,
                user: userInfo,
                accessToken: response.access_token
              });
            }).catch(error => {
              console.error('Error getting user info:', error);
              resolve({
                success: true,
                user: { getName: () => 'User', getEmail: () => 'user@example.com', getImageUrl: () => '' },
                accessToken: response.access_token
              });
            });
          }
        };
        
        this.tokenClient.requestAccessToken();
      });
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      const userInfo = await response.json();
      
      return {
        getName: () => userInfo.name || 'User',
        getEmail: () => userInfo.email || 'user@example.com',
        getImageUrl: () => userInfo.picture || ''
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      // Revoke the token if it exists
      if (this.accessToken && window.google) {
        window.google.accounts.oauth2.revoke(this.accessToken);
      }
      
      // Clear stored token
      this.accessToken = null;
      
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async isSignedIn() {
    try {
      // Check if we have a valid access token
      if (!this.accessToken) {
        return false;
      }
      
      // Verify the token is still valid by making a test request
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${this.accessToken}`);
      return response.ok;
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return false;
    }
  }

  async getFiles(maxResults = 10, query = '') {
    try {
      if (!this.accessToken) {
        throw new Error('User not signed in');
      }

      let url = `https://www.googleapis.com/drive/v3/files?pageSize=${maxResults}&fields=files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,thumbnailLink,owners,shared)`;
      
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        files: data.files || []
      };
    } catch (error) {
      console.error('Error fetching files:', error);
      return {
        success: false,
        error: error.message,
        files: []
      };
    }
  }

  async getFileContent(fileId) {
    try {
      if (!this.accessToken) {
        throw new Error('User not signed in');
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`);
      }

      return {
        success: true,
        content: await response.blob()
      };
    } catch (error) {
      console.error('Error fetching file content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async downloadFile(fileId, fileName) {
    try {
      if (!this.accessToken) {
        throw new Error('User not signed in');
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Error downloading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteFile(fileId) {
    try {
      if (!this.accessToken) {
        throw new Error('User not signed in');
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async renameFile(fileId, newName) {
    try {
      if (!this.accessToken) {
        throw new Error('User not signed in');
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newName
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to rename file: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error renaming file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uploadFile(file, name) {
    try {
      if (!this.accessToken) {
        throw new Error('User not signed in');
      }

      const metadata = {
        name: name || file.name,
        parents: ['root']
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
          body: form
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        file: result
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getFileIcon(mimeType) {
    if (mimeType.includes('folder')) return 'folder';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('video')) return 'video';
    if (mimeType.includes('audio')) return 'audio';
    if (mimeType.includes('pdf')) return 'picture_as_pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'description';
    if (mimeType.includes('sheet') || mimeType.includes('spreadsheet')) return 'table_chart';
    if (mimeType.includes('presentation') || mimeType.includes('slides')) return 'slideshow';
    if (mimeType.includes('text')) return 'text_snippet';
    return 'insert_drive_file';
  }

  formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export default new DriveService();
