'use client'

import { createContext, useContext, useMemo } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createSupabaseBrowserClient(), [])

  return <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>
}

export function useSupabaseClient() {
  const client = useContext(SupabaseContext)

  if (!client) {
    throw new Error('useSupabaseClient must be used within SupabaseProvider')
  }

  return client
}
