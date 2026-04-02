'use client'

import React from 'react'
import Link from 'next/link'
import type { FormEvent } from 'react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from '@/lib/supabase/auth'
import { isEmailVerificationEnabled } from '@/lib/supabase/auth-flags'
import { useSupabaseClient } from '@/providers/supabase-provider'

export function LoginForm() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const emailVerificationEnabled = isEmailVerificationEnabled()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [isPending, startTransition] = useTransition()

  function normalizeAuthError(message: string) {
    const normalized = message.toLowerCase()

    if (emailVerificationEnabled && normalized.includes('email not confirmed')) {
      return 'Conta criada, mas e-mail ainda não confirmado. Abra seu e-mail e confirme para entrar.'
    }

    if (normalized.includes('invalid login credentials')) {
      return 'E-mail ou senha inválidos. Confira os dados e tente novamente.'
    }

    if (normalized.includes('configure next_public_supabase_url')) {
      return 'Configuração ausente do Supabase. Verifique as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    }

    if (normalized.includes('failed to fetch') || normalized.includes('networkerror')) {
      return 'Não foi possível conectar ao Supabase. Verifique sua internet e a configuração do projeto.'
    }

    if (normalized.includes('session not found') || normalized.includes('no session')) {
      return emailVerificationEnabled
        ? 'Login concluído, mas a sessão não foi criada. Verifique se o e-mail foi confirmado.'
        : 'Login concluído, mas a sessão não foi criada. Verifique suas credenciais e a configuração do Supabase.'
    }

    return message
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email || !password) {
      setErrorMessage('Preencha e-mail e senha para continuar.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Digite um e-mail válido para entrar.')
      return
    }

    try {
      const result = await signInWithEmailAndPassword(supabase, { email, password })

      if (!result.session) {
        setErrorMessage(
          emailVerificationEnabled
            ? 'Não foi possível iniciar a sessão. Verifique se o e-mail está confirmado.'
            : 'Não foi possível iniciar a sessão. Verifique suas credenciais e a configuração do Supabase.',
        )
        return
      }

      setSuccessMessage('Login realizado com sucesso. Redirecionando para o swipe.')
      startTransition(() => router.push('/swipe'))
    } catch (error) {
      setErrorMessage(error instanceof Error ? normalizeAuthError(error.message) : 'Falha ao entrar')
    }
  }

  return (
    <div className="rounded-[36px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_90px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-8">
      <div className="max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Login</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Entre para acompanhar seus favoritos.</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          O formulário abaixo usa Supabase Auth de verdade, então o fluxo já fica pronto para a integração final.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-lg">
        {errorMessage ? (
          <p role="alert" aria-live="assertive" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">E-mail</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            data-bwignore="true"
            data-1p-ignore="true"
            placeholder="voce@onganimal.org"
            value={emailValue}
            onChange={(event) => setEmailValue(event.target.value)}
            aria-invalid={Boolean(errorMessage)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Senha</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoCapitalize="none"
            spellCheck={false}
            data-bwignore="true"
            data-1p-ignore="true"
            placeholder="Digite sua senha"
            value={passwordValue}
            onChange={(event) => setPasswordValue(event.target.value)}
            aria-invalid={Boolean(errorMessage)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
            />
            Manter acesso
          </label>
          <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Esqueci minha senha
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Entrando...' : 'Entrar agora'}
        </button>

        <button
          type="button"
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Continuar com Google
        </button>

        <Link href="/cadastro" className="block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          Ainda não tenho conta
        </Link>

        {successMessage ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        ) : null}
      </form>
    </div>
  )
}
