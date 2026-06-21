"use client";

import { useEffect, useState } from "react";

type Slide = {
  kind: "Ajet" | "Hadith";
  title: string;
  arabic?: string;
  translation: string;
  reference: string;
};

const slides: Slide[] = [
  {
    kind: "Ajet",
    title: "Zekati është pjesë e adhurimit",
    arabic:
      "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ",
    translation:
      "Kryeni namazin, jepeni zekatin dhe përuluni me ata që përulen.",
    reference: "Kur’an, El-Bekare 2:43",
  },
  {
    kind: "Ajet",
    title: "Zekati pastron pasurinë",
    arabic:
      "خُذْ مِنْ أَمْوَٰلِهِمْ صَدَقَةًۭ تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَوٰتَكَ سَكَنٌۭ لَّهُمْ ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ",
    translation:
      "Merr prej pasurisë së tyre sadaka, me të cilën i pastron dhe i begaton.",
    reference: "Kur’an, Et-Teube 9:103",
  },
  {
    kind: "Ajet",
    title: "Kujt i jepet zekati",
    arabic:
      "إِنَّمَا ٱلصَّدَقَـٰتُ لِلْفُقَرَآءِ وَٱلْمَسَـٰكِينِ وَٱلْعَـٰمِلِينَ عَلَيْهَا وَٱلْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِى ٱلرِّقَابِ وَٱلْغَـٰرِمِينَ وَفِى سَبِيلِ ٱللَّهِ وَٱبْنِ ٱلسَّبِيلِ ۖ فَرِيضَةًۭ مِّنَ ٱللَّهِ ۗ وَٱللَّهُ عَلِيمٌ حَكِيمٌ",
    translation:
      "Zekati është për të varfrit, nevojtarët, administruesit e tij, afrimin e zemrave, lirimin nga robëria, borxhlinjtë, në rrugë të Allahut dhe udhëtarin pa mjete.",
    reference: "Kur’an, Et-Teube 9:60",
  },
  {
    kind: "Hadith",
    title: "Një prej shtyllave të Islamit",
    translation:
      "Islami është ndërtuar mbi pesë shtylla, ndër to edhe dhënia e zekatit.",
    reference: "Sahih Buhari, 8",
  },
  {
    kind: "Hadith",
    title: "Nga të pasurit te nevojtarët",
    translation:
      "Zekati merret nga të pasurit dhe u jepet të varfërve.",
    reference: "Sahih Buhari, 1395",
  },
];

export default function ZakatGuidanceBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 10_000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[active];

  const previous = () => {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className="mx-auto mt-5 max-w-6xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white md:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
            {slide.kind}
          </span>

          <span className="text-xs text-emerald-100">
            Ndërron çdo 10 sekonda
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-bold md:text-3xl">
          {slide.title}
        </h2>

        {slide.arabic && (
          <blockquote
            lang="ar"
            dir="rtl"
            className="mt-5 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-right font-serif text-2xl leading-[2.1] md:text-3xl"
          >
            {slide.arabic}
          </blockquote>
        )}

        <p className="mt-4 max-w-3xl text-base leading-7 text-emerald-50 md:text-lg">
          {slide.translation}
        </p>

        <p className="mt-4 text-sm font-semibold text-emerald-100">
          {slide.reference}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/#udhezime-zekati"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
          >
            Shih udhëzimet
          </a>

          <button
            type="button"
            onClick={previous}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-lg transition hover:bg-white/10"
            aria-label="Përmbajtja e mëparshme"
          >
            ←
          </button>

          <div className="flex gap-2">
            {slides.map((item, index) => (
              <button
                key={item.reference}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Shfaq përmbajtjen ${index + 1}`}
                className={`h-2.5 rounded-full transition ${
                  active === index
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-lg transition hover:bg-white/10"
            aria-label="Përmbajtja e ardhshme"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}