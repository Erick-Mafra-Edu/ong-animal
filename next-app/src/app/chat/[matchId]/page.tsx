import Link from 'next/link'
import { ChatWindow } from '@/components/chat-window'

export const metadata = {
  title: 'Conversa — ONG Animal',
}

type ChatMatchPageProps = {
  params: Promise<{ matchId: string }>
}

export default async function ChatMatchPage({ params }: ChatMatchPageProps) {
  const { matchId } = await params

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-2xl flex-col px-0 sm:px-6 sm:py-6 lg:px-10">
      <div className="flex-1 overflow-hidden rounded-none bg-white shadow-[0_8px_40px_-16px_rgba(15,23,42,0.15)] sm:rounded-3xl sm:border sm:border-slate-200/60">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-slate-200/60 px-4 py-3">
            <Link
              href="/chat"
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              aria-label="Voltar para conversas"
            >
              ← Voltar
            </Link>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatWindow matchId={matchId} profileName="Conversa" profileImage="" />
          </div>
        </div>
      </div>
    </main>
  )
}
