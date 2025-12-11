import { config } from '../config/environment.js';

class CalendarService {
  constructor() {
    this.clientId = config.GOOGLE_CLIENT_ID;
    this.apiKey = config.GOOGLE_API_KEY;
    this.scopes = config.CALENDAR_SCOPES;
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.gapi = null;
    this.isInitialized = false;
    this.tokenClient = null;
    this.accessToken = null;
  }

  async initializeGapi() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Calendar service can only be used in browser environment'));
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
      console.error('Error initializing Calendar client:', error);
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
        const storedToken = localStorage.getItem('calendar_access_token');
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

  // Get events for a specific date range
  async getEvents(timeMin, timeMax, maxResults = 50) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('calendar_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const params = new URLSearchParams({
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxResults: maxResults.toString(),
        singleEvents: 'true',
        orderBy: 'startTime'
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        events: data.items || []
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return {
        success: false,
        error: error.message,
        events: []
      };
    }
  }

  // Get events for a specific date
  async getEventsForDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await this.getEvents(startOfDay.toISOString(), endOfDay.toISOString());
    } catch (error) {
      console.error('Error fetching events for date:', error);
      return {
        success: false,
        error: error.message,
        events: []
      };
    }
  }

  // Create a new event
  async createEvent(eventData) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('calendar_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const event = {
        summary: eventData.summary || eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timeZone || 'Asia/Kolkata'
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timeZone || 'Asia/Kolkata'
        }
      };

      // Add location if provided
      if (eventData.location) {
        event.location = eventData.location;
      }

      // Add attendees if provided
      if (eventData.attendees && eventData.attendees.length > 0) {
        event.attendees = eventData.attendees.map(email => ({ email }));
      }

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const createdEvent = await response.json();
      return {
        success: true,
        event: createdEvent
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update an event
  async updateEvent(eventId, eventData) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('calendar_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const event = {
        summary: eventData.summary || eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timeZone || 'Asia/Kolkata'
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timeZone || 'Asia/Kolkata'
        }
      };

      if (eventData.location) {
        event.location = eventData.location;
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      const updatedEvent = await response.json();
      return {
        success: true,
        event: updatedEvent
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete an event
  async deleteEvent(eventId) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('calendar_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format time for display
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Get date in YYYY-MM-DD format
  formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get time in HH:MM format
  formatTimeForInput(date) {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

export default new CalendarService();

