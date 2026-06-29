import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig, isSupabaseConfigured } from './config'

let client = null

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
    )
  }

  if (!client) {
    const { url, key } = getSupabaseConfig()
    client = createClient(url, key)
  }

  return client
}

// Lazy proxy so imports don't crash before the app mounts
export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      return getSupabase()[prop]
    },
  }
)
