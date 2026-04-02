'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@/providers/supabase-provider'
import { fetchOngDashboardStats, type OngDashboardStats } from '@/lib/supabase/ong-animals'

type StatCardProps = {
  value: number
  label: string
  colorClass: string
}

function StatCard({ value, label, colorClass }: StatCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.2)]">
      <p className={`text-4xl font-black ${colorClass}`}>{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

export function OngDashboardStats() {
  const supabase = useSupabaseClient()
  const [stats, setStats] = useState<OngDashboardStats>({ total: 0, active: 0, inactive: 0 })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOngDashboardStats(supabase)
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas.'))
  }, [supabase])

  return (
    <section aria-label="Estatísticas">
      {error ? (
        <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard value={stats.total} label="Total de animais" colorClass="text-slate-900" />
        <StatCard value={stats.active} label="Disponíveis" colorClass="text-emerald-600" />
        <StatCard value={stats.inactive} label="Adotados / Inativos" colorClass="text-cyan-600" />
      </div>
    </section>
  )
}
