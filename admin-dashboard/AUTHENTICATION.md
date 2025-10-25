# Admin Dashboard Authentication System

This document describes the authentication system implemented for the admin dashboard.

## Features Implemented

### 1. Core Authentication
- **Login Page**: Secure login form with validation
- **Supabase Integration**: Uses Supabase Auth for authentication
- **Protected Routes**: Route guards that require authentication
- **Authentication Context**: React context for managing auth state

### 2. Role-Based Access Control (RBAC)
- **User Roles**: Support for `super_admin`, `admin`, and `manager` roles
- **Permission System**: Granular permissions for different actions
- **Role-Based Components**: Components that render based on user permissions
- **Role-Based Routes**: Routes that require specific roles or permissions

### 3. Session Management
- **Automatic Token Refresh**: Handles token refresh automatically
- **Session Timeout**: Configurable session timeout with warnings
- **Inactivity Detection**: Logs out users after period of inactivity
- **Session Extension**: Users can extend their session when warned

### 4. Security Features
- **Password Strength Validation**: Comprehensive password validation
- **Failed Login Tracking**: Tracks and blocks repeated failed attempts
- **Account Lockout**: Temporary lockout after too many failed attempts
- **Audit Logging**: Logs all authentication and admin actions
- **IP Address Tracking**: Records IP addresses for security monitoring

## Usage

### Setting Up Authentication

1. **Configure Environment Variables**:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Database Setup**:
   - Run the SQL schema in `database-schema.sql`
   - Create admin users in the `admin_users` table
   - Set up Row Level Security policies

3. **Create Admin Users**:
   ```sql
   INSERT INTO admin_users (id, name, email, role) VALUES
   ('user-uuid-from-supabase-auth', 'Admin User', 'admin@example.com', 'super_admin');
   ```

### Using Authentication Components

#### AuthProvider
Wrap your app with the AuthProvider:
```jsx
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

#### Protected Routes
Protect routes that require authentication:
```jsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

#### Role-Based Routes
Protect routes that require specific roles:
```jsx
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';

<Route 
  path="/admin" 
  element={
    <RoleBasedRoute requiredRole="admin">
      <AdminPage />
    </RoleBasedRoute>
  } 
/>
```

#### Permission Guards
Show/hide components based on permissions:
```jsx
import PermissionGuard from '@/components/auth/PermissionGuard';

<PermissionGuard permission="DELETE_ORDERS">
  <DeleteButton />
</PermissionGuard>
```

#### Role-Based Components
Conditionally render based on roles:
```jsx
import RoleBasedComponent from '@/components/auth/RoleBasedComponent';

<RoleBasedComponent role="super_admin">
  <SuperAdminPanel />
</RoleBasedComponent>
```

### Using Authentication Hooks

#### useAuth Hook
Access authentication state and methods:
```jsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signOut, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

#### usePermissions Hook
Check user permissions:
```jsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { hasPermission, userRole } = usePermissions();
  
  return (
    <div>
      {hasPermission('DELETE_ORDERS') && (
        <button>Delete Order</button>
      )}
      <p>Your role: {userRole}</p>
    </div>
  );
}
```

#### useSessionManager Hook
Manage session timeout:
```jsx
import { useSessionManager } from '@/hooks/useSessionManager';

function MyComponent() {
  const { showTimeoutWarning, extendSession } = useSessionManager();
  
  if (showTimeoutWarning) {
    return (
      <div>
        <p>Your session is about to expire!</p>
        <button onClick={extendSession}>Extend Session</button>
      </div>
    );
  }
  
  return <div>Normal content</div>;
}
```

## Security Configuration

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot be a common password

### Account Lockout
- Maximum 5 failed attempts per hour
- 15-minute lockout period
- Tracks by both email and IP address

### Session Management
- 30-minute inactivity timeout
- 5-minute warning before expiry
- Automatic token refresh

### Audit Logging
All authentication events are logged including:
- Login attempts (successful and failed)
- Logout events
- Password changes
- Session extensions
- Account lockouts

## File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Main authentication context
├── components/auth/
│   ├── ProtectedRoute.jsx       # Route protection
│   ├── RoleBasedRoute.jsx       # Role-based route protection
│   ├── PermissionGuard.jsx      # Permission-based component guard
│   ├── RoleBasedComponent.jsx   # Role-based component rendering
│   └── SessionTimeoutWarning.jsx # Session timeout warning modal
├── hooks/
│   ├── usePermissions.js        # Permission checking hook
│   └── useSessionManager.js     # Session management hook
├── services/
│   ├── auditLog.js             # Audit logging service
│   └── loginAttempts.js        # Failed login tracking
├── utils/
│   ├── permissions.js          # Permission utilities
│   └── passwordValidation.js   # Password validation utilities
└── pages/auth/
    └── LoginPage.jsx           # Login page component
```

## Testing the Authentication System

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test Login**:
   - Navigate to `/login`
   - Try logging in with invalid credentials (should show error and track attempts)
   - Try logging in with valid admin credentials

3. **Test Role-Based Access**:
   - Create users with different roles in the database
   - Test that components show/hide based on roles and permissions

4. **Test Session Management**:
   - Leave the app idle to test inactivity timeout
   - Test session extension functionality

5. **Test Security Features**:
   - Try multiple failed login attempts to trigger lockout
   - Check browser console for audit logs
   - Test password strength validation

## Production Considerations

1. **Database Setup**:
   - Create proper `audit_logs` table instead of using localStorage
   - Set up proper database indexes for performance
   - Configure backup and monitoring

2. **Security Enhancements**:
   - Implement proper IP address detection
   - Add CAPTCHA for repeated failed attempts
   - Set up email notifications for security events
   - Implement two-factor authentication

3. **Monitoring**:
   - Set up proper logging and monitoring
   - Configure alerts for security events
   - Implement proper error tracking

4. **Performance**:
   - Optimize database queries
   - Implement proper caching strategies
   - Monitor session storage usage