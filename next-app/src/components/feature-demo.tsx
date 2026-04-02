'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'

export type DemoProfile = {
  title: string
  subtitle: string
  age: string
  location: string
  compatibility: string
  image: string
  chips: string[]
  summary: string
  highlights: string[]
  actionLabel: string
}

const profiles: DemoProfile[] = [
  {
    title: 'Yolo',
    subtitle: 'Companheiro de sofá com energia equilibrada',
    age: '2 anos',
    location: 'Centro de acolhimento São Lucas',
    compatibility: '98%',
    image:
      'https://firebasestorage.googleapis.com/v0/b/codeless-app.appspot.com/o/projects%2F0SObcceZFqcMj44PAXdK%2F2caeaa6e02fa3ae736d01407675af388d36db7dcRectangle.png?alt=media&token=d65ade4e-cfa2-493d-924f-9f6d4275a669',
    chips: ['Calmo', 'Social', 'Castrado', 'Vacinas em dia'],
    summary:
      'Ideal para quem quer um amigo tranquilo, adaptável e pronto para aprender rotina nova sem complicação.',
    highlights: ['Aceita apartamento', 'Compatível com crianças', 'Passeios curtos'],
    actionLabel: 'Quero conhecer o Yolo',
  },
  {
    title: 'Mila',
    subtitle: 'Exploradora afetuosa, pronta para brincadeiras',
    age: '1 ano',
    location: 'Lar temporário Bela Vista',
    compatibility: '91%',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    chips: ['Brincalhona', 'Ativa', 'Inteligente', 'Comandos rápidos'],
    summary:
      'Uma opção para perfis mais dinâmicos: responde rápido, gosta de estímulo e adora interação diária.',
    highlights: ['Gosta de brinquedos', 'Aprende comandos', 'Vai bem com rotina ativa'],
    actionLabel: 'Ver detalhes da Mila',
  },
  {
    title: 'Pingo',
    subtitle: 'Reservado no início, carinhoso quando confia',
    age: '4 anos',
    location: 'ONG Ponto de Partida',
    compatibility: '87%',
    image:
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
    chips: ['Gentil', 'Observador', 'Paciente', 'Adaptação gradual'],
    summary:
      'Perfeito para quem quer construir vínculo aos poucos e valoriza um processo de adoção mais cuidadoso.',
    highlights: ['Precisa de adaptação', 'Muito afetuoso', 'Se dá bem com adultos'],
    actionLabel: 'Iniciar conversa com Pingo',
  },
]

export function FeatureDemo() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [phase, setPhase] = useState<'explore' | 'favorite' | 'adopted'>('explore')

  const activeProfile = profiles[activeIndex]

  const nextProfile = () => {
    setActiveIndex((current) => (current + 1) % profiles.length)
    setPhase('explore')
  }

  const previousProfile = () => {
    setActiveIndex((current) => (current - 1 + profiles.length) % profiles.length)
    setPhase('explore')
  }

  const mockSession = useMemo(
    () => [
      { label: 'Match em 2 min', value: 'simulado' },
      { label: 'Perfil salvo', value: phase === 'favorite' ? 'sim' : 'não' },
      { label: 'Adoção concluída', value: phase === 'adopted' ? 'sim' : 'não' },
    ],
    [phase],
  )

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-[0_28px_100px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Apresentação interativa</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Simule a experiência de adoção em tempo real.
            </h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
            {activeIndex + 1} / {profiles.length}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950">
          <div className="relative aspect-[4/5] min-h-[540px]">
            <Image src={activeProfile.image} alt={activeProfile.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex gap-1 p-4">
              {profiles.map((profile, index) => (
                <div
                  key={profile.title}
                  className={`h-1 flex-1 rounded-full transition ${index === activeIndex ? 'bg-white' : 'bg-white/35'}`}
                />
              ))}
            </div>

            <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
              <span className="rounded-full border border-white/15 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                Demonstração ativa
              </span>
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                Simulado funcionando
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black leading-none sm:text-5xl">{activeProfile.title}</p>
                  <p className="mt-2 text-sm font-medium text-white/80">{activeProfile.subtitle}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur-md">
                  <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/70">Compatibilidade</p>
                  <p className="mt-1 text-2xl font-black">{activeProfile.compatibility}</p>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/88">{activeProfile.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {activeProfile.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button
            onClick={previousProfile}
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Perfil anterior
          </button>
          <button
            onClick={() => setPhase('favorite')}
            type="button"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Favoritar
          </button>
          <button
            onClick={() => setPhase('adopted')}
            type="button"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Simular adoção
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={nextProfile}
            type="button"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            {activeProfile.actionLabel}
          </button>
          <button
            onClick={() => setPhase('explore')}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            Reiniciar demonstração
          </button>
        </div>
      </div>

      <aside className="rounded-[32px] border border-slate-200 bg-white/75 p-5 shadow-[0_24px_80px_-38px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Fluxo simulado</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Como se já estivesse em produção.</h3>

        <div className="mt-5 grid gap-3">
          {mockSession.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-sm font-medium text-slate-600">{item.label}</span>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Características em foco</p>
          <div className="mt-4 space-y-3">
            {activeProfile.highlights.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="grid size-8 place-items-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item}</p>
                  <p className="text-xs text-slate-500">Atualizado conforme o perfil ativo.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/chat"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Abrir chat
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Ver login
          </Link>
        </div>
      </aside>
    </section>
  )
}
