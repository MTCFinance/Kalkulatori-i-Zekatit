export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6faf7] text-slate-900">
      <header className="border-b border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-lg font-bold text-emerald-800">
              Zekat Calculator
            </p>
            <p className="text-xs text-slate-500">
              Kalkulo zekatin me lehtësi
            </p>
          </div>

          <button className="rounded-xl border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800">
            Hyr / Regjistrohu
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            Kalkulator online i zekatit
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Llogarit zekatin tënd me qartësi dhe besim.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Kalkulo para, ari, argjend, bizhuteri 14K, kripto, biznes,
            bagëti, drithëra dhe bereqete të tokës.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800">
              Llogarit shpejt pa regjistrim
            </button>

            <button className="rounded-xl border border-emerald-700 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50">
              Kalkulim i plotë me raport
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
            <div className="mb-4 text-3xl">💰</div>
            <h2 className="text-lg font-bold">Pasuri financiare</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Para, kursime, ari, argjend, bizhuteri, investime dhe kripto.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
            <div className="mb-4 text-3xl">🐄</div>
            <h2 className="text-lg font-bold">Bagëti dhe bujqësi</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Dele, dhi, lopë, deve, drithëra dhe bereqete me ujitje natyrale ose artificiale.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
            <div className="mb-4 text-3xl">📄</div>
            <h2 className="text-lg font-bold">Raport i ruajtur</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ruaj kalkulimet, regjistro pagesat pjesë-pjesë dhe merr përkujtime vjetore.
            </p>
          </article>
        </div>
      </section>

      <footer className="border-t border-emerald-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-6 text-sm text-slate-500">
          © 2026 Zekat Calculator — Kalkulim i thjeshtuar i zekatit.
        </div>
      </footer>
    </main>
  );
}