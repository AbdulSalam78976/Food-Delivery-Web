/**
 * Failed login attempt tracking service
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour window for counting attempts

/**
 * Get login attempts data from localStorage
 */
const getLoginAttemptsData = () => {
  try {
    const data = localStorage.getItem('login_attempts');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error parsing login attempts data:', error);
    return {};
  }
};

/**
 * Save login attempts data to localStorage
 */
const saveLoginAttemptsData = (data) => {
  try {
    localStorage.setItem('login_attempts', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving login attempts data:', error);
  }
};

/**
 * Get current timestamp
 */
const getCurrentTimestamp = () => Date.now();

/**
 * Clean up old attempt records
 */
const cleanupOldAttempts = (attempts, currentTime) => {
  return attempts.filter(attempt => 
    currentTime - attempt.timestamp < ATTEMPT_WINDOW
  );
};

/**
 * Check if an email/IP is currently locked out
 * @param {string} identifier - Email or IP address
 * @returns {Object} Lockout status and remaining time
 */
export const checkLockoutStatus = (identifier) => {
  const data = getLoginAttemptsData();
  const currentTime = getCurrentTimestamp();
  
  if (!data[identifier]) {
    return { isLockedOut: false, remainingTime: 0, attempts: 0 };
  }

  const userAttempts = data[identifier];
  
  // Check if user is currently locked out
  if (userAttempts.lockedUntil && currentTime < userAttempts.lockedUntil) {
    const remainingTime = userAttempts.lockedUntil - currentTime;
    return { 
      isLockedOut: true, 
      remainingTime, 
      attempts: userAttempts.attempts.length 
    };
  }

  // Clean up old attempts
  const recentAttempts = cleanupOldAttempts(userAttempts.attempts || [], currentTime);
  
  // Update data with cleaned attempts
  if (recentAttempts.length !== (userAttempts.attempts || []).length) {
    data[identifier] = {
      ...userAttempts,
      attempts: recentAttempts,
      lockedUntil: null,
    };
    saveLoginAttemptsData(data);
  }

  return { 
    isLockedOut: false, 
    remainingTime: 0, 
    attempts: recentAttempts.length 
  };
};

/**
 * Record a failed login attempt
 * @param {string} email - User's email
 * @param {string} ipAddress - User's IP address (optional)
 * @param {Object} details - Additional details about the attempt
 * @returns {Object} Updated lockout status
 */
export const recordFailedAttempt = (email, ipAddress = null, details = {}) => {
  const data = getLoginAttemptsData();
  const currentTime = getCurrentTimestamp();
  
  // Track by email
  if (!data[email]) {
    data[email] = { attempts: [], lockedUntil: null };
  }

  // Clean up old attempts
  data[email].attempts = cleanupOldAttempts(data[email].attempts, currentTime);

  // Add new attempt
  data[email].attempts.push({
    timestamp: currentTime,
    ipAddress,
    details,
  });

  // Check if user should be locked out
  if (data[email].attempts.length >= MAX_ATTEMPTS) {
    data[email].lockedUntil = currentTime + LOCKOUT_DURATION;
  }

  // Also track by IP address if provided
  if (ipAddress) {
    if (!data[ipAddress]) {
      data[ipAddress] = { attempts: [], lockedUntil: null };
    }

    data[ipAddress].attempts = cleanupOldAttempts(data[ipAddress].attempts, currentTime);
    data[ipAddress].attempts.push({
      timestamp: currentTime,
      email,
      details,
    });

    if (data[ipAddress].attempts.length >= MAX_ATTEMPTS) {
      data[ipAddress].lockedUntil = currentTime + LOCKOUT_DURATION;
    }
  }

  saveLoginAttemptsData(data);

  // Return current status for email
  return checkLockoutStatus(email);
};

/**
 * Clear failed attempts for a user (called on successful login)
 * @param {string} email - User's email
 * @param {string} ipAddress - User's IP address (optional)
 */
export const clearFailedAttempts = (email, ipAddress = null) => {
  const data = getLoginAttemptsData();
  
  // Clear attempts for email
  if (data[email]) {
    delete data[email];
  }

  // Clear attempts for IP address if provided
  if (ipAddress && data[ipAddress]) {
    delete data[ipAddress];
  }

  saveLoginAttemptsData(data);
};

/**
 * Get remaining lockout time in a human-readable format
 * @param {number} remainingTime - Remaining time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatRemainingTime = (remainingTime) => {
  if (remainingTime <= 0) return '0 seconds';

  const minutes = Math.floor(remainingTime / (60 * 1000));
  const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};

/**
 * Get all failed attempts (for admin viewing)
 * @param {number} limit - Maximum number of attempts to return
 * @returns {Array} Array of failed attempts
 */
export const getAllFailedAttempts = (limit = 100) => {
  const data = getLoginAttemptsData();
  const currentTime = getCurrentTimestamp();
  const allAttempts = [];

  Object.entries(data).forEach(([identifier, userData]) => {
    const recentAttempts = cleanupOldAttempts(userData.attempts || [], currentTime);
    
    recentAttempts.forEach(attempt => {
      allAttempts.push({
        identifier,
        timestamp: attempt.timestamp,
        ipAddress: attempt.ipAddress,
        email: attempt.email,
        details: attempt.details,
        isCurrentlyLocked: userData.lockedUntil && currentTime < userData.lockedUntil,
      });
    });
  });

  // Sort by timestamp (newest first)
  allAttempts.sort((a, b) => b.timestamp - a.timestamp);

  return allAttempts.slice(0, limit);
};

/**
 * Clear all failed attempts data (admin function)
 */
export const clearAllFailedAttempts = () => {
  localStorage.removeItem('login_attempts');
};

/**
 * Get lockout configuration
 */
export const getLockoutConfig = () => ({
  maxAttempts: MAX_ATTEMPTS,
  lockoutDuration: LOCKOUT_DURATION,
  attemptWindow: ATTEMPT_WINDOW,
});