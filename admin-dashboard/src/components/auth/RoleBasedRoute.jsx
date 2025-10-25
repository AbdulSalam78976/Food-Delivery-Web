import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { ROUTES } from '@/constants';

const RoleBasedRoute = ({ 
  children, 
  requiredRole = null,
  requiredPermission = null,
  requiredPermissions = null,
  requireAllPermissions = false,
  fallbackPath = ROUTES.DASHBOARD 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions, userRole } = usePermissions();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const roleHierarchy = {
      'super_admin': 3,
      'admin': 2,
      'manager': 1,
    };

    const userRoleLevel = roleHierarchy[userRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredPermissions && Array.isArray(requiredPermissions)) {
    const hasAccess = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // User has required access
  return children;
};

export default RoleBasedRoute;