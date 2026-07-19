import Link from "next/link";
import ZakatGuidanceBanner from "../components/ZakatGuidanceBanner";
import styles from "./page.module.css";

const features = [
  {
    number: "01",
    title: "Pasuri financiare",
    description:
      "Para, kursime, ari, argjend, stoli, investime, valuta dhe kripto.",
  },
  {
    number: "02",
    title: "Biznes dhe tregti",
    description:
      "Inventar tregtar, detyrime afatshkurtra dhe pasuri të tjera të biznesit.",
  },
  {
    number: "03",
    title: "Bagëti dhe bujqësi",
    description:
      "Dele, dhi, lopë, deve, drithëra dhe bereqete sipas metodës së ujitjes.",
  },
  {
    number: "04",
    title: "Raport i qartë",
    description:
      "Përmbledhje e plotë, ruajtje e kalkulimit dhe planifikim i pagesës.",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.pageGlow} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="Zekat - Ballina">
            <span className={styles.brandMark} aria-hidden="true">
              Z
            </span>
            <span>
              <strong>Zekat</strong>
              <small>Kalkulator i besueshëm</small>
            </span>
          </Link>

          <nav className={styles.navigation} aria-label="Navigimi kryesor">
            <a href="#si-funksionon">Si funksionon</a>
            <a href="#udhezime-zekati">Ajetet e Kur’anit</a>
            <Link href="/instalo">Për telefon</Link>
            <Link href="/kalkulo?mode=full" className={styles.loginLink}>
              Kalkulim i plotë
            </Link>
          </nav>
        </div>
      </header>

      <section id="udhezime-zekati" className={styles.topBanner}>
        <ZakatGuidanceBanner />
      </section>

      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true">✓</span>
              I besueshëm. I qartë. Hap pas hapi.
            </p>

            <h1>
              Llogarite zekatin me <em>qartësi</em> dhe besim.
            </h1>

            <p className={styles.heroDescription}>
              Një kalkulator i plotë që të udhëheq nga pasuria e pranueshme
              deri te raporti përfundimtar, me metodologji të qartë dhe burime
              të verifikueshme.
            </p>

            <div className={styles.heroActions}>
              <Link href="/kalkulo?mode=simple" className={styles.primaryAction}>
                Kalkulim i thjeshtë
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/kalkulo?mode=full" className={styles.secondaryAction}>
                Kalkulim i plotë
              </Link>
            </div>

            <div className={styles.trustStrip}>
              <div>
                <strong>Pa pagesë</strong>
                <span>Përdorim i lirë</span>
              </div>
              <div>
                <strong>Privat</strong>
                <span>Të dhënat në pajisje</span>
              </div>
              <div>
                <strong>I plotë</strong>
                <span>Raport i detajuar</span>
              </div>
            </div>
          </div>

          <div className={styles.previewWrap}>
            <div className={styles.previewAccent} aria-hidden="true" />
            <article className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div>
                  <p>Rezultat i drejtpërdrejtë</p>
                  <h2>Kalkulatori i zekatit</h2>
                </div>
                <span>EUR</span>
              </div>

              <div className={styles.previewBody}>
                <p className={styles.previewLabel}>Pragu i nisabit</p>
                <div className={styles.segmentedControl}>
                  <strong>Ar · 85 g</strong>
                  <span>Argjend · 595 g</span>
                  <span>Manual</span>
                </div>

                <div className={styles.previewColumns}>
                  <div>
                    <span>Pasuria e pranueshme</span>
                    <strong>€ 0.00</strong>
                  </div>
                  <div>
                    <span>Detyrimet e zbritshme</span>
                    <strong>€ 0.00</strong>
                  </div>
                </div>

                <div className={styles.resultPreview}>
                  <span>Zekati i llogaritur</span>
                  <strong>€ 0.00</strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.platformChoice} aria-labelledby="platform-title">
        <div className={styles.platformHeading}>
          <p>Zgjidh mënyrën e përdorimit</p>
          <h2 id="platform-title">Një kalkulator, dy mënyra përdorimi.</h2>
        </div>

        <div className={styles.platformGrid}>
          <Link href="/kalkulo?mode=simple" className={styles.platformCard}>
            <span className={styles.platformNumber}>01</span>
            <div>
              <p>Kalkulim i thjeshtë</p>
              <h3>Para, ar dhe stoli</h3>
              <small>
                Hape pa login dhe llogarit kategoritë bazë.
              </small>
            </div>
            <strong aria-hidden="true">→</strong>
          </Link>

          <Link
            href="/instalo"
            className={`${styles.platformCard} ${styles.platformCardMobile}`}
          >
            <span className={styles.platformNumber}>02</span>
            <div>
              <p>Versioni për telefon</p>
              <h3>Instaloje si aplikacion</h3>
              <small>
                Shtoje në ekranin kryesor dhe hape si aplikacion të pavarur.
              </small>
            </div>
            <strong aria-hidden="true">↓</strong>
          </Link>
        </div>
      </section>

      <section id="si-funksionon" className={styles.featuresSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p>Një proces i organizuar</p>
            <h2>Gjithçka që të duhet për një llogaritje të kujdesshme</h2>
          </div>
          <p>
            Plotëso vetëm kategoritë që të përkasin. Kalkulatori përmbledh
            vlerat dhe të tregon qartë çfarë është përfshirë.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature.number} className={styles.featureCard}>
              <span>{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <p>Gati për të filluar?</p>
          <h2>Llogarite zekatin tënd me qartësi.</h2>
        </div>
        <Link href="/kalkulo?mode=simple">
          Hap kalkulatorin <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.footerBrand}>
          <span aria-hidden="true">Z</span>
          Zekat
        </Link>
        <p>© 2026 Zekat — Kalkulim i kujdesshëm dhe i qartë.</p>
        <small>
          Përgatitur nga <strong>Besnik Kaleci</strong>
        </small>
      </footer>
    </main>
  );
}
