import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasValidSupabaseEnvironment } from "./config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const isProtectedCalculatorRequest = (request: NextRequest) =>
  request.nextUrl.pathname.startsWith("/kalkulo/") ||
  (request.nextUrl.pathname === "/kalkulo" &&
    request.nextUrl.searchParams.get("mode") === "full");

const redirectToLogin = (request: NextRequest) => {
  const loginUrl = request.nextUrl.clone();
  const returnPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.pathname = "/hyr";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", returnPath);

  return NextResponse.redirect(loginUrl);
};

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasValidSupabaseEnvironment(supabaseUrl, supabasePublishableKey)) {
    // Authentication remains optional until valid Supabase credentials exist.
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl!, supabasePublishableKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  if (
    isProtectedCalculatorRequest(request) &&
    !data?.claims?.sub
  ) {
    const loginResponse = redirectToLogin(request);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      loginResponse.cookies.set(cookie);
    });

    return loginResponse;
  }

  return supabaseResponse;
};
