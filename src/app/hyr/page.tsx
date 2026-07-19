"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type AuthMode = "login" | "signup";

const authErrorMessage = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email-i ose fjalëkalimi nuk është i saktë.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Konfirmo email-in para se të hysh.";
  }

  if (normalized.includes("password")) {
    return "Fjalëkalimi nuk i plotëson kushtet.";
  }

  return "Diçka nuk shkoi mirë. Provo përsëri.";
};

export default function HyrPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getSafeReturnPath = () => {
    const requestedPath = new URLSearchParams(window.location.search).get(
      "next",
    );

    if (
      !requestedPath ||
      !requestedPath.startsWith("/") ||
      requestedPath.startsWith("//")
    ) {
      return "/kalkulo?mode=full";
    }

    return requestedPath;
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError) {
          setCurrentEmail(null);
          return;
        }

        setCurrentEmail(data.user?.email ?? null);
      } catch {
        setError("Konfigurimi i hyrjes nuk është ende gati.");
      } finally {
        setIsCheckingUser(false);
      }
    };

    void checkUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Fjalëkalimi duhet të ketë së paku 8 karaktere.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const callbackUrl = new URL("/auth/callback", window.location.origin);
        callbackUrl.searchParams.set("next", getSafeReturnPath());

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl.toString(),
          },
        });

        if (signUpError) {
          setError(authErrorMessage(signUpError.message));
          return;
        }

        setMessage("Kontrollo email-in për të konfirmuar llogarinë.");
        setPassword("");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(authErrorMessage(signInError.message));
        return;
      }

      router.push(getSafeReturnPath());
      router.refresh();
    } catch {
      setError("Konfigurimi i hyrjes nuk është ende gati.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentEmail(null);
      router.push("/hyr");
      router.refresh();
    } catch {
      setError("Dalja nuk u krye. Provo përsëri.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6faf7] px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-800 hover:underline"
        >
          ← Kthehu në ballinë
        </Link>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <p className="text-sm font-semibold text-emerald-700">
            Llogaria jote
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Hyr në kalkulator
          </h1>

          {isCheckingUser ? (
            <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">
              Duke kontrolluar sesionin...
            </p>
          ) : currentEmail ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                <p className="font-bold">Je i kyçur</p>
                <p className="break-all">{currentEmail}</p>
              </div>

              {error && (
                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950 ring-1 ring-amber-100">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/kalkulo?mode=full"
                  className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-800"
                >
                  Shko te kalkulatori
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Duke dalë..." : "Dil"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-emerald-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setMessage("");
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    mode === "login"
                      ? "bg-white text-emerald-900 shadow-sm"
                      : "text-emerald-800"
                  }`}
                >
                  Hyr
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setMessage("");
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    mode === "signup"
                      ? "bg-white text-emerald-900 shadow-sm"
                      : "text-emerald-800"
                  }`}
                >
                  Regjistrohu
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Fjalëkalimi
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                  <span className="mt-2 block text-xs leading-5 text-slate-500">
                    Fjalëkalimi duhet të ketë të paktën 8 karaktere
                  </span>
                </label>

                {error && (
                  <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950 ring-1 ring-amber-100">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-950 ring-1 ring-emerald-100">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading
                    ? "Duke u përpunuar..."
                    : mode === "login"
                      ? "Hyr"
                      : "Regjistrohu"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
