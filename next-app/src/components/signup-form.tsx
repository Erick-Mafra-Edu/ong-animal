'use client'

import React from 'react'
import Link from 'next/link'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from '@/lib/supabase/auth'
import { isEmailVerificationEnabled } from '@/lib/supabase/auth-flags'
import { useSupabaseClient } from '@/providers/supabase-provider'

function isEmailRateLimitedError(message: string) {
  const normalized = message.toLowerCase()

  return (
    normalized.includes('email rate') ||
    normalized.includes('over_email_send_rate_limit') ||
    normalized.includes('security purposes')
  )
}

function normalizeSignupError(message: string, emailVerificationEnabled: boolean) {
  const normalized = message.toLowerCase()

  if (isEmailRateLimitedError(message)) {
    return emailVerificationEnabled
      ? 'Muitas tentativas em pouco tempo. Aguarde alguns minutos antes de tentar novo cadastro.'
      : 'Não foi possível concluir o cadastro agora. Aguarde alguns minutos e tente novamente, ou entre com uma conta já existente.'
  }

  if (normalized.includes('user already registered')) {
    return 'Já existe uma conta para este e-mail. Tente entrar na tela de login.'
  }

  if (normalized.includes('invalid email')) {
    return 'Digite um e-mail válido para concluir o cadastro.'
  }

  return message
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const value = (error as { message?: unknown }).message

    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
  }

  return 'Falha ao criar conta'
}

export function SignupForm() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const emailVerificationEnabled = isEmailVerificationEnabled()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    setFeedback(null)
    setIsPending(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session || !emailVerificationEnabled) {
        setFeedback('Cadastro concluído e sessão ativa. Redirecionando para o swipe...')
        router.push('/swipe')
        return
      }

      if (data.user) {
        setFeedback('Conta criada. Confirme seu e-mail para liberar o login.')
        return
      }

      if (emailVerificationEnabled) {
        const sessionResult = await signInWithEmailAndPassword(supabase, { email, password })

        if (sessionResult.session) {
          setFeedback('Cadastro concluído e login liberado. Redirecionando para o swipe...')
          router.push('/swipe')
          return
        }

        setFeedback('Conta criada, mas a sessão ainda depende de confirmação de e-mail.')
        return
      }

      setFeedback('Cadastro concluído. Redirecionando para o swipe...')
      router.push('/swipe')
    } catch (error) {
      const message = getErrorMessage(error)

      if (!emailVerificationEnabled && isEmailRateLimitedError(message)) {
        try {
          const sessionResult = await signInWithEmailAndPassword(supabase, { email, password })

          if (sessionResult.session) {
            setFeedback('Conta já existente detectada e login realizado. Redirecionando para o swipe...')
            router.push('/swipe')
            return
          }
        } catch {
          // Ignora falha de fallback e exibe mensagem amigável abaixo.
        }
      }

      setFeedback(normalizeSignupError(message, emailVerificationEnabled))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_90px_-45px_rgba(15,23,42,0.45)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/65">Cadastro</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white/85">Nome completo</span>
          <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/15" placeholder="Seu nome" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white/85">E-mail</span>
          <input name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} data-bwignore="true" data-1p-ignore="true" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/15" placeholder="voce@exemplo.com" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-white/85">Senha</span>
          <input name="password" type="password" autoComplete="new-password" autoCapitalize="none" spellCheck={false} data-bwignore="true" data-1p-ignore="true" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/15" placeholder="Crie uma senha" />
        </label>

        <button type="submit" disabled={isPending} className="w-full rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? 'Criando conta...' : 'Criar conta'}
        </button>
        <Link href="/login" className="block w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15">
          Já tenho conta
        </Link>

        {feedback ? <p role="status" aria-live="polite" className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/85">{feedback}</p> : null}
      </form>
    </section>
  )
}
