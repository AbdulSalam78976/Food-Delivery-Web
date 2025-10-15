import supabase from '../../lib/supabase'

// Simple Hero Images service
const heroImagesService = {
  // Get all hero images
  async getHeroImages() {
    try {
      console.log('🟡 getHeroImages() called - starting query')
      
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('🟡 Query completed - error:', error)
      console.log('🟡 Raw hero images from database:', data)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('🔴 Error fetching hero images:', error)
      return { data: null, error }
    }
  },

  // Add new hero image
}

// TEST: Immediately call the function when module loads
console.log('🔵 HeroImages service module loaded')
heroImagesService.getHeroImages().then(result => {
  console.log('🟢 Initial test call result:', result)
})

export default heroImagesService