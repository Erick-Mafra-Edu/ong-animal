export type { IChatAdapter, ChatMessage } from './IChatAdapter'
export { SupabaseRealtimeAdapter } from './SupabaseRealtimeAdapter'
export { SocketIOAdapter } from './SocketIOAdapter'

export type ChatAdapterType = 'supabase' | 'socketio'

const VALID_ADAPTERS: ChatAdapterType[] = ['supabase', 'socketio']

export function resolveAdapterType(): ChatAdapterType {
  const env = process.env.NEXT_PUBLIC_CHAT_ADAPTER
  if (env && VALID_ADAPTERS.includes(env as ChatAdapterType)) {
    return env as ChatAdapterType
  }
  return 'supabase'
}
