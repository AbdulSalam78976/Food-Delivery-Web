// Type definitions for the admin dashboard

/**
 * @typedef {Object} AdminUser
 * @property {string} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {'super_admin' | 'admin' | 'manager'} role - User role
 * @property {string} [avatar] - Avatar URL
 * @property {boolean} isActive - Whether user is active
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Order ID
 * @property {string} customerId - Customer ID
 * @property {string} customerName - Customer name
 * @property {string} customerEmail - Customer email
 * @property {string} customerPhone - Customer phone
 * @property {Object} deliveryAddress - Delivery address
 * @property {OrderItem[]} items - Order items
 * @property {number} subtotal - Subtotal amount
 * @property {number} deliveryFee - Delivery fee
 * @property {number} total - Total amount
 * @property {'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'} status - Order status
 * @property {string} paymentMethod - Payment method
 * @property {'pending' | 'completed' | 'failed'} paymentStatus - Payment status
 * @property {string} [notes] - Order notes
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - Item ID
 * @property {string} productId - Product ID
 * @property {string} name - Product name
 * @property {number} price - Item price
 * @property {number} quantity - Quantity
 * @property {Object[]} [customizations] - Item customizations
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Product ID
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {string} categoryId - Category ID
 * @property {Category} category - Product category
 * @property {string} [imageUrl] - Image URL
 * @property {boolean} isAvailable - Whether product is available
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Category ID
 * @property {string} name - Category name
 * @property {string} [description] - Category description
 * @property {string} [imageUrl] - Image URL
 * @property {number} sortOrder - Sort order
 * @property {boolean} isActive - Whether category is active
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {number} todayRevenue - Today's revenue
 * @property {number} todayOrders - Today's order count
 * @property {number} pendingOrders - Pending order count
 * @property {number} totalCustomers - Total customer count
 * @property {PopularItem[]} popularItems - Popular items
 */

/**
 * @typedef {Object} PopularItem
 * @property {string} id - Product ID
 * @property {string} name - Product name
 * @property {number} orderCount - Number of orders
 * @property {number} revenue - Revenue generated
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Notification ID
 * @property {string} title - Notification title
 * @property {string} message - Notification message
 * @property {'info' | 'success' | 'warning' | 'error'} type - Notification type
 * @property {boolean} isRead - Whether notification is read
 * @property {Date} createdAt - Creation date
 */

export {};