import Link from 'next/link'
import { SignupForm } from '@/components/signup-form'

export default function CadastroPage() {
  return (
    <main className="min-h-screen px-5 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1280px] gap-6 lg:grid-cols-[1fr_0.92fr]">
        <section className="rounded-[36px] border border-white/80 bg-white/80 p-6 shadow-[0_30px_110px_-45px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md">
            Voltar para a home
          </Link>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Crie sua conta para acompanhar os animais salvos.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Um cadastro rápido, pensado para onboarding simples e com aparência consistente com o restante do app.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ['1', 'Dados básicos'],
              ['2', 'Preferências'],
              ['3', 'Confirmação'],
            ].map(([step, label]) => (
              <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Etapa {step}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_90px_-45px_rgba(15,23,42,0.45)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/65">Cadastro</p>
          <SignupForm />
        </section>
      </div>
    </main>
  )
}