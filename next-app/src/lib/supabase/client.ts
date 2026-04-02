import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

function createFallbackClient(): SupabaseClient {
  return {
    auth: {
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: 'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: 'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      }),
      signOut: async () => ({
        error: { message: 'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      }),
    },
  } as unknown as SupabaseClient
}

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return createFallbackClient()
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
