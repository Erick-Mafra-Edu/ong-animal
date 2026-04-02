'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSupabaseClient } from '@/providers/supabase-provider'
import { isEmailVerificationEnabled } from '@/lib/supabase/auth-flags'

function clearAuthQueryParams(pathname: string, searchParams: URLSearchParams) {
  const nextParams = new URLSearchParams(searchParams.toString())
  nextParams.delete('code')
  nextParams.delete('error')
  nextParams.delete('error_code')
  nextParams.delete('error_description')

  const query = nextParams.toString()
  return query ? `${pathname}?${query}` : pathname
}

function getPkceVerifierStorageKey() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!url) return null

  try {
    const hostname = new URL(url).hostname
    const projectRef = hostname.split('.')[0]

    if (!projectRef) return null

    return `sb-${projectRef}-auth-token-code-verifier`
  } catch {
    return null
  }
}

function hasPkceVerifier() {
  const key = getPkceVerifierStorageKey()

  if (!key) return false

  try {
    return Boolean(window.localStorage.getItem(key))
  } catch {
    return false
  }
}

export function SupabaseAuthCodeHandler() {
  const supabase = useSupabaseClient()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailVerificationEnabled = isEmailVerificationEnabled()

  useEffect(() => {
    if (!emailVerificationEnabled) return

    const codeFromUrl = searchParams.get('code')

    if (!codeFromUrl) return
    const authCode = codeFromUrl

    const safePath = clearAuthQueryParams(pathname, new URLSearchParams(searchParams.toString()))

    if (!hasPkceVerifier()) {
      // E-mails de confirmação podem voltar com ?code sem PKCE local; nesse caso só limpamos a URL.
      router.replace(safePath)
      return
    }

    let disposed = false

    async function exchange() {
      const { error } = await supabase.auth.exchangeCodeForSession(authCode)

      if (disposed) return

      if (error) {
        if (!error.message.toLowerCase().includes('pkce code verifier not found')) {
          console.error('Supabase code exchange failed:', error.message)
        }
      }

      router.replace(safePath)
    }

    void exchange()

    return () => {
      disposed = true
    }
  }, [emailVerificationEnabled, pathname, router, searchParams, supabase])

  return null
}
