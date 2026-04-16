import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During SSR/build prerendering, env vars might be unavailable.
  // Return a client with placeholder values - actual API calls only happen
  // in the browser (via useEffect) where real env vars are available.
  if (!supabaseUrl || !supabaseAnonKey) {
    // Use harmless placeholders so createBrowserClient doesn't throw.
    // This client will never be used for real calls because client-side
    // code only runs after hydration where env vars are present.
    client = createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key-for-build-time-only'
    )
    return client
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}
