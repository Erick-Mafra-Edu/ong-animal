import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OngDashboardStats } from './ong-dashboard-stats'

vi.mock('@/providers/supabase-provider', () => ({
  useSupabaseClient: () => ({
    from: () => ({
      select: () =>
        Promise.resolve({
          data: [
            { id: 'a1', is_active: true },
            { id: 'a2', is_active: true },
            { id: 'a3', is_active: false },
          ],
          error: null,
        }),
    }),
  }),
}))

describe('OngDashboardStats', () => {
  it('renders three stat cards', async () => {
    render(<OngDashboardStats />)

    expect(await screen.findByText('Total de animais')).toBeInTheDocument()
    expect(screen.getByText('Disponíveis')).toBeInTheDocument()
    expect(screen.getByText('Adotados / Inativos')).toBeInTheDocument()
  })

  it('displays loaded stats correctly', async () => {
    render(<OngDashboardStats />)

    // total=3, active=2, inactive=1
    await screen.findByText('Total de animais')
    const values = screen.getAllByText(/^\d+$/)
    const nums = values.map((el) => Number(el.textContent))
    expect(nums).toContain(3)
    expect(nums).toContain(2)
    expect(nums).toContain(1)
  })
})
