// Role-based access control utilities

import { USER_ROLES } from '@/constants';

// Define permissions for each role
export const PERMISSIONS = {
  // Order management permissions
  VIEW_ORDERS: 'view_orders',
  UPDATE_ORDER_STATUS: 'update_order_status',
  DELETE_ORDERS: 'delete_orders',
  
  // Product management permissions
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCTS: 'create_products',
  UPDATE_PRODUCTS: 'update_products',
  DELETE_PRODUCTS: 'delete_products',
  
  // Category management permissions
  VIEW_CATEGORIES: 'view_categories',
  CREATE_CATEGORIES: 'create_categories',
  UPDATE_CATEGORIES: 'update_categories',
  DELETE_CATEGORIES: 'delete_categories',
  
  // Customer management permissions
  VIEW_CUSTOMERS: 'view_customers',
  UPDATE_CUSTOMERS: 'update_customers',
  DELETE_CUSTOMERS: 'delete_customers',
  
  // Analytics permissions
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  
  // Settings permissions
  VIEW_SETTINGS: 'view_settings',
  UPDATE_SETTINGS: 'update_settings',
  
  // Admin management permissions
  VIEW_ADMIN_USERS: 'view_admin_users',
  CREATE_ADMIN_USERS: 'create_admin_users',
  UPDATE_ADMIN_USERS: 'update_admin_users',
  DELETE_ADMIN_USERS: 'delete_admin_users',
  
  // System permissions
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_INTEGRATIONS: 'manage_integrations',
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    // Super admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
  
  [USER_ROLES.ADMIN]: [
    // Admin permissions (all except user management and audit logs)
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.UPDATE_ORDER_STATUS,
    PERMISSIONS.DELETE_ORDERS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.UPDATE_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.VIEW_CATEGORIES,
    PERMISSIONS.CREATE_CATEGORIES,
    PERMISSIONS.UPDATE_CATEGORIES,
    PERMISSIONS.DELETE_CATEGORIES,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.UPDATE_CUSTOMERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.UPDATE_SETTINGS,
  ],
  
  [USER_ROLES.MANAGER]: [
    // Manager permissions (limited to operations)
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.UPDATE_ORDER_STATUS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.UPDATE_PRODUCTS,
    PERMISSIONS.VIEW_CATEGORIES,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SETTINGS,
  ],
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean} - Whether user has permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 * @param {string} userRole - User's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether user has any of the permissions
 */
export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if a user has all of the specified permissions
 * @param {string} userRole - User's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether user has all permissions
 */
export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a user role
 * @param {string} userRole - User's role
 * @returns {string[]} - Array of permissions
 */
export const getUserPermissions = (userRole) => {
  if (!userRole) return [];
  
  return ROLE_PERMISSIONS[userRole] || [];
};

/**
 * Check if a role is higher than another role
 * @param {string} role1 - First role
 * @param {string} role2 - Second role
 * @returns {boolean} - Whether role1 is higher than role2
 */
export const isHigherRole = (role1, role2) => {
  const roleHierarchy = {
    [USER_ROLES.SUPER_ADMIN]: 3,
    [USER_ROLES.ADMIN]: 2,
    [USER_ROLES.MANAGER]: 1,
  };
  
  return (roleHierarchy[role1] || 0) > (roleHierarchy[role2] || 0);
};

/**
 * Check if a user can manage another user based on roles
 * @param {string} currentUserRole - Current user's role
 * @param {string} targetUserRole - Target user's role
 * @returns {boolean} - Whether current user can manage target user
 */
export const canManageUser = (currentUserRole, targetUserRole) => {
  // Super admin can manage everyone
  if (currentUserRole === USER_ROLES.SUPER_ADMIN) return true;
  
  // Admin can manage managers but not other admins or super admins
  if (currentUserRole === USER_ROLES.ADMIN) {
    return targetUserRole === USER_ROLES.MANAGER;
  }
  
  // Managers cannot manage other users
  return false;
};