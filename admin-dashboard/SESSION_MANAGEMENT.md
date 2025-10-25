# Session Management Implementation

## Overview

The admin dashboard implements a comprehensive session management system that handles automatic token refresh, session expiration, inactivity timeouts, and "remember me" functionality.

## Features Implemented

### 1. Automatic Token Refresh
- **Location**: `src/hooks/useSessionManager.js`
- **Functionality**: Automatically refreshes authentication tokens when they are about to expire (2 minutes before expiry)
- **Behavior**: 
  - Monitors session expiry time continuously
  - Auto-refreshes tokens to maintain user sessions
  - Handles refresh failures gracefully by signing out the user

### 2. Session Expiration and Logout
- **Location**: `src/hooks/useSessionManager.js`, `src/contexts/AuthContext.jsx`
- **Functionality**: Handles both token expiration and inactivity-based logout
- **Behavior**:
  - Signs out users when tokens expire
  - Implements inactivity timeouts (30 minutes default, 2 hours for remembered sessions)
  - Tracks user activity through mouse, keyboard, and touch events

### 3. Remember Me Functionality
- **Location**: `src/services/sessionManager.js`, `src/contexts/AuthContext.jsx`, `src/pages/auth/LoginPage.jsx`
- **Functionality**: Allows users to extend their session duration and remember login credentials
- **Behavior**:
  - Stores user email in localStorage when "remember me" is checked
  - Extends inactivity timeout from 30 minutes to 2 hours
  - Pre-fills email field on subsequent visits
  - Clears stored data on explicit logout

### 4. Session Timeout Warnings
- **Location**: `src/components/auth/SessionTimeoutWarning.jsx`
- **Functionality**: Shows warning dialog when session is about to expire
- **Behavior**:
  - Displays warning 5 minutes before session expiry
  - Shows countdown timer
  - Allows users to extend session or sign out
  - Different messaging for remembered vs regular sessions

## Technical Implementation

### Session Service (`src/services/sessionManager.js`)
Centralized service for session management utilities:
- Session timeout constants
- LocalStorage management for preferences
- Time calculation and formatting utilities
- Session state validation functions

### Session Manager Hook (`src/hooks/useSessionManager.js`)
React hook that orchestrates session management:
- Activity tracking and timeout management
- Session expiry monitoring
- Automatic refresh logic
- Warning state management

### Auth Context Updates (`src/contexts/AuthContext.jsx`)
Enhanced authentication context with:
- Remember me parameter in signIn function
- Session preference storage
- Cleanup on logout

### Session Timeout Warning Component (`src/components/auth/SessionTimeoutWarning.jsx`)
Modal component that:
- Shows session expiry countdown
- Provides extend/logout options
- Adapts messaging based on session type

## Configuration

### Timeout Values
```javascript
const SESSION_TIMEOUTS = {
  WARNING_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  CHECK_INTERVAL: 60 * 1000, // Check every minute
  INACTIVITY_DEFAULT: 30 * 60 * 1000, // 30 minutes for regular sessions
  INACTIVITY_REMEMBERED: 2 * 60 * 60 * 1000, // 2 hours for remembered sessions
  AUTO_REFRESH_THRESHOLD: 2 * 60 * 1000, // Auto-refresh when 2 minutes left
};
```

### Activity Events Tracked
- mousedown
- mousemove
- keypress
- scroll
- touchstart
- click

## Usage

### For Users
1. **Login**: Check "Remember me" for extended sessions
2. **Session Warnings**: Respond to timeout warnings by extending or signing out
3. **Automatic Behavior**: Sessions refresh automatically when active

### For Developers
1. **Session State**: Access session info through `useAuth()` hook
2. **Activity Tracking**: Automatic - no manual intervention needed
3. **Customization**: Modify timeout values in `sessionManager.js`

## Security Considerations

### Data Storage
- Only non-sensitive data (email, preferences) stored in localStorage
- No passwords or tokens stored locally
- Automatic cleanup on logout

### Session Security
- Tokens handled by Supabase Auth (secure by default)
- Inactivity timeouts prevent abandoned sessions
- Automatic refresh prevents token expiry during active use

### Activity Tracking
- Tracks user interaction events
- Respects user privacy (no content tracking)
- Only monitors activity presence, not specific actions

## Integration with Existing Systems

### Supabase Auth
- Leverages Supabase's built-in token refresh
- Uses Supabase session management
- Integrates with existing auth state changes

### Audit Logging
- Logs remember me preference in auth events
- Maintains existing audit trail functionality
- No additional logging overhead

### Error Handling
- Graceful degradation on localStorage errors
- Fallback to default timeouts if preferences unavailable
- Comprehensive error logging for debugging

## Testing Recommendations

### Manual Testing
1. **Remember Me**: Test login with/without remember me checked
2. **Inactivity**: Leave session idle and verify timeout behavior
3. **Activity**: Interact with app and verify session extension
4. **Warnings**: Wait for timeout warning and test extend/logout options

### Automated Testing
1. **Unit Tests**: Test session utility functions
2. **Integration Tests**: Test auth context with session management
3. **E2E Tests**: Test complete user workflows with session timeouts

## Troubleshooting

### Common Issues
1. **Session not extending**: Check if activity events are being tracked
2. **Remember me not working**: Verify localStorage permissions
3. **Premature logout**: Check inactivity timeout configuration
4. **Warning not showing**: Verify session expiry time calculation

### Debug Information
- Check browser console for session management logs
- Inspect localStorage for session preferences
- Monitor network tab for token refresh requests
- Use React DevTools to inspect auth context state