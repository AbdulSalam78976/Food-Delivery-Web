import { useAuth } from '@/contexts/AuthContext';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  getUserPermissions,
  canManageUser,
  isHigherRole
} from '@/utils/permissions';

/**
 * Hook for checking user permissions
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  const userRole = user?.role;
  
  return {
    // Permission checking functions
    hasPermission: (permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(userRole, permissions),
    
    // Get all user permissions
    getUserPermissions: () => getUserPermissions(userRole),
    
    // Role management functions
    canManageUser: (targetUserRole) => canManageUser(userRole, targetUserRole),
    isHigherRole: (targetRole) => isHigherRole(userRole, targetRole),
    
    // Current user info
    userRole,
    isAuthenticated: !!user,
  };
};