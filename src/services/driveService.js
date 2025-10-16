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
                success: false,
                error: 'Failed to retrieve user information: ' + error.message
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
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
      }
      
      const userInfo = await response.json();
      
      if (!userInfo.email) {
        throw new Error('No email found in user info response');
      }
      
      return {
        getName: () => userInfo.name || userInfo.given_name || 'User',
        getEmail: () => userInfo.email,
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
      // First check if we have a token in memory
      if (!this.accessToken) {
        // Try to load from localStorage
        const storedToken = localStorage.getItem('drive_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          return false;
        }
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
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('drive_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      let url = `https://www.googleapis.com/drive/v3/files?pageSize=${maxResults}&fields=files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,thumbnailLink,owners,shared)&supportsAllDrives=true`;
      
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
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('drive_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
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
      console.log('DriveService: Attempting to download file:', fileId, fileName);
      
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('drive_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
          console.log('DriveService: Loaded token from localStorage');
        } else {
          throw new Error('User not signed in');
        }
      }

      // First, get file metadata to check if it's downloadable
      const metadataResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,webViewLink&supportsAllDrives=true`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      if (!metadataResponse.ok) {
        throw new Error(`Failed to get file metadata: ${metadataResponse.statusText}`);
      }

      const fileMetadata = await metadataResponse.json();
      console.log('DriveService: File metadata:', fileMetadata);

      // Check if file is a Google Workspace file (Docs, Sheets, Slides)
      const isGoogleWorkspaceFile = fileMetadata.mimeType && (
        fileMetadata.mimeType.includes('google-apps') ||
        fileMetadata.mimeType.includes('application/vnd.google-apps')
      );

      if (isGoogleWorkspaceFile) {
        // For Google Workspace files, open in new tab instead of downloading
        console.log('DriveService: Google Workspace file detected, opening in new tab');
        window.open(fileMetadata.webViewLink, '_blank');
        return { success: true, message: 'Google Workspace file opened in new tab' };
      }

      // For regular files, try to download
      const downloadResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      console.log('DriveService: Download response status:', downloadResponse.status, downloadResponse.statusText);

      if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text();
        console.error('DriveService: Download failed with response:', errorText);
        
        // If direct download fails, try opening the file in a new tab
        if (fileMetadata.webViewLink) {
          console.log('DriveService: Direct download failed, opening in new tab');
          window.open(fileMetadata.webViewLink, '_blank');
          return { success: true, message: 'File opened in new tab (download not available)' };
        }
        
        throw new Error(`Failed to download file: ${downloadResponse.statusText}`);
      }

      const blob = await downloadResponse.blob();
      console.log('DriveService: Blob created, size:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || fileMetadata.name || 'download';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      console.log('DriveService: File download initiated successfully');
      return { success: true };
    } catch (error) {
      console.error('DriveService: Error downloading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteFile(fileId) {
    try {
      console.log('DriveService: Attempting to delete file with ID:', fileId);
      
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('drive_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
          console.log('DriveService: Loaded token from localStorage');
        } else {
          throw new Error('User not signed in');
        }
      }

      const url = `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`;
      console.log('DriveService: Making DELETE request to:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      console.log('DriveService: Delete response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DriveService: Delete failed with response:', errorText);
        
        // Handle specific error cases
        if (response.status === 403) {
          throw new Error('Permission denied: You may not have permission to delete this file');
        } else if (response.status === 404) {
          throw new Error('File not found: The file may have already been deleted');
        } else if (response.status === 400) {
          throw new Error('Bad request: Invalid file ID or file cannot be deleted');
        }
        
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      console.log('DriveService: File deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('DriveService: Error deleting file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async renameFile(fileId, newName) {
    try {
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('drive_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`,
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
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('drive_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
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
