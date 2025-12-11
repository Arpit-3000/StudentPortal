import React, { createContext, useContext, useState, useEffect } from 'react';
import gmailService from '../services/gmailService';
import driveService from '../services/driveService';
import classroomService from '../services/classroomService';
import calendarService from '../services/calendarService';

const GoogleAuthContext = createContext();

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};

export const GoogleAuthProvider = ({ children }) => {
  const [gmailAuth, setGmailAuth] = useState({
    isSignedIn: false,
    user: null,
    accessToken: null,
    loading: false
  });
  
  const [driveAuth, setDriveAuth] = useState({
    isSignedIn: false,
    user: null,
    accessToken: null,
    loading: false
  });

  const [classroomAuth, setClassroomAuth] = useState({
    isSignedIn: false,
    user: null,
    accessToken: null,
    loading: false
  });

  const [calendarAuth, setCalendarAuth] = useState({
    isSignedIn: false,
    user: null,
    accessToken: null,
    loading: false
  });

  // Load authentication state from localStorage on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      console.log('Loading Google auth state from localStorage...');
      
      // Load Gmail auth state
      const gmailToken = localStorage.getItem('gmail_access_token');
      const gmailUser = localStorage.getItem('gmail_user');
      
      if (gmailToken && gmailUser) {
        console.log('Found Gmail token, validating...');
        // Verify token is still valid
        const isValid = await gmailService.isSignedIn();
        if (isValid) {
          console.log('Gmail token is valid, restoring session');
          setGmailAuth({
            isSignedIn: true,
            user: JSON.parse(gmailUser),
            accessToken: gmailToken,
            loading: false
          });
          // Set the token in the service
          gmailService.accessToken = gmailToken;
        } else {
          console.log('Gmail token is invalid, clearing');
          // Token is invalid, clear it
          clearGmailAuth();
        }
      } else {
        console.log('No Gmail token found');
      }

      // Load Drive auth state
      const driveToken = localStorage.getItem('drive_access_token');
      const driveUser = localStorage.getItem('drive_user');
      
      if (driveToken && driveUser) {
        console.log('Found Drive token, validating...');
        // Verify token is still valid
        const isValid = await driveService.isSignedIn();
        if (isValid) {
          console.log('Drive token is valid, restoring session');
          setDriveAuth({
            isSignedIn: true,
            user: JSON.parse(driveUser),
            accessToken: driveToken,
            loading: false
          });
          // Set the token in the service
          driveService.accessToken = driveToken;
        } else {
          console.log('Drive token is invalid, clearing');
          // Token is invalid, clear it
          clearDriveAuth();
        }
      } else {
        console.log('No Drive token found');
      }

      // Load Classroom auth state
      const classroomToken = localStorage.getItem('classroom_access_token');
      const classroomUser = localStorage.getItem('classroom_user');
      
      if (classroomToken && classroomUser) {
        console.log('Found Classroom token, validating...');
        // Verify token is still valid
        const isValid = await classroomService.isSignedIn();
        if (isValid) {
          console.log('Classroom token is valid, restoring session');
          setClassroomAuth({
            isSignedIn: true,
            user: JSON.parse(classroomUser),
            accessToken: classroomToken,
            loading: false
          });
          // Set the token in the service
          classroomService.accessToken = classroomToken;
        } else {
          console.log('Classroom token is invalid, clearing');
          // Token is invalid, clear it
          clearClassroomAuth();
        }
      } else {
        console.log('No Classroom token found');
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      // Clear invalid auth data
      clearGmailAuth();
      clearDriveAuth();
      clearClassroomAuth();
    }
  };

  const signInGmail = async () => {
    setGmailAuth(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await gmailService.signIn();
      
      if (result.success) {
        const userData = {
          name: result.user.getName(),
          email: result.user.getEmail(),
          imageUrl: result.user.getImageUrl()
        };
        
        // Store in localStorage
        localStorage.setItem('gmail_access_token', result.accessToken);
        localStorage.setItem('gmail_user', JSON.stringify(userData));
        
        setGmailAuth({
          isSignedIn: true,
          user: userData,
          accessToken: result.accessToken,
          loading: false
        });
        
        return { success: true };
      } else {
        setGmailAuth(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setGmailAuth(prev => ({ ...prev, loading: false }));
      return { success: false, error: error.message };
    }
  };

  const signInDrive = async () => {
    setDriveAuth(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await driveService.signIn();
      
      if (result.success) {
        const userData = {
          name: result.user.getName(),
          email: result.user.getEmail(),
          imageUrl: result.user.getImageUrl()
        };
        
        // Store in localStorage
        localStorage.setItem('drive_access_token', result.accessToken);
        localStorage.setItem('drive_user', JSON.stringify(userData));
        
        setDriveAuth({
          isSignedIn: true,
          user: userData,
          accessToken: result.accessToken,
          loading: false
        });
        
        return { success: true };
      } else {
        setDriveAuth(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setDriveAuth(prev => ({ ...prev, loading: false }));
      return { success: false, error: error.message };
    }
  };

  const signOutGmail = async () => {
    try {
      await gmailService.signOut();
      clearGmailAuth();
      return { success: true };
    } catch (error) {
      console.error('Error signing out of Gmail:', error);
      return { success: false, error: error.message };
    }
  };

  const signOutDrive = async () => {
    try {
      await driveService.signOut();
      clearDriveAuth();
      return { success: true };
    } catch (error) {
      console.error('Error signing out of Drive:', error);
      return { success: false, error: error.message };
    }
  };

  const signInClassroom = async () => {
    setClassroomAuth(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await classroomService.signIn();
      
      if (result.success) {
        const userData = {
          name: result.user.getName(),
          email: result.user.getEmail(),
          imageUrl: result.user.getImageUrl()
        };
        
        // Store in localStorage
        localStorage.setItem('classroom_access_token', result.accessToken);
        localStorage.setItem('classroom_user', JSON.stringify(userData));
        
        setClassroomAuth({
          isSignedIn: true,
          user: userData,
          accessToken: result.accessToken,
          loading: false
        });
        
        return { success: true };
      } else {
        setClassroomAuth(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setClassroomAuth(prev => ({ ...prev, loading: false }));
      return { success: false, error: error.message };
    }
  };

  const signOutClassroom = async () => {
    try {
      await classroomService.signOut();
      clearClassroomAuth();
      return { success: true };
    } catch (error) {
      console.error('Error signing out of Classroom:', error);
      return { success: false, error: error.message };
    }
  };

  const signInCalendar = async () => {
    setCalendarAuth(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await calendarService.signIn();
      
      if (result.success) {
        const userData = {
          name: result.user.getName(),
          email: result.user.getEmail(),
          imageUrl: result.user.getImageUrl()
        };
        
        // Store in localStorage
        localStorage.setItem('calendar_access_token', result.accessToken);
        localStorage.setItem('calendar_user', JSON.stringify(userData));
        
        setCalendarAuth({
          isSignedIn: true,
          user: userData,
          accessToken: result.accessToken,
          loading: false
        });
        
        return { success: true };
      } else {
        setCalendarAuth(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setCalendarAuth(prev => ({ ...prev, loading: false }));
      return { success: false, error: error.message };
    }
  };

  const signOutCalendar = async () => {
    try {
      await calendarService.signOut();
      clearCalendarAuth();
      return { success: true };
    } catch (error) {
      console.error('Error signing out of Calendar:', error);
      return { success: false, error: error.message };
    }
  };

  const clearGmailAuth = () => {
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('gmail_user');
    setGmailAuth({
      isSignedIn: false,
      user: null,
      accessToken: null,
      loading: false
    });
    gmailService.accessToken = null;
  };

  const clearDriveAuth = () => {
    localStorage.removeItem('drive_access_token');
    localStorage.removeItem('drive_user');
    setDriveAuth({
      isSignedIn: false,
      user: null,
      accessToken: null,
      loading: false
    });
    driveService.accessToken = null;
  };

  const clearClassroomAuth = () => {
    localStorage.removeItem('classroom_access_token');
    localStorage.removeItem('classroom_user');
    setClassroomAuth({
      isSignedIn: false,
      user: null,
      accessToken: null,
      loading: false
    });
    classroomService.accessToken = null;
  };

  const clearCalendarAuth = () => {
    localStorage.removeItem('calendar_access_token');
    localStorage.removeItem('calendar_user');
    setCalendarAuth({
      isSignedIn: false,
      user: null,
      accessToken: null,
      loading: false
    });
    calendarService.accessToken = null;
  };

  // Sign out from all Google services
  const signOutAll = async () => {
    await Promise.all([
      signOutGmail(),
      signOutDrive(),
      signOutClassroom(),
      signOutCalendar()
    ]);
  };

  const value = {
    gmailAuth,
    driveAuth,
    classroomAuth,
    calendarAuth,
    signInGmail,
    signInDrive,
    signInClassroom,
    signInCalendar,
    signOutGmail,
    signOutDrive,
    signOutClassroom,
    signOutCalendar,
    signOutAll,
    clearGmailAuth,
    clearDriveAuth,
    clearClassroomAuth,
    clearCalendarAuth
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
