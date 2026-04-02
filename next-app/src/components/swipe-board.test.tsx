import React from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SwipeBoard } from './swipe-board'

vi.mock('@/providers/supabase-provider', () => ({
  useSupabaseClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: async () => ({ data: [], error: null }),
        }),
      }),
    }),
  }),
}))

const testProfiles = [
  {
    id: 'alpha',
    name: 'Alpha',
    age: 3,
    location: 'São Paulo, SP',
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b6?auto=format&fit=crop&w=1200&q=80',
    bio: 'Perfil de teste para o swipe animado.',
    traits: ['Calmo', 'Vacinado'],
  },
  {
    id: 'beta',
    name: 'Beta',
    age: 2,
    location: 'Campinas, SP',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80',
    bio: 'Segundo perfil para validar a troca do card.',
    traits: ['Brincalhona', 'Sociável'],
  },
]

describe('SwipeBoard', () => {
  it('renders the post-login swipe area', () => {
    render(<SwipeBoard initialProfiles={testProfiles} />)

    expect(screen.getByText('Tela principal de swipe')).toBeInTheDocument()
    expect(screen.getAllByText('Alpha')).toHaveLength(2)
  })

  it('shows swipe feedback and records the action', () => {
    render(<SwipeBoard initialProfiles={testProfiles} />)

    fireEvent.click(screen.getByRole('button', { name: 'Interested' }))

    expect(screen.getAllByText('Curtindo...').length).toBeGreaterThan(0)
    expect(screen.getByText('Likes: 1 | Super likes: 0 | Passes: 0')).toBeInTheDocument()
  })
})
