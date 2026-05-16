'use client'

import React from 'react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useSupabaseClient } from '@/providers/supabase-provider'
import { SupabaseRealtimeAdapter } from '@/lib/chat/SupabaseRealtimeAdapter'
import { SocketIOAdapter } from '@/lib/chat/SocketIOAdapter'
import { resolveAdapterType } from '@/lib/chat'
import type { IChatAdapter, ChatMessage } from '@/lib/chat'

type ChatWindowProps = {
  matchId: string
  profileName: string
  profileImage: string
  initialMessages?: ChatMessage[]
}

export function ChatWindow({ matchId, profileName, profileImage, initialMessages = [] }: ChatWindowProps) {
  const supabase = useSupabaseClient()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(initialMessages.length === 0)
  const [sendError, setSendError] = useState<string | null>(null)
  const [connectWarning, setConnectWarning] = useState<string | null>(null)
  const adapterRef = useRef<IChatAdapter | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return

      const currentUserId = user?.id ?? 'demo-user'
      setUserId(currentUserId)

      const adapterType = resolveAdapterType()
      const adapter: IChatAdapter =
        adapterType === 'socketio' ? new SocketIOAdapter() : new SupabaseRealtimeAdapter(supabase)
      adapterRef.current = adapter

      try {
        if (initialMessages.length === 0) {
          const history = await adapter.getHistory(matchId)
          if (!cancelled) setMessages(history)
        }

        adapter.onMessage((msg) => {
          if (!cancelled) {
            setMessages((prev) => {
              if (prev.find((m) => m.id === msg.id)) return prev
              return [...prev, msg]
            })
          }
        })

        await adapter.connect(matchId)
      } catch {
        // Adapter connection failures are non-fatal – REST sends still work.
        // Notify the user that live updates may be unavailable.
        if (!cancelled) setConnectWarning('Atualizações em tempo real indisponíveis. Atualize a página para ver novas mensagens.')
      } finally {
        if (!cancelled) setIsConnecting(false)
      }
    }

    void init()

    return () => {
      cancelled = true
      adapterRef.current?.disconnect()
    }
  }, [matchId, supabase, initialMessages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const content = inputText.trim()
    if (!content || !userId) return

    setInputText('')
    setSendError(null)

    try {
      await adapterRef.current?.sendMessage(matchId, userId, content)
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Falha ao enviar mensagem')
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  return (
    <section className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200/60 bg-white/80 px-5 py-4 backdrop-blur-sm">
        {profileImage ? (
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
            <Image src={profileImage} alt={profileName} fill className="object-cover" />
          </div>
        ) : (
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-lg">
            🐾
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{profileName}</p>
          <p className="text-xs text-slate-500">Match aprovado</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" data-testid="messages-area">
        {isConnecting ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">Carregando conversa...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="text-4xl">👋</span>
            <p className="text-sm font-medium text-slate-600">Nenhuma mensagem ainda</p>
            <p className="text-xs text-slate-400">Diga olá para começar a conversa!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === userId
              return (
                <li
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${msg.id}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isOwn
                        ? 'rounded-br-sm bg-emerald-500 text-white'
                        : 'rounded-bl-sm bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`mt-1 text-right text-[10px] ${
                        isOwn ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {connectWarning ? (
        <p className="px-4 pb-1 text-xs text-amber-600">{connectWarning}</p>
      ) : null}
      {sendError ? (
        <p className="px-4 pb-1 text-xs text-red-500">{sendError}</p>
      ) : null}
      <div className="flex items-end gap-3 border-t border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem... (Enter para enviar)"
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          data-testid="message-input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() || !userId}
          className="shrink-0 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          data-testid="send-button"
        >
          Enviar
        </button>
      </div>
    </section>
  )
}
