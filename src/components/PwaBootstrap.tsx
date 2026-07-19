"use client";

import { useEffect } from "react";

export default function PwaBootstrap() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      const clearDevelopmentCaches = async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );

        if ("caches" in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(
            cacheKeys
              .filter((key) => key.startsWith("zakat-shell-"))
              .map((key) => window.caches.delete(key)),
          );
        }
      };

      void clearDevelopmentCaches();
      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // The website remains usable when service workers are unavailable.
      }
    };

    void registerServiceWorker();
  }, []);

  return null;
}
