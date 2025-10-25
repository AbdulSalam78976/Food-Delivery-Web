import { usePermissions } from '@/hooks/usePermissions';

/**
 * Component that conditionally renders children based on user roles and permissions
 */
const RoleBasedComponent = ({ 
  children, 
  role,
  roles = [],
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null,
  inverse = false // If true, renders children when conditions are NOT met
}) => {
  const { userRole, hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  let hasAccess = false;

  // Check role-based access
  if (role) {
    const roleHierarchy = {
      'super_admin': 3,
      'admin': 2,
      'manager': 1,
    };

    const userRoleLevel = roleHierarchy[userRole] || 0;
    const requiredRoleLevel = roleHierarchy[role] || 0;

    hasAccess = userRoleLevel >= requiredRoleLevel;
  } else if (roles.length > 0) {
    hasAccess = roles.includes(userRole);
  }

  // Check permission-based access
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // If no role or permission specified, allow access for authenticated users
  if (!role && roles.length === 0 && !permission && permissions.length === 0) {
    hasAccess = !!userRole;
  }

  // Apply inverse logic if specified
  if (inverse) {
    hasAccess = !hasAccess;
  }

  return hasAccess ? children : fallback;
};

export default RoleBasedComponent;