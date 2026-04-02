import { ConversationsList } from '@/components/conversations-list'

export const metadata = {
  title: 'Chat — ONG Animal',
  description: 'Suas conversas com os animais que você curtiu.',
}

export default function ChatPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-2xl flex-col px-0 sm:px-6 sm:py-6 lg:px-10">
      <div className="flex-1 overflow-hidden rounded-none bg-white shadow-[0_8px_40px_-16px_rgba(15,23,42,0.15)] sm:rounded-3xl sm:border sm:border-slate-200/60">
        <ConversationsList />
      </div>
    </main>
  )
}
