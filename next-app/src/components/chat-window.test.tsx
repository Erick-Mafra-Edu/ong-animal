import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ChatWindow } from './chat-window'
import type { ChatMessage } from '@/lib/chat/IChatAdapter'

const mockGetUser = vi.fn()
const mockGetHistory = vi.fn()
const mockConnect = vi.fn()
const mockDisconnect = vi.fn()
const mockOnMessage = vi.fn()
const mockOffMessage = vi.fn()
const mockSendMessage = vi.fn()

vi.mock('@/providers/supabase-provider', () => ({
  useSupabaseClient: () => ({
    auth: { getUser: mockGetUser },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    }),
    removeChannel: vi.fn(),
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  }),
}))

vi.mock('@/lib/chat/SupabaseRealtimeAdapter', () => ({
  SupabaseRealtimeAdapter: vi.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    onMessage: mockOnMessage,
    offMessage: mockOffMessage,
    sendMessage: mockSendMessage,
    getHistory: mockGetHistory,
  })),
}))

vi.mock('@/lib/chat/SocketIOAdapter', () => ({
  SocketIOAdapter: vi.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    onMessage: mockOnMessage,
    offMessage: mockOffMessage,
    sendMessage: mockSendMessage,
    getHistory: mockGetHistory,
  })),
}))

vi.mock('@/lib/chat', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/chat')>()
  return { ...actual, resolveAdapterType: () => 'supabase' }
})

const testMessages: ChatMessage[] = [
  { id: 'msg-1', match_id: 'match-abc', sender_id: 'user-1', content: 'Olá!', created_at: '2024-01-01T10:00:00Z' },
  { id: 'msg-2', match_id: 'match-abc', sender_id: 'user-2', content: 'Oi!', created_at: '2024-01-01T10:01:00Z' },
]

describe('ChatWindow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockGetHistory.mockResolvedValue([])
    mockConnect.mockResolvedValue(undefined)
  })

  it('renders message input and send button', async () => {
    render(<ChatWindow matchId="match-abc" profileName="Rex" profileImage="" initialMessages={[]} />)
    await waitFor(() => {
      expect(screen.getByTestId('message-input')).toBeTruthy()
      expect(screen.getByTestId('send-button')).toBeTruthy()
    })
  })

  it('shows profile name in header', () => {
    render(<ChatWindow matchId="match-abc" profileName="Rex" profileImage="" initialMessages={[]} />)
    expect(screen.getByText('Rex')).toBeTruthy()
  })

  it('renders initial messages', () => {
    render(
      <ChatWindow
        matchId="match-abc"
        profileName="Rex"
        profileImage=""
        initialMessages={testMessages}
      />,
    )
    expect(screen.getByText('Olá!')).toBeTruthy()
    expect(screen.getByText('Oi!')).toBeTruthy()
  })

  it('shows empty state when no messages', async () => {
    render(<ChatWindow matchId="match-abc" profileName="Rex" profileImage="" initialMessages={[]} />)
    await waitFor(() => {
      expect(screen.getByText('Nenhuma mensagem ainda')).toBeTruthy()
    })
  })

  it('calls sendMessage when send button is clicked', async () => {
    mockSendMessage.mockResolvedValue(undefined)
    render(<ChatWindow matchId="match-abc" profileName="Rex" profileImage="" initialMessages={[]} />)

    await waitFor(() => {
      expect(screen.getByTestId('message-input')).toBeTruthy()
    })

    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Oi Rex!' } })
    fireEvent.click(screen.getByTestId('send-button'))

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('match-abc', 'user-1', 'Oi Rex!')
    })
  })

  it('does not send when input is empty', async () => {
    render(<ChatWindow matchId="match-abc" profileName="Rex" profileImage="" initialMessages={[]} />)
    await waitFor(() => {
      expect(screen.getByTestId('send-button')).toBeTruthy()
    })
    fireEvent.click(screen.getByTestId('send-button'))
    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('send button is disabled when input is empty', async () => {
    render(<ChatWindow matchId="match-abc" profileName="Rex" profileImage="" initialMessages={[]} />)
    await waitFor(() => {
      const btn = screen.getByTestId('send-button') as HTMLButtonElement
      expect(btn.disabled).toBe(true)
    })
  })
})
