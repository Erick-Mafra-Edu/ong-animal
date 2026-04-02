export type { IChatAdapter, ChatMessage } from './IChatAdapter';
export { SupabaseRealtimeAdapter } from './SupabaseRealtimeAdapter';
export { SocketIOAdapter } from './SocketIOAdapter';

export type ChatAdapterType = 'supabase' | 'socketio';

const VALID_ADAPTERS: ChatAdapterType[] = ['supabase', 'socketio'];

function resolveAdapterType(): ChatAdapterType {
  const env = process.env.EXPO_PUBLIC_CHAT_ADAPTER;
  if (env && VALID_ADAPTERS.includes(env as ChatAdapterType)) {
    return env as ChatAdapterType;
  }
  return 'supabase';
}

export function createChatAdapter(type: ChatAdapterType = resolveAdapterType()) {
  if (type === 'socketio') {
    const { SocketIOAdapter } = require('./SocketIOAdapter');
    return new SocketIOAdapter();
  }
  const { SupabaseRealtimeAdapter } = require('./SupabaseRealtimeAdapter');
  return new SupabaseRealtimeAdapter();
}
