export type { IChatAdapter, ChatMessage } from './IChatAdapter';
export { SupabaseRealtimeAdapter } from './SupabaseRealtimeAdapter';
export { SocketIOAdapter } from './SocketIOAdapter';

export type ChatAdapterType = 'supabase' | 'socketio';

const DEFAULT_ADAPTER: ChatAdapterType =
  (process.env.EXPO_PUBLIC_CHAT_ADAPTER as ChatAdapterType) ?? 'supabase';

export function createChatAdapter(type: ChatAdapterType = DEFAULT_ADAPTER) {
  if (type === 'socketio') {
    const { SocketIOAdapter } = require('./SocketIOAdapter');
    return new SocketIOAdapter();
  }
  const { SupabaseRealtimeAdapter } = require('./SupabaseRealtimeAdapter');
  return new SupabaseRealtimeAdapter();
}
