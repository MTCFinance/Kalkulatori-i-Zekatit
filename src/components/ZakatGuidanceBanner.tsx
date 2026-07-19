"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ZakatGuidanceBanner.module.css";

type VerseSlide = {
  title: string;
  arabic: string;
  translation: string;
  reference: string;
};

const slides: VerseSlide[] = [
  {
    title: "Zekati është pjesë e adhurimit",
    arabic:
      "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ",
    translation:
      "Kryeni namazin, jepeni zekatin dhe përuluni me ata që përulen.",
    reference: "Kur’an, El-Bekare 2:43",
  },
  {
    title: "Zekati pastron pasurinë",
    arabic:
      "خُذْ مِنْ أَمْوَٰلِهِمْ صَدَقَةًۭ تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَوٰتَكَ سَكَنٌۭ لَّهُمْ ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ",
    translation:
      "Merr prej pasurisë së tyre sadaka, me të cilën i pastron dhe i begaton.",
    reference: "Kur’an, Et-Teube 9:103",
  },
  {
    title: "Kujt i jepet zekati",
    arabic:
      "إِنَّمَا ٱلصَّدَقَـٰتُ لِلْفُقَرَآءِ وَٱلْمَسَـٰكِينِ وَٱلْعَـٰمِلِينَ عَلَيْهَا وَٱلْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِى ٱلرِّقَابِ وَٱلْغَـٰرِمِينَ وَفِى سَبِيلِ ٱللَّهِ وَٱبْنِ ٱلسَّبِيلِ ۖ فَرِيضَةًۭ مِّنَ ٱللَّهِ ۗ وَٱللَّهُ عَلِيمٌ حَكِيمٌۭ",
    translation:
      "Zekati është për të varfrit, nevojtarët, administruesit e tij, afrimin e zemrave, lirimin nga robëria, borxhlinjtë, në rrugë të Allahut dhe udhëtarin pa mjete.",
    reference: "Kur’an, Et-Teube 9:60",
  },
];

export default function ZakatGuidanceBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 10_000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[active];

  const previous = () => {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  return (
    <section className={styles.banner} aria-label="Ajetet e Kur’anit mbi zekatin">
      <div className={styles.ornament} aria-hidden="true" />

      <div
        key={slide.reference}
        className={styles.dissolveContent}
        aria-live="polite"
      >
        <div className={styles.verseText}>
          <div className={styles.metaRow}>
            <span className={styles.badge}>Ajet Kur’anor</span>
            <span className={styles.reference}>{slide.reference}</span>
          </div>

          <h2>{slide.title}</h2>
          <p>{slide.translation}</p>

          <Link href="/kalkulo?mode=simple" className={styles.actionLink}>
            Fillo kalkulimin <span aria-hidden="true">→</span>
          </Link>
        </div>

        <blockquote lang="ar" dir="rtl" className={styles.arabicText}>
          {slide.arabic}
        </blockquote>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={previous} aria-label="Ajeti i mëparshëm">
          ←
        </button>

        <div className={styles.dots}>
          {slides.map((item, index) => (
            <button
              key={item.reference}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Shfaq ajetin ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
              className={active === index ? styles.activeDot : undefined}
            />
          ))}
        </div>

        <button type="button" onClick={next} aria-label="Ajeti i ardhshëm">
          →
        </button>
      </div>

      <div className={styles.progress} aria-hidden="true" />
    </section>
  );
}
