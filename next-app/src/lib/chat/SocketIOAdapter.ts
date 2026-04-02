import { io, type Socket } from 'socket.io-client'
import type { IChatAdapter, ChatMessage } from './IChatAdapter'

export class SocketIOAdapter implements IChatAdapter {
  private socket: Socket | null = null
  private messageCallback: ((message: ChatMessage) => void) | null = null

  async connect(matchId: string): Promise<void> {
    const url = process.env.NEXT_PUBLIC_SOCKET_IO_URL ?? ''
    if (!url) {
      throw new Error(
        'Socket.IO URL not configured. Set NEXT_PUBLIC_SOCKET_IO_URL in your environment.',
      )
    }

    return new Promise((resolve, reject) => {
      this.socket = io(url, { query: { matchId }, transports: ['websocket'] })

      this.socket.on('connect', () => {
        this.socket?.emit('join_room', matchId)
        resolve()
      })

      this.socket.on('connect_error', (err) => reject(err))

      this.socket.on('new_message', (message: ChatMessage) => {
        if (this.messageCallback) this.messageCallback(message)
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.messageCallback = null
  }

  async sendMessage(matchId: string, senderId: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'))
        return
      }
      this.socket.emit(
        'send_message',
        { match_id: matchId, sender_id: senderId, content },
        (ack: { error?: string }) => {
          if (ack?.error) reject(new Error(ack.error))
          else resolve()
        },
      )
    })
  }

  onMessage(callback: (message: ChatMessage) => void): void {
    this.messageCallback = callback
  }

  offMessage(): void {
    this.messageCallback = null
  }

  async getHistory(matchId: string): Promise<ChatMessage[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'))
        return
      }
      this.socket.emit(
        'get_history',
        { match_id: matchId },
        (messages: ChatMessage[] | { error: string } | undefined | null) => {
          if (!messages) {
            resolve([])
            return
          }
          if (!Array.isArray(messages) && messages?.error) {
            reject(new Error(messages.error))
          } else {
            resolve(Array.isArray(messages) ? messages : [])
          }
        },
      )
    })
  }
}
