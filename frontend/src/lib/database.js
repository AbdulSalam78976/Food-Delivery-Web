import { supabase } from './supabase'

// Database service for food delivery app
export const databaseService = {
  // Food items
  async getFoodItems(category = null) {
    try {
      let query = supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching food items:', error)
      return { data: null, error }
    }
  },

  async getFoodItemById(id) {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching food item:', error)
      return { data: null, error }
    }
  },

  // Categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { data: null, error }
    }
  },

  // User orders
  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null, error }
    }
  },

  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            food_item:food_items (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return { data: null, error }
    }
  },

  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            food_item:food_items (*)
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching order:', error)
      return { data: null, error }
    }
  },

  // Order items
  async createOrderItems(orderItems) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating order items:', error)
      return { data: null, error }
    }
  },

  // User profiles
  async createUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          ...profileData
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating user profile:', error)
      return { data: null, error }
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return { data: null, error }
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { data: null, error }
    }
  },

  // Addresses
  async createAddress(addressData) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert(addressData)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating address:', error)
      return { data: null, error }
    }
  },

  async getUserAddresses(userId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user addresses:', error)
      return { data: null, error }
    }
  },

  async updateAddress(addressId, updates) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating address:', error)
      return { data: null, error }
    }
  },

  async deleteAddress(addressId) {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting address:', error)
      return { error }
    }
  }
}
