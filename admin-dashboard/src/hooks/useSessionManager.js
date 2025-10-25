import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SESSION_TIMEOUTS,
  getInactivityTimeout,
  updateLastActivity,
  isSessionInactive,
  formatTimeRemaining,
  getTimeUntilExpiry,
  shouldShowTimeoutWarning,
  shouldAutoRefresh,
} from '@/services/sessionManager';

export const useSessionManager = () => {
  const { session, refreshSession, signOut, user } = useAuth();
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(null);
  const sessionCheckIntervalRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);

  // Update last activity time
  const updateActivity = () => {
    updateLastActivity();
    setShowTimeoutWarning(false);
    
    // Reset inactivity timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    
    // Get inactivity timeout based on remember me preference
    const inactivityTimeout = getInactivityTimeout();
    
    // Set new inactivity timeout
    inactivityTimeoutRef.current = setTimeout(() => {
      handleInactivityTimeout();
    }, inactivityTimeout);
  };

  // Handle inactivity timeout
  const handleInactivityTimeout = async () => {
    console.log('Session expired due to inactivity');
    await signOut();
  };

  // Check session expiry and refresh if needed
  const checkSessionExpiry = async () => {
    if (!session?.expires_at) return;

    const timeUntilExpiry = getTimeUntilExpiry(session);
    setTimeUntilExpiry(timeUntilExpiry);

    // Check for inactivity-based logout
    if (isSessionInactive()) {
      console.log('Session expired due to inactivity');
      await signOut();
      return;
    }

    // Show warning if session expires soon
    if (shouldShowTimeoutWarning(timeUntilExpiry)) {
      setShowTimeoutWarning(true);
    }

    // Auto-refresh if session expires soon
    if (shouldAutoRefresh(timeUntilExpiry)) {
      try {
        console.log('Auto-refreshing session...');
        const { error } = await refreshSession();
        
        if (error) {
          console.error('Failed to refresh session:', error);
          await signOut();
        } else {
          console.log('Session refreshed successfully');
          setShowTimeoutWarning(false);
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
        await signOut();
      }
    }

    // Sign out if session has expired
    if (timeUntilExpiry <= 0) {
      console.log('Session has expired');
      await signOut();
    }
  };

  // Extend session manually
  const extendSession = async () => {
    try {
      const { error } = await refreshSession();
      
      if (error) {
        console.error('Failed to extend session:', error);
        return { success: false, error };
      }
      
      setShowTimeoutWarning(false);
      updateActivity();
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error extending session:', error);
      return { success: false, error };
    }
  };



  // Set up activity listeners and session checking
  useEffect(() => {
    if (!user || !session) return;

    // Activity event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start session checking interval
    sessionCheckIntervalRef.current = setInterval(checkSessionExpiry, SESSION_TIMEOUTS.CHECK_INTERVAL);

    // Initial activity update
    updateActivity();

    // Initial session check
    checkSessionExpiry();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [user, session, checkSessionExpiry, updateActivity]);

  return {
    showTimeoutWarning,
    timeUntilExpiry,
    extendSession,
    formatTimeRemaining,
    updateActivity,
  };
};