import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { OngAnimalForm } from './ong-animal-form'

const pushMock = vi.fn()
const insertMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/providers/supabase-provider', () => ({
  useSupabaseClient: () => ({
    from: () => ({
      insert: insertMock,
    }),
  }),
}))

describe('OngAnimalForm', () => {
  beforeEach(() => {
    pushMock.mockReset()
    insertMock.mockReset()
  })

  it('renders all required form fields', () => {
    render(<OngAnimalForm />)

    expect(screen.getByPlaceholderText('Ex: Yolo, Mila, Pingo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: 2')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: São Paulo, SP')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cadastrar animal' })).toBeInTheDocument()
  })

  it('shows validation error when required fields are empty', async () => {
    render(<OngAnimalForm />)

    fireEvent.submit(screen.getByRole('button', { name: 'Cadastrar animal' }))

    expect(await screen.findByText('Preencha nome, idade e localização para continuar.')).toBeInTheDocument()
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('shows age validation error for non-integer age', async () => {
    render(<OngAnimalForm />)

    fireEvent.input(screen.getByPlaceholderText('Ex: Yolo, Mila, Pingo'), {
      target: { value: 'Rex' },
    })
    fireEvent.input(screen.getByPlaceholderText('Ex: 2'), {
      target: { value: '-1' },
    })
    fireEvent.input(screen.getByPlaceholderText('Ex: São Paulo, SP'), {
      target: { value: 'São Paulo, SP' },
    })

    fireEvent.submit(screen.getByRole('button', { name: 'Cadastrar animal' }))

    expect(await screen.findByText('Idade deve ser um número inteiro igual ou maior que zero.')).toBeInTheDocument()
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('inserts animal and redirects to dashboard on success', async () => {
    insertMock.mockResolvedValueOnce({ error: null })

    render(<OngAnimalForm />)

    fireEvent.input(screen.getByPlaceholderText('Ex: Yolo, Mila, Pingo'), {
      target: { value: 'Yolo' },
    })
    fireEvent.input(screen.getByPlaceholderText('Ex: 2'), {
      target: { value: '2' },
    })
    fireEvent.input(screen.getByPlaceholderText('Ex: São Paulo, SP'), {
      target: { value: 'São Paulo, SP' },
    })

    fireEvent.submit(screen.getByRole('button', { name: 'Cadastrar animal' }))

    expect(await screen.findByText('Animal cadastrado com sucesso! Redirecionando...')).toBeInTheDocument()
    expect(pushMock).toHaveBeenCalledWith('/ong/dashboard')
  })

  it('shows error message when insert fails', async () => {
    insertMock.mockResolvedValueOnce({ error: { message: 'Falha ao inserir' } })

    render(<OngAnimalForm />)

    fireEvent.input(screen.getByPlaceholderText('Ex: Yolo, Mila, Pingo'), {
      target: { value: 'Rex' },
    })
    fireEvent.input(screen.getByPlaceholderText('Ex: 2'), {
      target: { value: '3' },
    })
    fireEvent.input(screen.getByPlaceholderText('Ex: São Paulo, SP'), {
      target: { value: 'Campinas, SP' },
    })

    fireEvent.submit(screen.getByRole('button', { name: 'Cadastrar animal' }))

    expect(await screen.findByText('Falha ao inserir')).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
