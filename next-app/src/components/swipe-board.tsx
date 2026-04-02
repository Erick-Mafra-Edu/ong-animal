'use client'

import React from 'react'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type SwipeProfile = {
  id: string
  name: string
  age: number
  location: string
  image: string
  bio: string
  traits: string[]
}

const initialProfiles: SwipeProfile[] = [
  {
    id: 'yolo',
    name: 'Yolo',
    age: 2,
    location: 'São Paulo, SP',
    image:
      'https://firebasestorage.googleapis.com/v0/b/codeless-app.appspot.com/o/projects%2F0SObcceZFqcMj44PAXdK%2F2caeaa6e02fa3ae736d01407675af388d36db7dcRectangle.png?alt=media&token=d65ade4e-cfa2-493d-924f-9f6d4275a669',
    bio: 'Companheiro tranquilo, ótimo para quem está começando a rotina de adoção.',
    traits: ['Calmo', 'Vacinado', 'Sociável'],
  },
  {
    id: 'mila',
    name: 'Mila',
    age: 1,
    location: 'Campinas, SP',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    bio: 'Cheia de energia e carinhosa, adora brincadeiras e passeios longos.',
    traits: ['Ativa', 'Inteligente', 'Brincalhona'],
  },
  {
    id: 'pingo',
    name: 'Pingo',
    age: 4,
    location: 'Sorocaba, SP',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
    bio: 'Mais reservado no início, cria vínculo forte com adaptação gradual.',
    traits: ['Gentil', 'Observador', 'Carinhoso'],
  },
]

type SwipeAction = 'pass' | 'like' | 'super-like'

export function SwipeBoard() {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [history, setHistory] = useState<{ id: string; action: SwipeAction }[]>([])

  const currentProfile = profiles[0]

  const stats = useMemo(() => {
    const likes = history.filter((item) => item.action === 'like').length
    const superLikes = history.filter((item) => item.action === 'super-like').length
    const passes = history.filter((item) => item.action === 'pass').length

    return { likes, superLikes, passes }
  }, [history])

  function swipe(action: SwipeAction) {
    if (!currentProfile) return

    setHistory((prev) => [...prev, { id: currentProfile.id, action }])
    setProfiles((prev) => prev.slice(1))
  }

  function restart() {
    setProfiles(initialProfiles)
    setHistory([])
  }

  if (!currentProfile) {
    return (
      <section className="mx-auto max-w-5xl rounded-[36px] border border-slate-200 bg-white/80 p-8 text-center shadow-[0_24px_90px_-45px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Swipe concluído</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Você avaliou todos os perfis.</h1>
        <p className="mt-4 text-slate-600">Resumo da sessão: {stats.likes} likes, {stats.superLikes} super likes e {stats.passes} passes.</p>
        <button
          type="button"
          onClick={restart}
          className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Recomeçar sessão
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.7fr_1.3fr]">
      <aside className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_80px_-38px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Sessão pós-login</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Tela principal de swipe</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Esta é a área principal após autenticação, simulando o fluxo real de seleção de perfis para adoção.
        </p>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="font-semibold text-slate-900">Perfis restantes:</span> {profiles.length}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="font-semibold text-slate-900">Likes:</span> {stats.likes}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="font-semibold text-slate-900">Super likes:</span> {stats.superLikes}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="font-semibold text-slate-900">Passes:</span> {stats.passes}
          </div>
        </div>
      </aside>

      <div className="rounded-[36px] border border-white/80 bg-white/85 p-4 shadow-[0_30px_90px_-28px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950">
          <div className="relative aspect-[4/5] min-h-[520px]">
            <Image src={currentProfile.image} alt={currentProfile.name} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black leading-none">{currentProfile.name}</p>
                  <p className="mt-2 text-sm font-medium text-white/80">{currentProfile.age} anos • {currentProfile.location}</p>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
                  Perfil ativo
                </span>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/88">{currentProfile.bio}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentProfile.traits.map((trait) => (
                  <span key={trait} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => swipe('pass')}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Passar
          </button>
          <button
            type="button"
            onClick={() => swipe('like')}
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Curtir
          </button>
          <button
            type="button"
            onClick={() => swipe('super-like')}
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Super Like
          </button>
        </div>
      </div>
    </section>
  )
}
