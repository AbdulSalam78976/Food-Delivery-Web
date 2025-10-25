import { supabase } from './supabase';

/**
 * Audit logging service for tracking admin actions
 */

export const AUDIT_ACTIONS = {
  // Authentication actions
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_FAILED: 'login_failed',
  PASSWORD_RESET: 'password_reset',
  PASSWORD_CHANGED: 'password_changed',
  
  // User management actions
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  USER_DEACTIVATED: 'user_deactivated',
  USER_ACTIVATED: 'user_activated',
  
  // Order management actions
  ORDER_VIEWED: 'order_viewed',
  ORDER_STATUS_UPDATED: 'order_status_updated',
  ORDER_DELETED: 'order_deleted',
  
  // Product management actions
  PRODUCT_CREATED: 'product_created',
  PRODUCT_UPDATED: 'product_updated',
  PRODUCT_DELETED: 'product_deleted',
  PRODUCT_AVAILABILITY_CHANGED: 'product_availability_changed',
  
  // Category management actions
  CATEGORY_CREATED: 'category_created',
  CATEGORY_UPDATED: 'category_updated',
  CATEGORY_DELETED: 'category_deleted',
  
  // Settings actions
  SETTINGS_UPDATED: 'settings_updated',
  INTEGRATION_CONFIGURED: 'integration_configured',
  
  // Data export actions
  DATA_EXPORTED: 'data_exported',
  REPORT_GENERATED: 'report_generated',
};

export const AUDIT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Log an audit event
 * @param {Object} params - Audit log parameters
 * @param {string} params.action - Action performed
 * @param {string} params.resource - Resource affected (optional)
 * @param {string} params.resourceId - ID of affected resource (optional)
 * @param {Object} params.details - Additional details (optional)
 * @param {string} params.severity - Severity level (optional)
 * @param {string} params.ipAddress - User's IP address (optional)
 * @param {string} params.userAgent - User's browser info (optional)
 */
export const logAuditEvent = async ({
  action,
  resource = null,
  resourceId = null,
  details = null,
  severity = AUDIT_SEVERITY.LOW,
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user for audit log:', userError);
      return { error: userError };
    }

    // Get admin user details
    let adminUser = null;
    if (user) {
      const { data: adminUserData, error: adminUserError } = await supabase
        .from('admin_users')
        .select('id, name, email, role')
        .eq('id', user.id)
        .single();
      
      if (!adminUserError) {
        adminUser = adminUserData;
      }
    }

    // Create audit log entry
    const auditEntry = {
      user_id: user?.id || null,
      user_name: adminUser?.name || 'Unknown',
      user_email: adminUser?.email || user?.email || 'Unknown',
      user_role: adminUser?.role || 'Unknown',
      action,
      resource,
      resource_id: resourceId,
      details: details ? JSON.stringify(details) : null,
      severity,
      ip_address: ipAddress,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    };

    // For now, we'll log to console and localStorage since we don't have audit_logs table
    // In a real implementation, you would insert into an audit_logs table
    console.log('Audit Log:', auditEntry);
    
    // Store in localStorage for development (in production, use proper database)
    const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    existingLogs.push(auditEntry);
    
    // Keep only last 1000 entries in localStorage
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }
    
    localStorage.setItem('audit_logs', JSON.stringify(existingLogs));

    return { error: null };
  } catch (error) {
    console.error('Error logging audit event:', error);
    return { error };
  }
};

/**
 * Get audit logs (from localStorage for development)
 * @param {Object} filters - Filter options
 * @param {string} filters.userId - Filter by user ID
 * @param {string} filters.action - Filter by action
 * @param {string} filters.resource - Filter by resource
 * @param {Date} filters.startDate - Filter by start date
 * @param {Date} filters.endDate - Filter by end date
 * @param {number} filters.limit - Limit number of results
 * @returns {Array} Array of audit log entries
 */
export const getAuditLogs = (filters = {}) => {
  try {
    const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    
    let filteredLogs = logs;

    // Apply filters
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.user_id === filters.userId);
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    if (filters.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= filters.endDate
      );
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply limit
    if (filters.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit);
    }

    return filteredLogs;
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return [];
  }
};

/**
 * Clear audit logs (for development)
 */
export const clearAuditLogs = () => {
  localStorage.removeItem('audit_logs');
};

/**
 * Get user's IP address (best effort)
 */
export const getUserIPAddress = async () => {
  try {
    // This is a simple approach - in production you might want to use a more reliable service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return null;
  }
};

/**
 * Get user agent string
 */
export const getUserAgent = () => {
  return navigator.userAgent;
};

/**
 * Log authentication events with additional security context
 */
export const logAuthEvent = async (action, details = {}) => {
  const ipAddress = await getUserIPAddress();
  const userAgent = getUserAgent();
  
  const severity = action === AUDIT_ACTIONS.LOGIN_FAILED 
    ? AUDIT_SEVERITY.MEDIUM 
    : AUDIT_SEVERITY.LOW;

  return logAuditEvent({
    action,
    resource: 'authentication',
    details: {
      ...details,
      timestamp: new Date().toISOString(),
    },
    severity,
    ipAddress,
    userAgent,
  });
};