import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

type UsageRequest = { mode?: unknown };

export async function POST(request: Request) {
  let body: UsageRequest;

  try {
    body = (await request.json()) as UsageRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.mode !== "simple" && body.mode !== "full") {
    return NextResponse.json(
      { error: "Invalid calculator mode." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("increment_calculator_usage", {
      p_mode: body.mode,
    });

    if (error) {
      return NextResponse.json({ error: "Tracking failed." }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Tracking unavailable." }, { status: 503 });
  }
}
