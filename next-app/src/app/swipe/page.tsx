import { SwipeBoard } from '@/components/swipe-board'

export default function SwipePage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-0 py-0 text-slate-900 sm:px-6 sm:py-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_55%,_#f8fafc_100%)]" />
      <div className="pointer-events-none absolute left-[-5rem] top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-[-6rem] top-44 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="relative">
        <SwipeBoard />
      </div>
    </main>
  )
}
