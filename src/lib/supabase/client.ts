import { createBrowserClient } from "@supabase/ssr";
import { hasValidSupabaseEnvironment } from "./config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const assertSupabaseEnvironment = () => {
  if (!hasValidSupabaseEnvironment(supabaseUrl, supabasePublishableKey)) {
    throw new Error("Supabase environment variables are not configured.");
  }
};

export const createClient = () => {
  assertSupabaseEnvironment();

  return createBrowserClient(supabaseUrl!, supabasePublishableKey!);
};
