export const hasValidSupabaseEnvironment = (
  supabaseUrl: string | undefined,
  supabasePublishableKey: string | undefined,
) => {
  if (!supabaseUrl || !supabasePublishableKey) {
    return false;
  }

  try {
    const parsedUrl = new URL(supabaseUrl);
    const hasValidUrl =
      (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") &&
      parsedUrl.hostname.length > 0;
    const hasValidKey =
      supabasePublishableKey.startsWith("sb_publishable_") ||
      supabasePublishableKey.startsWith("eyJ");

    return hasValidUrl && hasValidKey;
  } catch {
    return false;
  }
};
