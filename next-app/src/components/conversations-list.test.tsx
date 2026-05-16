import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ConversationsList } from './conversations-list'
import type { ChatMatch } from '@/lib/supabase/chat-matches'

const mockGetUser = vi.fn()
const mockFetchApprovedMatches = vi.fn()

vi.mock('@/providers/supabase-provider', () => ({
  useSupabaseClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

vi.mock('@/lib/supabase/chat-matches', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/supabase/chat-matches')>()
  return {
    ...actual,
    fetchApprovedMatches: (...args: unknown[]) => mockFetchApprovedMatches(...args),
  }
})

const testMatches: ChatMatch[] = [
  {
    id: 'match-1',
    profile_id: 'yolo',
    user_id: 'user-1',
    status: 'approved',
    created_at: '2024-01-01T10:00:00Z',
    profile_name: 'Yolo',
    profile_image: '',
  },
  {
    id: 'match-2',
    profile_id: 'mila',
    user_id: 'user-1',
    status: 'approved',
    created_at: '2024-01-01T11:00:00Z',
    profile_name: 'Mila',
    profile_image: '',
  },
]

describe('ConversationsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
  })

  it('renders loading state initially', () => {
    mockGetUser.mockReturnValue(new Promise(() => {}))
    render(<ConversationsList />)
    expect(screen.getByText('Carregando conversas...')).toBeTruthy()
  })

  it('renders matches when provided via initialMatches prop', () => {
    render(<ConversationsList initialMatches={testMatches} />)
    expect(screen.getByText('Yolo')).toBeTruthy()
    expect(screen.getByText('Mila')).toBeTruthy()
  })

  it('shows correct count in subtitle', () => {
    render(<ConversationsList initialMatches={testMatches} />)
    expect(screen.getByText('2 conversas ativas')).toBeTruthy()
  })

  it('shows empty state when no matches', async () => {
    mockFetchApprovedMatches.mockResolvedValue([])
    render(<ConversationsList />)
    await waitFor(() => {
      expect(screen.getByText('Nenhuma conversa ainda')).toBeTruthy()
    })
  })

  it('renders fetched matches from Supabase', async () => {
    mockFetchApprovedMatches.mockResolvedValue(testMatches)
    render(<ConversationsList />)
    await waitFor(() => {
      expect(screen.getByTestId('match-match-1')).toBeTruthy()
      expect(screen.getByTestId('match-match-2')).toBeTruthy()
    })
  })

  it('shows fallback matches on fetch error', async () => {
    mockFetchApprovedMatches.mockRejectedValue(new Error('DB error'))
    render(<ConversationsList />)
    await waitFor(() => {
      // Fallback matches include 'Yolo' and 'Mila'
      expect(screen.getByText('Yolo')).toBeTruthy()
    })
  })

  it('shows fallback matches when user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    render(<ConversationsList />)
    await waitFor(() => {
      expect(screen.getByText('Yolo')).toBeTruthy()
    })
  })
})
