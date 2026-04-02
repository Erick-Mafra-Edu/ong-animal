import Link from 'next/link'

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
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Login</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Entre para acompanhar seus favoritos.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A interface abaixo foi desenhada para parecer um fluxo de produção, com campos, ações e estados visuais coerentes.
            </p>
          </div>

          <form className="mt-8 space-y-4 max-w-lg">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">E-mail</span>
              <input
                type="email"
                placeholder="voce@onganimal.org"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Senha</span>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Manter acesso
              </label>
              <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="button"
              className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Entrar agora
            </button>

            <button
              type="button"
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Continuar com Google
            </button>

            <Link
              href="/cadastro"
              className="block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Ainda não tenho conta
            </Link>
          </form>

          <div className="mt-8 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Status simulado</p>
            <p className="mt-2 text-sm leading-7 text-emerald-900">
              Depois do login, o usuário veria uma lista com perfis salvos, alertas de match e acesso ao fluxo de adoção.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
