import { supabase } from './supabase'

// Storage service for handling file uploads
export const storageService = {
  // Upload food image
  async uploadFoodImage(file, fileName) {
    try {
      const fileExt = fileName.split('.').pop()
      const filePath = `food-images/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('food-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('food-images')
        .getPublicUrl(filePath)

      return { data: { path: filePath, url: publicUrl }, error: null }
    } catch (error) {
      console.error('Error uploading food image:', error)
      return { data: null, error }
    }
  },

  // Upload user profile image
  async uploadProfileImage(file, userId) {
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `profile-images/${userId}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      return { data: { path: filePath, url: publicUrl }, error: null }
    } catch (error) {
      console.error('Error uploading profile image:', error)
      return { data: null, error }
    }
  },

  // Delete image
  async deleteImage(bucket, filePath) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting image:', error)
      return { error }
    }
  },

  // Get signed URL for private files
  async getSignedUrl(bucket, filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error getting signed URL:', error)
      return { data: null, error }
    }
  },

  // List files in a bucket
  async listFiles(bucket, folder = '') {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error listing files:', error)
      return { data: null, error }
    }
  }
}
