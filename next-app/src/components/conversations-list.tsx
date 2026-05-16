'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@/providers/supabase-provider'
import { fetchApprovedMatches, getFallbackMatches } from '@/lib/supabase/chat-matches'
import type { ChatMatch } from '@/lib/supabase/chat-matches'

type ConversationsListProps = {
  initialMatches?: ChatMatch[]
}

export function ConversationsList({ initialMatches }: ConversationsListProps) {
  const supabase = useSupabaseClient()
  const [matches, setMatches] = useState<ChatMatch[]>(initialMatches ?? [])
  const [isLoading, setIsLoading] = useState(!initialMatches)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (initialMatches) return

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (cancelled) return

        if (!user) {
          setMatches(getFallbackMatches())
          setLoadError('Entre na sua conta para ver seus matches aprovados.')
          return
        }

        const approved = await fetchApprovedMatches(supabase, user.id)

        if (cancelled) return

        setMatches(approved)
        setLoadError(null)
      } catch (err) {
        if (cancelled) return
        setMatches(getFallbackMatches())
        setLoadError(err instanceof Error ? err.message : 'Falha ao carregar conversas.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [initialMatches, supabase])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-16 text-center">
        <p className="text-sm text-slate-400">Carregando conversas...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200/60 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">Conversas</h2>
        {loadError ? (
          <p className="mt-1 text-xs text-amber-600">{loadError}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">
            {matches.length} conversa{matches.length !== 1 ? 's' : ''} ativa{matches.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="text-5xl">💬</span>
          <p className="font-semibold text-slate-700">Nenhuma conversa ainda</p>
          <p className="max-w-xs text-sm text-slate-500">
            Dê like nos perfis do swipe e aguarde a aprovação para iniciar uma conversa.
          </p>
          <Link
            href="/swipe"
            className="mt-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            Ir para o Swipe
          </Link>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto divide-y divide-slate-100" data-testid="matches-list">
          {matches.map((match) => (
            <li key={match.id}>
              <Link
                href={`/chat/${match.id}`}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                data-testid={`match-${match.id}`}
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
                  {match.profile_image ? (
                    <Image src={match.profile_image} alt={match.profile_name} fill className="object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-xl">🐾</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{match.profile_name}</p>
                  <p className="truncate text-sm text-slate-500">Toque para abrir a conversa</p>
                </div>
                <span className="text-slate-400" aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
