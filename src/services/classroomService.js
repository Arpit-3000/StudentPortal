import { config } from '../config/environment.js';

class ClassroomService {
  constructor() {
    this.clientId = config.GOOGLE_CLIENT_ID;
    this.apiKey = config.GOOGLE_API_KEY;
    this.scopes = config.CLASSROOM_SCOPES;
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest';
    this.gapi = null;
    this.isInitialized = false;
    this.tokenClient = null;
    this.accessToken = null;
  }

  async initializeGapi() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Classroom service can only be used in browser environment'));
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
      console.error('Error initializing Classroom client:', error);
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
        const storedToken = localStorage.getItem('classroom_access_token');
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

  // Get all courses for the authenticated user
  async getCourses(studentId = null, teacherId = null) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      let url = 'https://classroom.googleapis.com/v1/courses?';
      const params = new URLSearchParams();
      
      if (studentId) {
        params.append('studentId', studentId);
      }
      if (teacherId) {
        params.append('teacherId', teacherId);
      }
      
      url += params.toString();

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        courses: data.courses || []
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      return {
        success: false,
        error: error.message,
        courses: []
      };
    }
  }

  // Get course details by ID
  async getCourse(courseId) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch course: ${response.statusText}`);
      }

      const course = await response.json();
      return {
        success: true,
        course
      };
    } catch (error) {
      console.error('Error fetching course:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get coursework (assignments) for a course
  async getCoursework(courseId, maxResults = 10) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const url = `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork?pageSize=${maxResults}`;
      console.log('Fetching coursework from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Coursework response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Coursework API error response:', errorText);
        throw new Error(`Failed to fetch coursework: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Coursework data received:', data);
      console.log('Number of coursework items:', data.courseWork?.length || 0);
      
      return {
        success: true,
        coursework: data.courseWork || []
      };
    } catch (error) {
      console.error('Error fetching coursework:', error);
      return {
        success: false,
        error: error.message,
        coursework: []
      };
    }
  }

  // Get student submissions for a coursework
  async getSubmissions(courseId, courseworkId) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseworkId}/studentSubmissions?userId=me`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        submissions: data.studentSubmissions || []
      };
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return {
        success: false,
        error: error.message,
        submissions: []
      };
    }
  }

  // Get student submission for a specific coursework
  async getStudentSubmission(courseId, courseworkId) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseworkId}/studentSubmissions?userId=me`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        // If no submission exists yet, return null instead of error
        if (response.status === 404) {
          return {
            success: true,
            submission: null
          };
        }
        throw new Error(`Failed to fetch submission: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        submission: data.studentSubmissions && data.studentSubmissions.length > 0 
          ? data.studentSubmissions[0] 
          : null
      };
    } catch (error) {
      console.error('Error fetching student submission:', error);
      return {
        success: false,
        error: error.message,
        submission: null
      };
    }
  }

  // Turn in (submit) student submission
  async turnInSubmission(courseId, courseworkId, submissionId) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseworkId}/studentSubmissions/${submissionId}:turnIn`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to turn in submission: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        submission: data
      };
    } catch (error) {
      console.error('Error turning in submission:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Modify student submission (add attachments)
  async modifySubmission(courseId, courseworkId, submissionId, attachments = []) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const body = {
        addAttachments: attachments.map(att => ({
          driveFile: {
            id: att.id,
            title: att.title,
            alternateLink: att.alternateLink
          }
        }))
      };

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseworkId}/studentSubmissions/${submissionId}:modifyAttachments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to modify submission: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        submission: data
      };
    } catch (error) {
      console.error('Error modifying submission:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Reclaim (unsubmit) student submission
  async reclaimSubmission(courseId, courseworkId, submissionId) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseworkId}/studentSubmissions/${submissionId}:reclaim`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to reclaim submission: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        submission: data
      };
    } catch (error) {
      console.error('Error reclaiming submission:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Open Drive file in new tab
  openDriveFile(driveFile) {
    if (!driveFile) return;
    
    let url = '';
    if (driveFile.driveFile?.alternateLink) {
      url = driveFile.driveFile.alternateLink;
    } else if (driveFile.alternateLink) {
      url = driveFile.alternateLink;
    } else if (driveFile.driveFile?.id) {
      url = `https://drive.google.com/file/d/${driveFile.driveFile.id}/view`;
    } else if (driveFile.id) {
      url = `https://drive.google.com/file/d/${driveFile.id}/view`;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  }

  // Get announcements for a course
  async getAnnouncements(courseId, maxResults = 10) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/announcements?pageSize=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch announcements: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        announcements: data.announcements || []
      };
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return {
        success: false,
        error: error.message,
        announcements: []
      };
    }
  }

  // Get course roster (students and teachers)
  async getRoster(courseId) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      // Get students
      const studentsResponse = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/students`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Get teachers
      const teachersResponse = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/teachers`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const studentsData = studentsResponse.ok ? await studentsResponse.json() : { students: [] };
      const teachersData = teachersResponse.ok ? await teachersResponse.json() : { teachers: [] };

      return {
        success: true,
        students: studentsData.students || [],
        teachers: teachersData.teachers || []
      };
    } catch (error) {
      console.error('Error fetching roster:', error);
      return {
        success: false,
        error: error.message,
        students: [],
        teachers: []
      };
    }
  }

  // Get all coursework across all courses (for student view)
  async getAllCoursework(maxResults = 20) {
    try {
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('classroom_access_token');
        if (storedToken) {
          this.accessToken = storedToken;
        } else {
          throw new Error('User not signed in');
        }
      }

      // First get all courses
      const coursesResult = await this.getCourses();
      if (!coursesResult.success) {
        return coursesResult;
      }

      // Get coursework from all courses
      const allCoursework = [];
      for (const course of coursesResult.courses) {
        const courseworkResult = await this.getCoursework(course.id, 5);
        if (courseworkResult.success) {
          courseworkResult.coursework.forEach(cw => {
            allCoursework.push({
              ...cw,
              courseName: course.name,
              courseId: course.id
            });
          });
        }
      }

      // Sort by due date
      allCoursework.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate.year, a.dueDate.month - 1, a.dueDate.day) : new Date(0);
        const dateB = b.dueDate ? new Date(b.dueDate.year, b.dueDate.month - 1, b.dueDate.day) : new Date(0);
        return dateA - dateB;
      });

      return {
        success: true,
        coursework: allCoursework.slice(0, maxResults)
      };
    } catch (error) {
      console.error('Error fetching all coursework:', error);
      return {
        success: false,
        error: error.message,
        coursework: []
      };
    }
  }

  // Format date from Classroom API format
  formatDate(dateObj) {
    if (!dateObj) return 'No due date';
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
    const now = new Date();
    const diffInDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return `${Math.abs(diffInDays)} days overdue`;
    } else if (diffInDays === 0) {
      return 'Due today';
    } else if (diffInDays === 1) {
      return 'Due tomorrow';
    } else if (diffInDays < 7) {
      return `Due in ${diffInDays} days`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Format time from Classroom API format
  formatTime(timeObj) {
    if (!timeObj) return '';
    const hours = timeObj.hours || 0;
    const minutes = timeObj.minutes || 0;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}

export default new ClassroomService();

