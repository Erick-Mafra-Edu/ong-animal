'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { SupabaseProvider } from '@/providers/supabase-provider'
import { SupabaseAuthCodeHandler } from '@/components/supabase-auth-code-handler'
import { isEmailVerificationEnabled } from '@/lib/supabase/auth-flags'

export function AppShell({ children }: { children: React.ReactNode }) {
  const emailVerificationEnabled = isEmailVerificationEnabled()

  return (
    <SupabaseProvider>
      {emailVerificationEnabled ? (
        <Suspense fallback={null}>
          <SupabaseAuthCodeHandler />
        </Suspense>
      ) : null}
      <div className="min-h-screen">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 pt-5 sm:px-6 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-2 backdrop-blur-xl">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-glow">
              OA
            </span>
            <span className="text-sm font-semibold text-slate-900">ONG Animal Next</span>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/swipe" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md">
              Swipe
            </Link>
            <Link href="/login" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md">
              Login
            </Link>
            <Link href="/cadastro" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
              Cadastro
            </Link>
          </div>
        </div>
        {children}
      </div>
    </SupabaseProvider>
  )
}
