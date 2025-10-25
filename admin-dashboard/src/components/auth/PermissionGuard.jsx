import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/permissions';

/**
 * Component that conditionally renders children based on user permissions
 */
const PermissionGuard = ({ 
  children, 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null,
  role 
}) => {
  const { user } = useAuth();
  
  // Use provided role or user's role
  const userRole = role || user?.role;
  
  if (!userRole) {
    return fallback;
  }
  
  let hasAccess = false;
  
  if (permission) {
    // Single permission check
    hasAccess = hasPermission(userRole, permission);
  } else if (permissions && Array.isArray(permissions)) {
    // Multiple permissions check
    hasAccess = requireAll 
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions);
  } else {
    // No permissions specified, allow access
    hasAccess = true;
  }
  
  return hasAccess ? children : fallback;
};

export default PermissionGuard;