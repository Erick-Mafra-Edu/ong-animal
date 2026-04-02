import Link from 'next/link'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen px-5 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1280px] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_30px_110px_-45px_rgba(15,23,42,0.65)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.36),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_32%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/85 backdrop-blur-md">
                Voltar para a apresentação
              </Link>

              <h1 className="mt-6 max-w-lg text-4xl font-black tracking-tight sm:text-5xl">
                Acesso rápido para quem quer adotar sem atrito.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                Uma tela de login com feedback visual forte, estados claros e fluxo que parece real desde o primeiro clique.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['Segurança', 'Token e confirmação'],
                ['Velocidade', 'Entrar em segundos'],
                ['Confiança', 'ONG verificada'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[26px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_90px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-8">
          <LoginForm />
        </section>
      </div>
    </main>
  )
}
