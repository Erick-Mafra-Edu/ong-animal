'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'
import { SupabaseAuthCodeHandler } from '@/components/supabase-auth-code-handler'
import { SupabaseProvider } from '@/providers/supabase-provider'
import { isEmailVerificationEnabled } from '@/lib/supabase/auth-flags'

export function AppShell({ children }: { children: ReactNode }) {
  const emailVerificationEnabled = isEmailVerificationEnabled()
  const pathname = usePathname()

  const isActiveRoute = (href: string) => pathname === href

  return (
    <SupabaseProvider>
      {emailVerificationEnabled ? (
        <Suspense fallback={null}>
          <SupabaseAuthCodeHandler />
        </Suspense>
      ) : null}

      <div className="min-h-screen pb-24 md:pb-0">
        <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 pt-5 sm:px-6 lg:px-10 md:sticky md:top-0 md:z-40 md:pb-4 md:pt-4">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 backdrop-blur-xl">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-glow">
              OA
            </span>
            <span className="text-sm font-semibold text-slate-900">ONG Animal Next</span>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/swipe"
              aria-current={isActiveRoute('/swipe') ? 'page' : undefined}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${isActiveRoute('/swipe') ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-800'}`}
            >
              <span aria-hidden="true">🐾</span>
              <span>Swipe</span>
            </Link>

            <Link
              href="/chat"
              aria-current={pathname.startsWith('/chat') ? 'page' : undefined}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${pathname.startsWith('/chat') ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-800'}`}
            >
              <span aria-hidden="true">💬</span>
              <span>Chat</span>
            </Link>

            <Link
              href="/login"
              aria-current={isActiveRoute('/login') || isActiveRoute('/cadastro') ? 'page' : undefined}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${isActiveRoute('/login') || isActiveRoute('/cadastro') ? 'border-slate-900 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-800'}`}
            >
              <span aria-hidden="true">👤</span>
              <span>Conta</span>
            </Link>
          </nav>
        </header>

        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
          <div className="mx-auto grid max-w-sm grid-cols-3 items-center text-center text-slate-600">
            <Link
              href="/swipe"
              aria-current={isActiveRoute('/swipe') ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${isActiveRoute('/swipe') ? 'text-emerald-600' : 'text-slate-500'}`}
            >
              <span className="text-2xl" aria-hidden="true">🐾</span>
              <span>Swipe</span>
            </Link>

            <Link
              href="/chat"
              aria-current={pathname.startsWith('/chat') ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${pathname.startsWith('/chat') ? 'text-emerald-600' : 'text-slate-500'}`}
            >
              <span className="text-2xl" aria-hidden="true">💬</span>
              <span>Chat</span>
            </Link>

            <Link
              href="/login"
              aria-current={isActiveRoute('/login') || isActiveRoute('/cadastro') ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${isActiveRoute('/login') || isActiveRoute('/cadastro') ? 'text-slate-950' : 'text-slate-500'}`}
            >
              <span className="text-2xl" aria-hidden="true">👤</span>
              <span>Conta</span>
            </Link>
          </div>
        </nav>

        {children}
      </div>
    </SupabaseProvider>
  )
}