import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/constants';

// Create Supabase client
export const supabase = createClient(
  "https://jwqfluocyhrwuzwrewgc.supabase.co",
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Auth helpers
export const auth = {
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const db = {
  // Orders
  orders: {
    getAll: async (filters = {}) => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_items(
            *,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('id', id)
        .single();

      return { data, error };
    },

    updateStatus: async (id, status) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    subscribe: (callback) => {
      return supabase
        .channel('orders')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'orders' }, 
          callback
        )
        .subscribe();
    },
  },

  // Products
  products: {
    getAll: async (filters = {}) => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('name');

      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.isAvailable !== undefined) {
        query = query.eq('is_available', filters.isAvailable);
      }

      const { data, error } = await query;
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      return { data, error };
    },

    create: async (product) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      return { error };
    },
  },

  // Categories
  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      return { data, error };
    },

    create: async (category) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      return { error };
    },
  },

  // Customers
  customers: {
    getAll: async (filters = {}) => {
      let query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    },
  },

  // Admin Users
  adminUsers: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    },

    create: async (adminUser) => {
      const { data, error } = await supabase
        .from('admin_users')
        .insert(adminUser)
        .select()
        .single();

      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('admin_users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    deactivate: async (id) => {
      const { data, error } = await supabase
        .from('admin_users')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },
  },

  // Analytics
  analytics: {
    getDashboardMetrics: async () => {
      // Get today's metrics
      const today = new Date().toISOString().split('T')[0];
      
      const { data: todayOrders, error: ordersError } = await supabase
        .from('orders')
        .select('total, status')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      if (ordersError) return { data: null, error: ordersError };

      const todayRevenue = todayOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);

      const pendingOrders = todayOrders
        .filter(order => ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status))
        .length;

      // Get total customers
      const { count: totalCustomers, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (customersError) return { data: null, error: customersError };

      // Get popular items (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: popularItems, error: popularError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          product:products(name)
        `)
        .gte('created_at', weekAgo.toISOString())
        .limit(5);

      if (popularError) return { data: null, error: popularError };

      // Aggregate popular items
      const itemStats = {};
      popularItems.forEach(item => {
        const productId = item.product_id;
        if (!itemStats[productId]) {
          itemStats[productId] = {
            id: productId,
            name: item.product.name,
            orderCount: 0,
          };
        }
        itemStats[productId].orderCount += item.quantity;
      });

      const topItems = Object.values(itemStats)
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 5);

      return {
        data: {
          todayRevenue,
          todayOrders: todayOrders.length,
          pendingOrders,
          totalCustomers,
          popularItems: topItems,
        },
        error: null,
      };
    },
  },
};

export default supabase;