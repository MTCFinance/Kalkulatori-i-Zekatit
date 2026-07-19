import { NextResponse } from "next/server";

const FRANKFURTER_URL =
  "https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD,CHF,GBP,ALL,MKD,RSD,TRY,SEK,NOK,DKK,AED,SAR,CAD,AUD";
const FRANKFURTER_COMPAT_URL =
  "https://api.frankfurter.app/latest?from=EUR&to=USD,CHF,GBP,ALL,MKD,RSD,TRY,SEK,NOK,DKK,AED,SAR,CAD,AUD";

type FrankfurterResponse = {
  date?: string;
  rates?: unknown;
};

const supportedCurrencies = new Set([
  "USD",
  "CHF",
  "GBP",
  "ALL",
  "MKD",
  "RSD",
  "TRY",
  "SEK",
  "NOK",
  "DKK",
  "AED",
  "SAR",
  "CAD",
  "AUD",
]);

const collectRates = (value: unknown, rates: Record<string, number>) => {
  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (supportedCurrencies.has(key) && typeof child === "number") {
      rates[key] = child;
      continue;
    }

    collectRates(child, rates);
  }
};

const latestRates = (rates: FrankfurterResponse["rates"]) => {
  if (!rates) {
    return { updatedAt: "", rates: {} as Record<string, number> };
  }

  const directRates: Record<string, number> = {};
  collectRates(rates, directRates);

  if (Object.keys(directRates).length > 0) {
    return { updatedAt: "", rates: directRates };
  }

  const datedRates = Object.entries(rates)
    .filter((entry): entry is [string, Record<string, number>] => {
      return typeof entry[1] === "object" && entry[1] !== null;
    })
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate));
  const [updatedAt = "", latest = {}] = datedRates.at(-1) ?? [];

  return { updatedAt, rates: latest };
};

const fetchFrankfurterRates = async (url: string) => {
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as FrankfurterResponse;
  const latest = latestRates(data.rates);

  if (Object.keys(latest.rates).length === 0) {
    return null;
  }

  return { data, latest };
};

export async function GET() {
  const result =
    (await fetchFrankfurterRates(FRANKFURTER_URL)) ??
    (await fetchFrankfurterRates(FRANKFURTER_COMPAT_URL));

  if (!result) {
    return NextResponse.json(
      { error: "Could not fetch exchange rates" },
      { status: 502 },
    );
  }

  const ratesToEur: Record<string, number> = { EUR: 1 };

  for (const [currency, eurToCurrency] of Object.entries(result.latest.rates)) {
    if (Number.isFinite(eurToCurrency) && eurToCurrency > 0) {
      ratesToEur[currency] = 1 / eurToCurrency;
    }
  }

  return NextResponse.json({
    updatedAt:
      result.data.date ?? result.latest.updatedAt ?? new Date().toISOString(),
    provider: "Frankfurter",
    ratesToEur,
  });
}
