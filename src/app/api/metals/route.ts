import { NextResponse } from "next/server";

const METALS_DEV_URL = "https://api.metals.dev/v1/latest";

type MetalsDevResponse = {
  timestamp?: string;
  updatedAt?: string;
  date?: string;
  metals?: {
    gold?: unknown;
    silver?: unknown;
  };
};

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export async function GET() {
  const apiKey = process.env.METALS_DEV_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      provider: "Metals.Dev",
      updatedAt: null,
      gold24kEurPerGram: null,
      silverEurPerGram: null,
      status: "not_configured",
    });
  }

  const searchParams = new URLSearchParams({
    currency: "EUR",
    unit: "g",
    api_key: apiKey,
  });
  const url = `${METALS_DEV_URL}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({
        provider: "Metals.Dev",
        updatedAt: null,
        gold24kEurPerGram: null,
        silverEurPerGram: null,
        status: "unavailable",
      });
    }

    const data = (await response.json()) as MetalsDevResponse;
    const gold24kEurPerGram = data.metals?.gold;
    const silverEurPerGram = data.metals?.silver;

    if (
      !isPositiveFiniteNumber(gold24kEurPerGram) ||
      !isPositiveFiniteNumber(silverEurPerGram)
    ) {
      return NextResponse.json({
        provider: "Metals.Dev",
        updatedAt: null,
        gold24kEurPerGram: null,
        silverEurPerGram: null,
        status: "unavailable",
      });
    }

    return NextResponse.json({
      provider: "Metals.Dev",
      updatedAt: data.updatedAt ?? data.timestamp ?? data.date ?? null,
      gold24kEurPerGram,
      silverEurPerGram,
      status: "ok",
    });
  } catch {
    return NextResponse.json({
      provider: "Metals.Dev",
      updatedAt: null,
      gold24kEurPerGram: null,
      silverEurPerGram: null,
      status: "unavailable",
    });
  }
}
