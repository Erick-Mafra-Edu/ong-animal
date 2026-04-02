import { supabase } from '../supabase';
import { IChatAdapter, ChatMessage } from './IChatAdapter';

export class SupabaseRealtimeAdapter implements IChatAdapter {
  private channel: ReturnType<typeof supabase.channel> | null = null;
  private messageCallback: ((message: ChatMessage) => void) | null = null;

  async connect(matchId: string): Promise<void> {
    this.channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          if (this.messageCallback) {
            this.messageCallback(payload.new as ChatMessage);
          }
        }
      )
      .subscribe();
  }

  disconnect(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.messageCallback = null;
  }

  async sendMessage(matchId: string, senderId: string, conteudo: string): Promise<void> {
    const { error } = await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: senderId,
      conteudo,
    });
    if (error) throw new Error(error.message);
  }

  onMessage(callback: (message: ChatMessage) => void): void {
    this.messageCallback = callback;
  }

  offMessage(): void {
    this.messageCallback = null;
  }

  async getHistory(matchId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as ChatMessage[];
  }
}
