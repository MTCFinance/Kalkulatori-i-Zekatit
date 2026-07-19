import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";

const safeRedirectPath = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/kalkulo";
  }

  return value;
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeRedirectPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
