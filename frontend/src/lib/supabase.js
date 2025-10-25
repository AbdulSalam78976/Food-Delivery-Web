import { createClient } from '@supabase/supabase-js'

// Environment variable names (Vite-specific)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV

// Debug logging only in development
if (isDevelopment) {
  console.log('Supabase Environment Check:')
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Present' : '✗ Missing')
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Present' : '✗ Missing')
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(`
🚨 Missing Supabase environment variables!

Make sure your .env file is in the root directory and contains:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

You can get these from your Supabase project dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy the URL and anon public key
    `)
  }
}

let supabase

if (!supabaseUrl || !supabaseAnonKey) {
  // Enhanced mock client for better development experience
  console.warn('⚠️ Creating mock Supabase client - real functionality disabled')
  
  const mockTable = () => ({
    select: () => ({
      eq: () => Promise.resolve({ data: [], error: null }),
      neq: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
      limit: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Mock: No Supabase connection' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Mock: No Supabase connection' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Mock: No Supabase connection' } }),
    upsert: () => Promise.resolve({ data: null, error: { message: 'Mock: No Supabase connection' } })
  })

  supabase = {
    from: mockTable,
    auth: {
      signUp: () => Promise.resolve({ 
        data: { 
          user: null, 
          session: null 
        }, 
        error: { message: 'Mock: Authentication disabled' } 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { 
          user: null, 
          session: null 
        }, 
        error: { message: 'Mock: Authentication disabled' } 
      }),
      signInWithOAuth: () => Promise.resolve({ 
        data: { 
          provider: 'github', 
          url: null 
        }, 
        error: { message: 'Mock: OAuth disabled' } 
      }),
      signOut: () => Promise.resolve({ error: { message: 'Mock: Sign out disabled' } }),
      getUser: () => Promise.resolve({ 
        data: { user: null }, 
        error: null 
      }),
      getSession: () => Promise.resolve({ 
        data: { session: null }, 
        error: null 
      }),
      onAuthStateChange: (callback) => {
        // Simulate immediate null user
        callback('SIGNED_OUT', null)
        return { 
          data: { 
            subscription: {
              unsubscribe: () => {}
            }
          } 
        }
      }
    },
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {}
    })
  }
} else {
  // Real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })

  // Add connection health check in development
  if (isDevelopment) {
    supabase.from('hero_images').select('count').limit(1)
      .then(({ error }) => {
        if (error) {
          console.error('❌ Supabase connection failed:', error.message)
        } else {
          console.log('✅ Supabase connected successfully')
        }
      })
      .catch(error => {
        console.error('❌ Supabase connection error:', error)
      })
  }
}

export { supabase }
export default supabase