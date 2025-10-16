import { config } from '../config/environment.js';

class GmailService {
  constructor() {
    this.clientId = config.GOOGLE_CLIENT_ID;
    this.apiKey = config.GOOGLE_API_KEY;
    this.scopes = config.GMAIL_SCOPES;
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
    this.gapi = null;
    this.isInitialized = false;
    this.tokenClient = null;
    this.accessToken = null;
  }

  async initializeGapi() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Gmail service can only be used in browser environment'));
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
      console.error('Error initializing Gmail client:', error);
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
        const storedToken = localStorage.getItem('gmail_access_token');
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

  async getEmails(maxResults = 10) {
    try {
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('gmail_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      // Fetch messages list
      const messagesResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=in:inbox`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!messagesResponse.ok) {
        throw new Error(`Failed to fetch messages: ${messagesResponse.statusText}`);
      }

      const messagesData = await messagesResponse.json();
      const messages = messagesData.messages || [];
      
      // Fetch details for each message
      const emailPromises = messages.map(message => this.getEmailDetails(message.id));
      const emails = await Promise.all(emailPromises);

      return {
        success: true,
        emails: emails.filter(email => email !== null)
      };
    } catch (error) {
      console.error('Error fetching emails:', error);
      return {
        success: false,
        error: error.message,
        emails: []
      };
    }
  }

  async getEmailDetails(messageId) {
    try {
      // Ensure we have a token
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('gmail_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch message details: ${response.statusText}`);
      }

      const message = await response.json();
      const headers = message.payload.headers;
      
      const getHeader = (name) => {
        const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
        return header ? header.value : '';
      };

      const subject = getHeader('Subject');
      const from = getHeader('From');
      const date = getHeader('Date');
      const snippet = message.snippet || '';
      
      // Extract email address from "Name <email@domain.com>" format
      const fromEmail = from.match(/<(.+)>/) ? from.match(/<(.+)>/)[1] : from;
      const fromName = from.replace(/<.+>/, '').trim() || fromEmail;

      // Extract full email body
      const body = this.extractEmailBody(message.payload);

      return {
        id: messageId,
        subject,
        from: fromName,
        fromEmail,
        date: new Date(date),
        snippet,
        body,
        threadId: message.threadId,
        labelIds: message.labelIds
      };
    } catch (error) {
      console.error('Error fetching email details:', error);
      return null;
    }
  }

  extractEmailBody(payload) {
    let body = '';
    
    if (payload.body && payload.body.data) {
      // Single part message
      body = this.decodeBase64(payload.body.data);
    } else if (payload.parts) {
      // Multi-part message
      body = this.extractBodyFromParts(payload.parts);
    }
    
    return body || '';
  }

  extractBodyFromParts(parts) {
    let body = '';
    
    for (const part of parts) {
      if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        if (part.body && part.body.data) {
          body += this.decodeBase64(part.body.data);
        }
      } else if (part.parts) {
        // Recursively check nested parts
        body += this.extractBodyFromParts(part.parts);
      }
    }
    
    return body;
  }

  decodeBase64(data) {
    try {
      // Gmail uses URL-safe base64 encoding
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      return atob(base64);
    } catch (error) {
      console.error('Error decoding base64:', error);
      return '';
    }
  }

  formatDate(date) {
    const now = new Date();
    const emailDate = new Date(date);
    const diffInHours = (now - emailDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return emailDate.toLocaleDateString();
    }
  }
}

export default new GmailService();
