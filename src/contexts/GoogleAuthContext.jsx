import React, { createContext, useContext, useState, useEffect } from 'react';
import gmailService from '../services/gmailService';
import driveService from '../services/driveService';

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
    } catch (error) {
      console.error('Error loading auth state:', error);
      // Clear invalid auth data
      clearGmailAuth();
      clearDriveAuth();
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

  // Sign out from all Google services
  const signOutAll = async () => {
    await Promise.all([
      signOutGmail(),
      signOutDrive()
    ]);
  };

  const value = {
    gmailAuth,
    driveAuth,
    signInGmail,
    signInDrive,
    signOutGmail,
    signOutDrive,
    signOutAll,
    clearGmailAuth,
    clearDriveAuth
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
