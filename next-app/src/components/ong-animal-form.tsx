'use client'

import React from 'react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@/providers/supabase-provider'
import { insertOngAnimal } from '@/lib/supabase/ong-animals'

const TRAIT_SUGGESTIONS = [
  'Calmo', 'Ativo', 'Brincalhão', 'Sociável', 'Vacinado', 'Castrado',
  'Gentil', 'Inteligente', 'Carinhoso', 'Observador',
]

function parseTraits(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function OngAnimalForm() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const name = String(formData.get('name') ?? '').trim()
    const ageRaw = String(formData.get('age') ?? '').trim()
    const location = String(formData.get('location') ?? '').trim()
    const image_url = String(formData.get('image_url') ?? '').trim()
    const bio = String(formData.get('bio') ?? '').trim()
    const traitsRaw = String(formData.get('traits') ?? '')

    if (!name || !ageRaw || !location) {
      setFeedback('Preencha nome, idade e localização para continuar.')
      return
    }

    const age = Number(ageRaw)
    if (!Number.isInteger(age) || age < 0) {
      setFeedback('Idade deve ser um número inteiro igual ou maior que zero.')
      return
    }

    setFeedback(null)
    setIsPending(true)

    try {
      await insertOngAnimal(supabase, {
        name,
        age,
        location,
        image_url: image_url || '',
        bio: bio || '',
        traits: parseTraits(traitsRaw),
        is_active: true,
      })

      setFeedback('Animal cadastrado com sucesso! Redirecionando...')
      router.push('/ong/dashboard')
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Erro ao cadastrar animal.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            feedback.startsWith('Animal cadastrado')
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback}
        </p>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Nome *</span>
        <input
          name="name"
          type="text"
          placeholder="Ex: Yolo, Mila, Pingo"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Idade (anos) *</span>
          <input
            name="age"
            type="number"
            min="0"
            placeholder="Ex: 2"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Localização *</span>
          <input
            name="location"
            type="text"
            placeholder="Ex: São Paulo, SP"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">URL da foto</span>
        <input
          name="image_url"
          type="url"
          placeholder="https://exemplo.com/foto.jpg"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Características</span>
        <input
          name="traits"
          type="text"
          placeholder="Ex: Calmo, Vacinado, Sociável"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
        <p className="mt-2 text-xs text-slate-500">
          Sugestões:{' '}
          {TRAIT_SUGGESTIONS.map((t) => (
            <span key={t} className="mr-1 font-medium text-slate-700">{t}</span>
          ))}
        </p>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Descrição</span>
        <textarea
          name="bio"
          rows={3}
          placeholder="Conte um pouco sobre o animal..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Cadastrando...' : 'Cadastrar animal'}
      </button>
    </form>
  )
}
