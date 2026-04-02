export interface ChatMessage {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface IChatAdapter {
  connect(matchId: string): Promise<void>
  disconnect(): void
  sendMessage(matchId: string, senderId: string, content: string): Promise<void>
  onMessage(callback: (message: ChatMessage) => void): void
  offMessage(): void
  getHistory(matchId: string): Promise<ChatMessage[]>
}
