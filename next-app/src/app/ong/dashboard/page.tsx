import React from 'react'
import Link from 'next/link'
import { OngDashboardStats } from '@/components/ong-dashboard-stats'

export default function DashboardPage() {
  return (
    <div className="pb-28 md:pb-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">
        Painel da ONG{' '}
        <span aria-hidden="true">🏢</span>
      </h1>
      <p className="mt-1 text-sm text-slate-500">Gerencie os animais disponíveis para adoção.</p>

      {/* Stats */}
      <div className="mt-6">
        <OngDashboardStats />
      </div>

      {/* Quick actions */}
      <section aria-label="Ações rápidas" className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Ações rápidas</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/ong/cadastrar-animal"
            className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(16,185,129,0.6)] transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            <span aria-hidden="true">➕</span>
            Cadastrar animal
          </Link>

          <Link
            href="/ong/interessados"
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span aria-hidden="true">👥</span>
            Ver interessados
          </Link>
        </div>
      </section>
    </div>
  )
}
