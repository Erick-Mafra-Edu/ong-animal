import React from 'react'

export default function InteressadosPage() {
  return (
    <div className="pb-28 md:pb-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">
        Interessados{' '}
        <span aria-hidden="true">👥</span>
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Acompanhe quem demonstrou interesse nos seus animais.
      </p>

      <div className="mt-12 flex flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white py-16 text-center shadow-[0_8px_30px_-12px_rgba(15,23,42,0.2)]">
        <span className="text-5xl" aria-hidden="true">
          👥
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Nenhum interessado pendente
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Quando alguém demonstrar interesse em seus animais, os pedidos de adoção aparecerão aqui para você aprovar ou recusar.
        </p>
      </div>
    </div>
  )
}
