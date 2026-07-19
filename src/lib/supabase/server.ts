import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasValidSupabaseEnvironment } from "./config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const assertSupabaseEnvironment = () => {
  if (!hasValidSupabaseEnvironment(supabaseUrl, supabasePublishableKey)) {
    throw new Error("Supabase environment variables are not configured.");
  }
};

export const createClient = async () => {
  assertSupabaseEnvironment();

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabasePublishableKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components may not be allowed to set cookies.
        }
      },
    },
  });
};
