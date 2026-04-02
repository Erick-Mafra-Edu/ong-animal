import Link from 'next/link'
import { FeatureDemo } from '../components/feature-demo'

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 py-5 sm:px-6 lg:px-10">
        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 lg:py-10">
          <div className="relative flex h-full flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              Novo fluxo de adoção
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl xl:text-7xl">
              Adoção com visual editorial, direto ao ponto.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Uma home que parece produto premium: foco total no animal, leitura rápida, ações claras e uma
              experiência pensada para conversão.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.85)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Começar agora
              </Link>
              <a
                href="#demo"
                className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                Ver demo
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Perfis ativos', value: '3' },
                { label: 'Clique simulando', value: 'Real-time' },
                { label: 'Etapas visuais', value: 'Login + Home' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl"
                >
                  <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="demo" className="relative">
            <FeatureDemo />
          </div>
        </section>
      </div>
    </main>
  )
}
