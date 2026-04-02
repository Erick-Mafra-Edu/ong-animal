import { describe, expect, it, vi } from 'vitest'
import {
  fetchOngDashboardStats,
  fetchOngAnimals,
  insertOngAnimal,
} from './ong-animals'

function makeClient(data: unknown[], error: unknown = null) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data, error }),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error }),
  }
  return {
    from: vi.fn().mockReturnValue(chain),
    _chain: chain,
  }
}

describe('fetchOngDashboardStats', () => {
  it('counts total, active, and inactive profiles', async () => {
    const client = makeClient([
      { id: 'a1', is_active: true },
      { id: 'a2', is_active: true },
      { id: 'a3', is_active: false },
    ])
    // Override select to resolve directly (no order needed for stats)
    client._chain.select = vi.fn().mockResolvedValue({
      data: [
        { id: 'a1', is_active: true },
        { id: 'a2', is_active: true },
        { id: 'a3', is_active: false },
      ],
      error: null,
    })

    const stats = await fetchOngDashboardStats(client as never)

    expect(stats).toEqual({ total: 3, active: 2, inactive: 1 })
  })

  it('throws when supabase returns an error', async () => {
    const client = makeClient([], { message: 'DB error' })
    client._chain.select = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'DB error' },
    })

    await expect(fetchOngDashboardStats(client as never)).rejects.toThrow('DB error')
  })
})

describe('fetchOngAnimals', () => {
  it('returns mapped profiles ordered by sort_order', async () => {
    const mockData = [
      { id: 'p1', name: 'Yolo', age: 2, location: 'SP', image_url: 'img', bio: '', traits: ['Calmo'], is_active: true, sort_order: 0 },
    ]
    const client = makeClient(mockData)

    const result = await fetchOngAnimals(client as never)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Yolo')
  })
})

describe('insertOngAnimal', () => {
  it('calls supabase insert with correct data', async () => {
    const client = makeClient([])

    await insertOngAnimal(client as never, {
      name: 'Mila',
      age: 1,
      location: 'Campinas, SP',
      image_url: '',
      bio: 'Brincalhona',
      traits: ['Ativa'],
      is_active: true,
    })

    expect(client.from).toHaveBeenCalledWith('swipe_profiles')
    expect(client._chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Mila', age: 1, is_active: true })
    )
  })

  it('throws when insert returns an error', async () => {
    const client = makeClient([], { message: 'Insert failed' })

    await expect(
      insertOngAnimal(client as never, {
        name: 'X',
        age: 1,
        location: 'SP',
        image_url: '',
        bio: '',
        traits: [],
        is_active: true,
      })
    ).rejects.toThrow('Insert failed')
  })
})
