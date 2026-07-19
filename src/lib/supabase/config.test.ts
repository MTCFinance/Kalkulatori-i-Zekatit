import { describe, expect, it } from "vitest";
import { hasValidSupabaseEnvironment } from "./config";

describe("hasValidSupabaseEnvironment", () => {
  it("rejects missing and malformed configuration", () => {
    expect(hasValidSupabaseEnvironment(undefined, undefined)).toBe(false);
    expect(hasValidSupabaseEnvironment("project-id", "public-key")).toBe(
      false,
    );
  });

  it("accepts current publishable keys", () => {
    expect(
      hasValidSupabaseEnvironment(
        "https://example.supabase.co",
        "sb_publishable_example",
      ),
    ).toBe(true);
  });

  it("accepts legacy anonymous JWT keys", () => {
    expect(
      hasValidSupabaseEnvironment(
        "https://example.supabase.co",
        "eyJexample",
      ),
    ).toBe(true);
  });
});
