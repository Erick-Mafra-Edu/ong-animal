import { describe, expect, it, vi, beforeEach } from 'vitest'
import { SupabaseRealtimeAdapter } from '@/lib/chat/SupabaseRealtimeAdapter'
import { SocketIOAdapter } from '@/lib/chat/SocketIOAdapter'
import { resolveAdapterType } from '@/lib/chat'
import type { SupabaseClient } from '@supabase/supabase-js'

// ─── SupabaseRealtimeAdapter ─────────────────────────────────────────────────

function makeMockSupabase(overrides: Record<string, unknown> = {}) {
  const channel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  }
  const insert = vi.fn().mockResolvedValue({ error: null })
  const order = vi.fn().mockResolvedValue({ data: [], error: null })
  const eq = vi.fn().mockReturnValue({ order })
  const select = vi.fn().mockReturnValue({ eq })
  const from = vi.fn().mockReturnValue({ select, insert })

  return {
    channel: vi.fn().mockReturnValue(channel),
    removeChannel: vi.fn(),
    from,
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    _mocks: { channel, insert, order, eq, select, from },
    ...overrides,
  } as unknown as SupabaseClient & { _mocks: Record<string, ReturnType<typeof vi.fn>> }
}

describe('SupabaseRealtimeAdapter', () => {
  it('subscribes to correct channel on connect', async () => {
    const supabase = makeMockSupabase()
    const adapter = new SupabaseRealtimeAdapter(supabase)
    await adapter.connect('match-1')
    expect(supabase.channel).toHaveBeenCalledWith('chat:match-1')
  })

  it('removes channel on disconnect', async () => {
    const supabase = makeMockSupabase()
    const adapter = new SupabaseRealtimeAdapter(supabase)
    await adapter.connect('match-1')
    adapter.disconnect()
    expect(supabase.removeChannel).toHaveBeenCalled()
  })

  it('inserts message via supabase', async () => {
    const supabase = makeMockSupabase()
    const adapter = new SupabaseRealtimeAdapter(supabase)
    await adapter.sendMessage('match-1', 'user-1', 'Olá!')
    expect(supabase.from).toHaveBeenCalledWith('chat_messages')
    expect((supabase as any)._mocks.insert).toHaveBeenCalledWith({
      match_id: 'match-1',
      sender_id: 'user-1',
      content: 'Olá!',
    })
  })

  it('throws when insert returns error', async () => {
    const order = vi.fn().mockResolvedValue({ data: [], error: null })
    const eq = vi.fn().mockReturnValue({ order })
    const select = vi.fn().mockReturnValue({ eq })
    const insert = vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } })
    const from = vi.fn().mockReturnValue({ select, insert })
    const supabase = makeMockSupabase({ from })
    const adapter = new SupabaseRealtimeAdapter(supabase)
    await expect(adapter.sendMessage('m', 'u', 'hi')).rejects.toThrow('Insert failed')
  })

  it('returns message history', async () => {
    const msgs = [{ id: '1', match_id: 'm', sender_id: 'u', content: 'hi', created_at: '' }]
    const order = vi.fn().mockResolvedValue({ data: msgs, error: null })
    const eq = vi.fn().mockReturnValue({ order })
    const select = vi.fn().mockReturnValue({ eq })
    const insert = vi.fn()
    const from = vi.fn().mockReturnValue({ select, insert })
    const supabase = makeMockSupabase({ from })
    const adapter = new SupabaseRealtimeAdapter(supabase)
    const history = await adapter.getHistory('m')
    expect(history).toEqual(msgs)
  })

  it('throws when getHistory returns error', async () => {
    const order = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
    const eq = vi.fn().mockReturnValue({ order })
    const select = vi.fn().mockReturnValue({ eq })
    const from = vi.fn().mockReturnValue({ select, insert: vi.fn() })
    const supabase = makeMockSupabase({ from })
    const adapter = new SupabaseRealtimeAdapter(supabase)
    await expect(adapter.getHistory('m')).rejects.toThrow('DB error')
  })

  it('registers and clears message callback', () => {
    const supabase = makeMockSupabase()
    const adapter = new SupabaseRealtimeAdapter(supabase)
    const cb = vi.fn()
    adapter.onMessage(cb)
    adapter.offMessage()
    // Just verifies no throws
    expect(true).toBe(true)
  })
})

// ─── SocketIOAdapter ──────────────────────────────────────────────────────────

describe('SocketIOAdapter', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('rejects connect when NEXT_PUBLIC_SOCKET_IO_URL is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SOCKET_IO_URL', '')
    const adapter = new SocketIOAdapter()
    await expect(adapter.connect('m')).rejects.toThrow('Socket.IO URL not configured')
  })

  it('rejects sendMessage when socket not connected', async () => {
    const adapter = new SocketIOAdapter()
    await expect(adapter.sendMessage('m', 'u', 'hi')).rejects.toThrow('Socket not connected')
  })

  it('rejects getHistory when socket not connected', async () => {
    const adapter = new SocketIOAdapter()
    await expect(adapter.getHistory('m')).rejects.toThrow('Socket not connected')
  })

  it('registers and clears message callback without throwing', () => {
    const adapter = new SocketIOAdapter()
    adapter.onMessage(vi.fn())
    adapter.offMessage()
    expect(true).toBe(true)
  })

  it('disconnect does not throw when socket is null', () => {
    const adapter = new SocketIOAdapter()
    expect(() => adapter.disconnect()).not.toThrow()
  })
})

// ─── resolveAdapterType ───────────────────────────────────────────────────────

describe('resolveAdapterType', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('defaults to supabase when env is not set', () => {
    expect(resolveAdapterType()).toBe('supabase')
  })

  it('returns supabase when env is "supabase"', () => {
    vi.stubEnv('NEXT_PUBLIC_CHAT_ADAPTER', 'supabase')
    expect(resolveAdapterType()).toBe('supabase')
  })

  it('returns socketio when env is "socketio"', () => {
    vi.stubEnv('NEXT_PUBLIC_CHAT_ADAPTER', 'socketio')
    expect(resolveAdapterType()).toBe('socketio')
  })

  it('falls back to supabase for invalid env values', () => {
    vi.stubEnv('NEXT_PUBLIC_CHAT_ADAPTER', 'invalid-value')
    expect(resolveAdapterType()).toBe('supabase')
  })
})
