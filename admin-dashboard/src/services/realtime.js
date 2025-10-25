import { supabase } from './supabase';

/**
 * Real-time subscription manager for the admin dashboard
 */
class RealtimeManager {
  constructor() {
    this.subscriptions = new Map();
  }

  /**
   * Subscribe to order changes
   * @param {Function} callback - Callback function to handle order changes
   * @returns {Object} Subscription object
   */
  subscribeToOrders(callback) {
    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order change detected:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.subscriptions.set('orders', subscription);
    return subscription;
  }

  /**
   * Subscribe to product changes
   * @param {Function} callback - Callback function to handle product changes
   * @returns {Object} Subscription object
   */
  subscribeToProducts(callback) {
    const subscription = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Product change detected:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.subscriptions.set('products', subscription);
    return subscription;
  }

  /**
   * Subscribe to category changes
   * @param {Function} callback - Callback function to handle category changes
   * @returns {Object} Subscription object
   */
  subscribeToCategories(callback) {
    const subscription = supabase
      .channel('categories-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
        },
        (payload) => {
          console.log('Category change detected:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.subscriptions.set('categories', subscription);
    return subscription;
  }

  /**
   * Subscribe to customer changes
   * @param {Function} callback - Callback function to handle customer changes
   * @returns {Object} Subscription object
   */
  subscribeToCustomers(callback) {
    const subscription = supabase
      .channel('customers-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
        },
        (payload) => {
          console.log('Customer change detected:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.subscriptions.set('customers', subscription);
    return subscription;
  }

  /**
   * Unsubscribe from a specific channel
   * @param {string} channelName - Name of the channel to unsubscribe from
   */
  unsubscribe(channelName) {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      supabase.removeChannel(subscription);
      this.subscriptions.delete(channelName);
      console.log(`Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, channelName) => {
      supabase.removeChannel(subscription);
      console.log(`Unsubscribed from ${channelName}`);
    });
    this.subscriptions.clear();
  }

  /**
   * Get the status of all subscriptions
   * @returns {Object} Status of all subscriptions
   */
  getSubscriptionStatus() {
    const status = {};
    this.subscriptions.forEach((subscription, channelName) => {
      status[channelName] = subscription.state;
    });
    return status;
  }
}

// Create a singleton instance
export const realtimeManager = new RealtimeManager();

// Export individual subscription functions for convenience
export const subscribeToOrders = (callback) => realtimeManager.subscribeToOrders(callback);
export const subscribeToProducts = (callback) => realtimeManager.subscribeToProducts(callback);
export const subscribeToCategories = (callback) => realtimeManager.subscribeToCategories(callback);
export const subscribeToCustomers = (callback) => realtimeManager.subscribeToCustomers(callback);

export default realtimeManager;