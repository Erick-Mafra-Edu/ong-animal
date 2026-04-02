import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { LoginForm } from './login-form'

const pushMock = vi.fn()
const signInMock = vi.fn()

vi.stubEnv('NEXT_PUBLIC_AUTH_EMAIL_VERIFICATION_ENABLED', 'false')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/providers/supabase-provider', () => ({
  useSupabaseClient: () => ({
    auth: {
      signInWithPassword: signInMock,
    },
  }),
}))

describe('LoginForm', () => {
  it('renders login form fields', () => {
    signInMock.mockResolvedValueOnce({ data: { session: { access_token: 'token' } }, error: null })
    render(<LoginForm />)

    expect(screen.getByText('Entre para acompanhar seus favoritos.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('voce@onganimal.org')).toBeInTheDocument()
  })

  it('shows a success message after submit', async () => {
    signInMock.mockResolvedValueOnce({ data: { session: { access_token: 'token' } }, error: null })
    render(<LoginForm />)

    fireEvent.input(screen.getByPlaceholderText('voce@onganimal.org'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.input(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: 'secret' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Entrar agora' }))

    expect(await screen.findByText('Login realizado com sucesso. Redirecionando para o swipe.')).toBeInTheDocument()
  })

  it('shows validation feedback when fields are empty', async () => {
    signInMock.mockReset()
    render(<LoginForm />)

    fireEvent.submit(screen.getByRole('button', { name: 'Entrar agora' }))

    expect(await screen.findByText('Preencha e-mail e senha para continuar.')).toBeInTheDocument()
  })

  it('shows a session warning when auth returns without session', async () => {
    vi.mocked(pushMock).mockReset()
    signInMock.mockResolvedValueOnce({ data: { session: null }, error: null })

    render(<LoginForm />)

    fireEvent.input(screen.getByPlaceholderText('voce@onganimal.org'), {
      target: { value: 'confirmed@example.com' },
    })
    fireEvent.input(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: 'secret' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Entrar agora' }))

    expect(await screen.findByText('Não foi possível iniciar a sessão. Verifique suas credenciais e a configuração do Supabase.')).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
