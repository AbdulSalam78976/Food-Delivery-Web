/**
 * Password strength validation utilities
 */

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minSpecialChars: 1,
  preventCommonPasswords: true,
};

// Common weak passwords to prevent
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'administrator', 'root', 'user', 'guest', 'test', 'demo',
  '12345678', '1234567890', 'qwerty123', 'password1', 'admin123'
];

/**
 * Check password strength and return validation results
 * @param {string} password - Password to validate
 * @returns {Object} Validation results with score and feedback
 */
export const validatePasswordStrength = (password) => {
  const results = {
    isValid: false,
    score: 0, // 0-100
    strength: 'weak', // weak, fair, good, strong
    errors: [],
    suggestions: [],
  };

  if (!password) {
    results.errors.push('Password is required');
    return results;
  }

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    results.errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  } else {
    results.score += 20;
  }

  // Check maximum length
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    results.errors.push(`Password must not exceed ${PASSWORD_REQUIREMENTS.maxLength} characters`);
  }

  // Check for uppercase letters
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    results.errors.push('Password must contain at least one uppercase letter');
    results.suggestions.push('Add uppercase letters (A-Z)');
  } else if (/[A-Z]/.test(password)) {
    results.score += 15;
  }

  // Check for lowercase letters
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    results.errors.push('Password must contain at least one lowercase letter');
    results.suggestions.push('Add lowercase letters (a-z)');
  } else if (/[a-z]/.test(password)) {
    results.score += 15;
  }

  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    results.errors.push('Password must contain at least one number');
    results.suggestions.push('Add numbers (0-9)');
  } else if (/\d/.test(password)) {
    results.score += 15;
  }

  // Check for special characters
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
  const specialCharCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g) || []).length;
  
  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !specialCharRegex.test(password)) {
    results.errors.push('Password must contain at least one special character');
    results.suggestions.push('Add special characters (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  } else if (specialCharRegex.test(password)) {
    results.score += 15;
    
    // Bonus points for multiple special characters
    if (specialCharCount >= PASSWORD_REQUIREMENTS.minSpecialChars) {
      results.score += Math.min(specialCharCount * 2, 10);
    }
  }

  // Check against common passwords
  if (PASSWORD_REQUIREMENTS.preventCommonPasswords && 
      COMMON_PASSWORDS.includes(password.toLowerCase())) {
    results.errors.push('Password is too common and easily guessable');
    results.suggestions.push('Use a more unique password');
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    results.score -= 10;
    results.suggestions.push('Avoid repeating the same character multiple times');
  }

  // Check for sequential characters
  if (hasSequentialChars(password)) {
    results.score -= 10;
    results.suggestions.push('Avoid sequential characters (abc, 123, qwerty)');
  }

  // Bonus points for length
  if (password.length >= 12) {
    results.score += 10;
  }
  if (password.length >= 16) {
    results.score += 10;
  }

  // Ensure score is within bounds
  results.score = Math.max(0, Math.min(100, results.score));

  // Determine strength level
  if (results.score >= 80) {
    results.strength = 'strong';
  } else if (results.score >= 60) {
    results.strength = 'good';
  } else if (results.score >= 40) {
    results.strength = 'fair';
  } else {
    results.strength = 'weak';
  }

  // Password is valid if no errors and score is at least 60
  results.isValid = results.errors.length === 0 && results.score >= 60;

  return results;
};

/**
 * Check for sequential characters in password
 * @param {string} password - Password to check
 * @returns {boolean} True if sequential characters found
 */
const hasSequentialChars = (password) => {
  const sequences = [
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'qwertyuiopasdfghjklzxcvbnm',
    '!@#$%^&*()_+-=[]{}|;:,.<>?'
  ];

  const lowerPassword = password.toLowerCase();
  
  for (const sequence of sequences) {
    for (let i = 0; i <= sequence.length - 3; i++) {
      const subseq = sequence.substring(i, i + 3);
      if (lowerPassword.includes(subseq)) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Generate password strength color for UI
 * @param {string} strength - Password strength level
 * @returns {string} CSS color class
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'strong':
      return 'text-green-600 bg-green-100';
    case 'good':
      return 'text-blue-600 bg-blue-100';
    case 'fair':
      return 'text-yellow-600 bg-yellow-100';
    case 'weak':
    default:
      return 'text-red-600 bg-red-100';
  }
};

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 16)
 * @returns {string} Generated password
 */
export const generateSecurePassword = (length = 16) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + specialChars;
  
  let password = '';
  
  // Ensure at least one character from each required category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => Math.random() - 0.5).join('');
};