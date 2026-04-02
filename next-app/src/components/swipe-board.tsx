'use client'

import React from 'react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSupabaseClient } from '@/providers/supabase-provider'
import { fetchSwipeProfiles, getFallbackSwipeProfiles } from '@/lib/supabase/swipe-profiles'
import type { SwipeProfile } from '@/lib/supabase/swipe-profiles'

type SwipeAction = 'pass' | 'like' | 'super-like'
type Motion = 'idle' | 'enter' | 'exit-left' | 'exit-right' | 'exit-up'

type SwipeBoardProps = {
  initialProfiles?: SwipeProfile[]
}

const motionClasses: Record<Motion, string> = {
  idle: 'translate-y-0 scale-100 opacity-100',
  enter: 'translate-y-4 scale-[0.98] opacity-0',
  'exit-left': 'translate-x-[-38%] rotate-[-10deg] scale-[0.98] opacity-0',
  'exit-right': 'translate-x-[38%] rotate-[10deg] scale-[0.98] opacity-0',
  'exit-up': '-translate-y-[22%] scale-[0.95] opacity-0',
}

function exitMotion(action: SwipeAction): Motion {
  if (action === 'pass') return 'exit-left'
  if (action === 'like') return 'exit-right'
  return 'exit-up'
}

function renderTrait(trait: string) {
  return (
    <span
      key={trait}
      className="rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
    >
      {trait}
    </span>
  )
}

