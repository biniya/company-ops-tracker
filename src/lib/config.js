const PLACEHOLDER_URL = 'https://your-project.supabase.co'
const PLACEHOLDER_KEY = 'your-anon-key'

export function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  return Boolean(
    url &&
    key &&
    url !== PLACEHOLDER_URL &&
    key !== PLACEHOLDER_KEY &&
    !url.includes('your-project')
  )
}

export function getSupabaseConfig() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
}
