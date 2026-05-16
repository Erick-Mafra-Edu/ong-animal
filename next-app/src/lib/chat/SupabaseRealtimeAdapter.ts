import type { SupabaseClient } from '@supabase/supabase-js'
import type { IChatAdapter, ChatMessage } from './IChatAdapter'

export class SupabaseRealtimeAdapter implements IChatAdapter {
  private channel: ReturnType<SupabaseClient['channel']> | null = null
  private messageCallback: ((message: ChatMessage) => void) | null = null
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  async connect(matchId: string): Promise<void> {
    this.channel = this.supabase
      .channel(`chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          if (this.messageCallback) {
            this.messageCallback(payload.new as ChatMessage)
          }
        },
      )
      .subscribe()
  }

  disconnect(): void {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
    this.messageCallback = null
  }

  async sendMessage(matchId: string, senderId: string, content: string): Promise<void> {
    const { error } = await this.supabase.from('chat_messages').insert({
      match_id: matchId,
      sender_id: senderId,
      content,
    })
    if (error) throw new Error(error.message)
  }

  onMessage(callback: (message: ChatMessage) => void): void {
    this.messageCallback = callback
  }

  offMessage(): void {
    this.messageCallback = null
  }

  async getHistory(matchId: string): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []) as ChatMessage[]
  }
}
