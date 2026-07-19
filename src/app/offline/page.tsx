import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f2e8] px-5 text-[#10263a]">
      <section className="w-full max-w-lg rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-xl">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-800 text-2xl font-bold text-white">
          Z
        </span>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-amber-700">
          Pa lidhje interneti
        </p>
        <h1 className="mt-3 font-serif text-4xl text-emerald-950">
          Aplikacioni është offline
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Kontrollo lidhjen me internetin dhe provo përsëri. Faqet që ke hapur
          më parë mund të jenë ende të disponueshme.
        </p>
        <Link
          href="/kalkulo"
          className="mt-7 inline-flex rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
        >
          Provo përsëri
        </Link>
      </section>
    </main>
  );
}
