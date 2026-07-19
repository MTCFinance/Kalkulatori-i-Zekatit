"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type InstallChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

export default function InstallPage() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const navigatorWithStandalone = navigator as Navigator & {
      standalone?: boolean;
    };
    const detectDevice = window.setTimeout(() => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        navigatorWithStandalone.standalone === true;

      setIsInstalled(standalone);
      setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    }, 0);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setMessage("Aplikacioni u instalua me sukses.");
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(detectDevice);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setMessage("Instalimi filloi. Ndiq udhëzimet e telefonit.");
    } else {
      setMessage("Instalimi u anulua. Mund ta provosh përsëri.");
    }

    setInstallPrompt(null);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span aria-hidden="true">Z</span>
          <strong>Zekat</strong>
        </Link>
        <Link href="/kalkulo" className={styles.webLink}>
          Versioni web
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Versioni për telefon</p>
          <h1>Mbaje kalkulatorin e zekatit në ekranin kryesor.</h1>
          <p className={styles.description}>
            Instaloje si aplikacion në telefon pa shkarkuar një paketë të
            veçantë. Merr pamje të përshtatur, hapje të shpejtë dhe qasje bazë
            edhe kur lidhja ndërpritet.
          </p>

          {isInstalled ? (
            <div className={styles.installedState}>
              <span aria-hidden="true">✓</span>
              Aplikacioni është instaluar në këtë pajisje.
            </div>
          ) : installPrompt ? (
            <button type="button" onClick={installApp} className={styles.installButton}>
              Instalo aplikacionin
              <span aria-hidden="true">↓</span>
            </button>
          ) : (
            <div className={styles.manualState}>
              {isIos
                ? "Në Safari: shtyp Share dhe pastaj Add to Home Screen."
                : "Hap menunë e shfletuesit dhe zgjidh Install app ose Add to Home Screen."}
            </div>
          )}

          {message && <p className={styles.message}>{message}</p>}
        </div>

        <div className={styles.phoneStage} aria-label="Pamje e aplikacionit në telefon">
          <div className={styles.phone}>
            <div className={styles.phoneBar} />
            <div className={styles.phoneScreen}>
              <div className={styles.mobileBrand}>
                <span>Z</span>
                <strong>Zekat</strong>
              </div>
              <p>Rezultati i drejtpërdrejtë</p>
              <h2>Kalkulatori i zekatit</h2>
              <div className={styles.mobileCard}>
                <span>Pasuria neto</span>
                <strong>€ 0.00</strong>
              </div>
              <div className={styles.mobileResult}>
                <span>Zekati i llogaritur</span>
                <strong>€ 0.00</strong>
              </div>
              <Link href="/kalkulo">Fillo kalkulimin</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.steps}>
        <div>
          <span>01</span>
          <h2>Hape në telefon</h2>
          <p>Vizito faqen me Chrome, Edge ose Safari.</p>
        </div>
        <div>
          <span>02</span>
          <h2>Instaloje</h2>
          <p>Përdor butonin e instalimit ose menunë e shfletuesit.</p>
        </div>
        <div>
          <span>03</span>
          <h2>Përdore si aplikacion</h2>
          <p>Hape nga ikona Zekat në ekranin kryesor.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        Përgatitur nga <strong>Besnik Kaleci</strong>
      </footer>
    </main>
  );
}
