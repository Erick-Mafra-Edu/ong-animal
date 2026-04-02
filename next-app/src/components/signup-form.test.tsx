import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SignupForm } from './signup-form'

const pushMock = vi.fn()
const signUpMock = vi.fn()
const signInMock = vi.fn()

vi.stubEnv('NEXT_PUBLIC_AUTH_EMAIL_VERIFICATION_ENABLED', 'false')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/providers/supabase-provider', () => ({
  useSupabaseClient: () => ({
    auth: {
      signUp: signUpMock,
      signInWithPassword: signInMock,
    },
  }),
}))

describe('SignupForm', () => {
  beforeEach(() => {
    pushMock.mockReset()
    signUpMock.mockReset()
    signInMock.mockReset()
  })

  it('renders the signup flow', () => {
    render(<SignupForm />)

    expect(screen.getByText('Cadastro')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Crie uma senha')).toBeInTheDocument()
  })

  it('renders feedback after submit', async () => {
    signUpMock.mockResolvedValueOnce({ data: { user: { id: 'user-1' }, session: null }, error: null })
    render(<SignupForm />)

    fireEvent.input(screen.getByPlaceholderText('voce@exemplo.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.input(screen.getByPlaceholderText('Crie uma senha'), {
      target: { value: 'secret' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('Cadastro concluído e sessão ativa. Redirecionando para o swipe...')).toBeInTheDocument()
    expect(pushMock).toHaveBeenCalledWith('/swipe')
  })

  it('hides raw email rate limit errors', async () => {
    signInMock.mockResolvedValueOnce({ data: { user: null, session: null }, error: null })
    signUpMock.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Email rate limit exceeded' },
    })

    render(<SignupForm />)

    fireEvent.input(screen.getByPlaceholderText('voce@exemplo.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.input(screen.getByPlaceholderText('Crie uma senha'), {
      target: { value: 'secret' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('Não foi possível concluir o cadastro agora. Aguarde alguns minutos e tente novamente, ou entre com uma conta já existente.')).toBeInTheDocument()
    expect(screen.queryByText(/email rate limit/i)).not.toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
