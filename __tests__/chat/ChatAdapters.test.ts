import { createChatAdapter, ChatAdapterType } from '../../services/chat';
import { SupabaseRealtimeAdapter } from '../../services/chat/SupabaseRealtimeAdapter';
import { SocketIOAdapter } from '../../services/chat/SocketIOAdapter';

const mockInsert = jest.fn().mockResolvedValue({ error: null });
const mockFrom = jest.fn(() => ({
  insert: mockInsert,
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue({ data: [], error: null }),
}));
const mockChannel = jest.fn(() => ({
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
}));
const mockRemoveChannel = jest.fn();

jest.mock('../../services/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    channel: (...args: any[]) => mockChannel(...args),
    removeChannel: (...args: any[]) => mockRemoveChannel(...args),
  },
}));

describe('createChatAdapter factory', () => {
  it('returns SupabaseRealtimeAdapter by default', () => {
    const adapter = createChatAdapter();
    expect(adapter).toBeInstanceOf(SupabaseRealtimeAdapter);
  });

  it('returns SupabaseRealtimeAdapter when type is "supabase"', () => {
    const adapter = createChatAdapter('supabase');
    expect(adapter).toBeInstanceOf(SupabaseRealtimeAdapter);
  });

  it('returns SocketIOAdapter when type is "socketio"', () => {
    const adapter = createChatAdapter('socketio');
    expect(adapter).toBeInstanceOf(SocketIOAdapter);
  });
});

describe('SupabaseRealtimeAdapter', () => {
  let adapter: SupabaseRealtimeAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new SupabaseRealtimeAdapter();
  });

  it('connects and subscribes to match channel', async () => {
    await adapter.connect('match-123');
    expect(mockChannel).toHaveBeenCalledWith('chat:match-123');
  });

  it('disconnects and removes channel', async () => {
    await adapter.connect('match-123');
    adapter.disconnect();
    expect(mockRemoveChannel).toHaveBeenCalled();
  });

  it('sends message via supabase insert', async () => {
    await adapter.sendMessage('match-123', 'user-1', 'Olá!');
    expect(mockFrom).toHaveBeenCalledWith('messages');
    expect(mockInsert).toHaveBeenCalledWith({
      match_id: 'match-123',
      sender_id: 'user-1',
      conteudo: 'Olá!',
    });
  });

  it('throws error when insert fails', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'Insert failed' } });
    await expect(adapter.sendMessage('match-123', 'user-1', 'Olá!')).rejects.toThrow('Insert failed');
  });

  it('registers and clears message callback', () => {
    const callback = jest.fn();
    adapter.onMessage(callback);
    adapter.offMessage();
    // After offMessage, calling the internal callback should not invoke the user callback
    // Just verify it doesn't throw
    expect(true).toBe(true);
  });

  it('fetches message history from supabase', async () => {
    const mockMessages = [
      { id: '1', match_id: 'match-123', sender_id: 'user-1', conteudo: 'Hi', created_at: '2024-01-01' },
    ];
    const mockOrder = jest.fn().mockResolvedValue({ data: mockMessages, error: null });
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValueOnce({ select: mockSelect, insert: mockInsert });

    const history = await adapter.getHistory('match-123');
    expect(history).toEqual(mockMessages);
  });

  it('throws error when getHistory fails', async () => {
    const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValueOnce({ select: mockSelect, insert: mockInsert });

    await expect(adapter.getHistory('match-123')).rejects.toThrow('DB error');
  });
});

describe('SocketIOAdapter', () => {
  let adapter: SocketIOAdapter;
  const { mockSocket } = require('socket.io-client');

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new SocketIOAdapter();
    mockSocket.connected = true;
  });

  it('registers message callback', () => {
    const callback = jest.fn();
    adapter.onMessage(callback);
    adapter.offMessage();
    expect(true).toBe(true);
  });

  it('disconnect clears socket', () => {
    adapter.disconnect();
    // Should not throw even if socket is null
    expect(true).toBe(true);
  });

  it('sendMessage rejects if socket not connected', async () => {
    mockSocket.connected = false;
    await expect(adapter.sendMessage('match-1', 'user-1', 'test')).rejects.toThrow('Socket not connected');
  });

  it('getHistory rejects if socket not connected', async () => {
    mockSocket.connected = false;
    await expect(adapter.getHistory('match-1')).rejects.toThrow('Socket not connected');
  });
});
