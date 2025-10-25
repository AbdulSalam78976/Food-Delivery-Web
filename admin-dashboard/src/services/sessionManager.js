/**
 * Session Management Service
 * Handles session preferences, timeouts, and automatic refresh logic
 */

// Session timeout constants
export const SESSION_TIMEOUTS = {
  WARNING_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  CHECK_INTERVAL: 60 * 1000, // Check every minute
  INACTIVITY_DEFAULT: 30 * 60 * 1000, // 30 minutes for regular sessions
  INACTIVITY_REMEMBERED: 2 * 60 * 60 * 1000, // 2 hours for remembered sessions
  AUTO_REFRESH_THRESHOLD: 2 * 60 * 1000, // Auto-refresh when 2 minutes left
};

// Local storage keys
const STORAGE_KEYS = {
  REMEMBER_ME: 'rememberMe',
  USER_EMAIL: 'userEmail',
  LAST_ACTIVITY: 'lastActivity',
  SESSION_PREFERENCES: 'sessionPreferences',
};

/**
 * Get remember me preference from localStorage
 */
export const getRememberMePreference = () => {
  try {
    return {
      isRemembered: localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true',
      rememberedEmail: localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || '',
    };
  } catch (error) {
    console.error('Error getting remember me preference:', error);
    return { isRemembered: false, rememberedEmail: '' };
  }
};

/**
 * Set remember me preference in localStorage
 */
export const setRememberMePreference = (rememberMe, email = '') => {
  try {
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      if (email) {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    }
  } catch (error) {
    console.error('Error setting remember me preference:', error);
  }
};

/**
 * Clear all session preferences
 */
export const clearSessionPreferences = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.SESSION_PREFERENCES);
  } catch (error) {
    console.error('Error clearing session preferences:', error);
  }
};

/**
 * Get appropriate inactivity timeout based on remember me preference
 */
export const getInactivityTimeout = () => {
  const { isRemembered } = getRememberMePreference();
  return isRemembered ? SESSION_TIMEOUTS.INACTIVITY_REMEMBERED : SESSION_TIMEOUTS.INACTIVITY_DEFAULT;
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
  } catch (error) {
    console.error('Error updating last activity:', error);
  }
};

/**
 * Get last activity timestamp
 */
export const getLastActivity = () => {
  try {
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    return lastActivity ? parseInt(lastActivity, 10) : Date.now();
  } catch (error) {
    console.error('Error getting last activity:', error);
    return Date.now();
  }
};

/**
 * Check if session should be considered inactive
 */
export const isSessionInactive = () => {
  const lastActivity = getLastActivity();
  const inactivityTimeout = getInactivityTimeout();
  const timeSinceLastActivity = Date.now() - lastActivity;
  
  return timeSinceLastActivity >= inactivityTimeout;
};

/**
 * Format time remaining for display
 */
export const formatTimeRemaining = (milliseconds) => {
  if (!milliseconds || milliseconds <= 0) return '0:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Calculate time until session expiry
 */
export const getTimeUntilExpiry = (session) => {
  if (!session?.expires_at) return null;
  
  const expiryTime = new Date(session.expires_at * 1000);
  const currentTime = new Date();
  
  return expiryTime.getTime() - currentTime.getTime();
};

/**
 * Check if session should show timeout warning
 */
export const shouldShowTimeoutWarning = (timeUntilExpiry) => {
  return timeUntilExpiry !== null && 
         timeUntilExpiry <= SESSION_TIMEOUTS.WARNING_THRESHOLD && 
         timeUntilExpiry > 0;
};

/**
 * Check if session should be auto-refreshed
 */
export const shouldAutoRefresh = (timeUntilExpiry) => {
  return timeUntilExpiry !== null && 
         timeUntilExpiry <= SESSION_TIMEOUTS.AUTO_REFRESH_THRESHOLD && 
         timeUntilExpiry > 0;
};

/**
 * Get session preferences for display
 */
export const getSessionInfo = () => {
  const { isRemembered } = getRememberMePreference();
  const inactivityTimeout = getInactivityTimeout();
  const lastActivity = getLastActivity();
  
  return {
    isRemembered,
    inactivityTimeout,
    inactivityTimeoutFormatted: formatTimeRemaining(inactivityTimeout),
    lastActivity: new Date(lastActivity),
    timeSinceLastActivity: Date.now() - lastActivity,
  };
};