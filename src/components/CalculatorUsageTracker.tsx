"use client";

import { useEffect } from "react";

type CalculatorUsageTrackerProps = {
  mode: "simple" | "full";
};

export default function CalculatorUsageTracker({
  mode,
}: CalculatorUsageTrackerProps) {
  useEffect(() => {
    const storageKey = `zakat-calculator:usage-counted:${mode}`;

    try {
      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }

      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Tracking is best-effort when browser storage is unavailable.
    }

    void fetch("/api/usage", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode }),
      keepalive: true,
    });
  }, [mode]);

  return null;
}