export function SwipeBoard({ initialProfiles }: SwipeBoardProps) {
  const supabase = useSupabaseClient()
  const hasAnimatedRef = useRef(false)
  const swipeTimerRef = useRef<number | null>(null)
  const settleTimerRef = useRef<number | null>(null)

  const defaultProfiles = getFallbackSwipeProfiles()
  const firstProfiles = initialProfiles?.length ? initialProfiles : defaultProfiles

  const [profiles, setProfiles] = useState<SwipeProfile[]>(firstProfiles)
  const [history, setHistory] = useState<{ id: string; action: SwipeAction }[]>([])
  const [motion, setMotion] = useState<Motion>('idle')
  const [pendingAction, setPendingAction] = useState<SwipeAction | null>(null)
  const [isLoading, setIsLoading] = useState(!initialProfiles?.length)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [totalProfiles, setTotalProfiles] = useState(firstProfiles.length)

  const currentProfile = profiles[0]
  const nextProfile = profiles[1]

  const stats = useMemo(
    () => ({
      likes: history.filter((item) => item.action === 'like').length,
      superLikes: history.filter((item) => item.action === 'super-like').length,
      passes: history.filter((item) => item.action === 'pass').length,
    }),
    [history],
  )

  useEffect(() => {
    let cancelled = false

    async function loadProfiles() {
      if (initialProfiles?.length) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const remoteProfiles = await fetchSwipeProfiles(supabase)

        if (cancelled) return

        if (remoteProfiles.length > 0) {
          setProfiles(remoteProfiles)
          setTotalProfiles(remoteProfiles.length)
          setLoadError(null)
        } else {
          const fallback = getFallbackSwipeProfiles()
          setProfiles(fallback)
          setTotalProfiles(fallback.length)
          setLoadError('Nenhum perfil ativo encontrado no Supabase. Exibindo perfis de fallback.')
        }
      } catch (error) {
        if (cancelled) return

        const fallback = getFallbackSwipeProfiles()
        setProfiles(fallback)
        setTotalProfiles(fallback.length)
        setLoadError(error instanceof Error ? error.message : 'Falha ao carregar perfis do Supabase.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadProfiles()

    return () => {
      cancelled = true
      if (swipeTimerRef.current) window.clearTimeout(swipeTimerRef.current)
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current)
    }
  }, [initialProfiles, supabase])

  useEffect(() => {
    if (!currentProfile) return

    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true
      return
    }

    setMotion('enter')
    settleTimerRef.current = window.setTimeout(() => setMotion('idle'), 220)

    return () => {
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current)
    }
  }, [currentProfile?.id])

  function swipe(action: SwipeAction) {
    if (!currentProfile || motion !== 'idle' || isLoading) return

    setPendingAction(action)
    setMotion(exitMotion(action))
    setHistory((previous) => [...previous, { id: currentProfile.id, action }])

    if (swipeTimerRef.current) window.clearTimeout(swipeTimerRef.current)

    swipeTimerRef.current = window.setTimeout(() => {
      setProfiles((previous) => previous.slice(1))
      setPendingAction(null)
      setMotion('enter')
      settleTimerRef.current = window.setTimeout(() => setMotion('idle'), 220)
    }, 220)
  }

  function restart() {
    if (swipeTimerRef.current) window.clearTimeout(swipeTimerRef.current)
    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current)

    const startProfiles = initialProfiles?.length ? initialProfiles : getFallbackSwipeProfiles()
    setProfiles(startProfiles)
    setTotalProfiles(startProfiles.length)
    setHistory([])
    setPendingAction(null)
    setMotion('enter')
    settleTimerRef.current = window.setTimeout(() => setMotion('idle'), 220)
  }

  if (!currentProfile) {
    return (
      <section className="mx-auto max-w-5xl rounded-[36px] border border-white/30 bg-slate-950/80 p-8 text-center text-white shadow-[0_24px_90px_-45px_rgba(2,6,23,0.8)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Swipe concluído</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Você avaliou todos os perfis.</h1>
        <p className="mt-4 text-white/80">
          Resumo da sessão: {stats.likes} likes, {stats.superLikes} super likes e {stats.passes} passes.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-6 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-400"
        >
          Recomeçar sessão
        </button>
      </section>
    )
  }

  const viewedRatio = totalProfiles > 0 ? history.length / totalProfiles : 0
  const activeProgressIndex = Math.min(2, Math.floor(viewedRatio * 3))

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="hidden lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <article className="relative overflow-hidden rounded-[28px] border border-white/20 bg-slate-950 shadow-[0_24px_100px_-42px_rgba(2,6,23,0.9)]">
          <div className="relative min-h-[680px] overflow-hidden">
            {nextProfile ? (
              <div className="absolute inset-0 scale-[0.99] opacity-70 blur-[1px]">
                <Image src={nextProfile.image} alt={nextProfile.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/35" />
              </div>
            ) : null}

            <div className={`absolute inset-0 transition-all duration-200 ease-out ${motionClasses[motion]}`}>
              <Image src={currentProfile.image} alt={currentProfile.name} fill priority className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>
        </article>

        <aside className="flex min-h-[680px] flex-col rounded-[28px] border border-white/15 bg-slate-950/75 p-10 text-white shadow-[0_24px_100px_-42px_rgba(2,6,23,0.95)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Tela principal de swipe</p>
          <div className="mt-8 flex items-end gap-3">
            <h1 className="text-6xl font-black leading-none">{currentProfile.name}</h1>
            <span className="mb-2 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">ok</span>
          </div>
          <p className="mt-2 text-3xl font-medium text-white/85">{currentProfile.age}</p>

          <p className="mt-8 max-w-xl text-lg leading-9 text-white/80">{currentProfile.bio}</p>

          <h2 className="mt-8 text-2xl font-bold">Interesses</h2>
          <div className="mt-4 flex flex-wrap gap-3">{currentProfile.traits.map(renderTrait)}</div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => swipe('pass')}
              disabled={isLoading || motion !== 'idle'}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Not Interested
            </button>
            <button
              type="button"
              onClick={() => swipe('like')}
              disabled={isLoading || motion !== 'idle'}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Interested
            </button>
          </div>

          <button
            type="button"
            onClick={() => swipe('super-like')}
            disabled={isLoading || motion !== 'idle'}
            className="mt-4 w-fit rounded-full border border-amber-300/60 bg-amber-400/10 px-5 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Super Like
          </button>

          <div className="mt-auto space-y-2 text-sm text-white/70">
            <p>• Location: {currentProfile.location}</p>
            <p>• Available for adoption</p>
            <p>• Perfis restantes: {profiles.length}</p>
            <p>• Likes: {stats.likes} | Super likes: {stats.superLikes} | Passes: {stats.passes}</p>
          </div>

          {pendingAction ? <p className="mt-4 text-sm font-semibold text-white/85">{pendingAction === 'pass' ? 'Passando...' : pendingAction === 'like' ? 'Curtindo...' : 'Super like...'}</p> : null}
          {isLoading ? <p className="mt-2 text-sm text-white/70">Carregando perfis do Supabase...</p> : null}
          {loadError ? <p className="mt-2 text-sm text-amber-200">{loadError}</p> : null}
        </aside>
      </div>

      <div className="lg:hidden">
        <article className="relative min-h-[calc(100dvh-11.5rem)] w-full overflow-hidden bg-slate-950">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-4 right-4 top-4 z-30 flex gap-2">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index <= activeProgressIndex ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>

            {nextProfile ? (
              <div className="absolute inset-0 scale-[0.99] opacity-70 blur-[1px]">
                <Image src={nextProfile.image} alt={nextProfile.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/45" />
              </div>
            ) : null}

            <div className={`absolute inset-0 transition-all duration-200 ease-out ${motionClasses[motion]}`}>
              <Image src={currentProfile.image} alt={currentProfile.name} fill priority className="object-cover" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />

            <div className="absolute bottom-40 left-4 right-4 z-20 text-white">
              <div className="flex items-end justify-between">
                <h2 className="text-5xl font-black leading-none">{currentProfile.name}</h2>
                <span className="mb-1 rounded-full bg-blue-500 px-2 py-1 text-xs font-bold">ok</span>
              </div>
              <p className="mt-2 text-3xl text-white/85">{currentProfile.age}</p>
              <div className="mt-4 flex flex-wrap gap-2">{currentProfile.traits.map(renderTrait)}</div>
              <p className="mt-4 text-sm font-semibold text-white/85">{currentProfile.location}</p>
              <p className="mt-1 text-xs text-white/70">Likes: {stats.likes} | Super likes: {stats.superLikes} | Passes: {stats.passes}</p>
            </div>

            <div className="absolute bottom-24 left-0 right-0 z-30 px-5">
              <div className="mx-auto mb-3 grid w-fit place-items-center">
                <button
                  type="button"
                  onClick={() => swipe('super-like')}
                  disabled={isLoading || motion !== 'idle'}
                  className="grid size-12 place-items-center rounded-full border border-amber-300/70 bg-black/35 text-xl text-amber-200 backdrop-blur disabled:opacity-60"
                >
                  ★
                </button>
              </div>

              <div className="mx-auto flex max-w-sm items-center justify-between">
                <button
                  type="button"
                  onClick={restart}
                  className="grid size-14 place-items-center rounded-full border border-amber-400/70 bg-black/35 text-2xl text-amber-300 backdrop-blur"
                >
                  ↺
                </button>
                <button
                  type="button"
                  onClick={() => swipe('pass')}
                  disabled={isLoading || motion !== 'idle'}
                  className="grid size-16 place-items-center rounded-full border border-rose-400/70 bg-black/35 text-3xl text-rose-300 backdrop-blur disabled:opacity-60"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => swipe('like')}
                  disabled={isLoading || motion !== 'idle'}
                  className="grid size-16 place-items-center rounded-full border border-emerald-400/70 bg-black/35 text-3xl text-emerald-300 backdrop-blur disabled:opacity-60"
                >
                  ❤
                </button>
              </div>
            </div>

            <div className="absolute bottom-[6.25rem] left-4 right-4 z-30 text-center">
              {pendingAction ? <p className="text-sm font-semibold text-white/90">{pendingAction === 'pass' ? 'Passando...' : pendingAction === 'like' ? 'Curtindo...' : 'Super like...'}</p> : null}
              {isLoading ? <p className="mt-1 text-xs text-white/70">Carregando perfis do Supabase...</p> : null}
              {loadError ? <p className="mt-1 text-xs text-amber-200">{loadError}</p> : null}
            </div>
          </div>
        </article>

        <div className="mx-auto mt-3 w-full px-4 text-center text-xs text-slate-600">
          <p>Deslize para explorar mais perfis.</p>
        </div>
      </div>
    </section>
  )
}
