'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type OngNavItem = {
  href: string
  emoji: string
  label: string
}

const navItems: OngNavItem[] = [
  { href: '/ong/dashboard', emoji: '🏢', label: 'Painel' },
  { href: '/ong/cadastrar-animal', emoji: '➕', label: 'Cadastrar' },
  { href: '/ong/interessados', emoji: '👥', label: 'Interessados' },
]

export default function OngLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen">
      {/* Desktop side navigation */}
      <div className="mx-auto flex max-w-[1440px] gap-0 px-5 py-6 sm:px-6 lg:px-10">
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="sticky top-24 flex flex-col gap-2">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Painel ONG
            </p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  isActive(item.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile bottom tab navigation */}
      <nav
        aria-label="Painel ONG"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid max-w-sm grid-cols-3 items-center text-center text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                isActive(item.href) ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {item.emoji}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
