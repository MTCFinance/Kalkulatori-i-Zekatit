import { createClient as createServiceClient } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

type UsageRow = {
  usage_date: string;
  calculator_mode: "simple" | "full";
  usage_count: number;
};

type UsageTotals = {
  total_count: number;
  today_count: number;
  last_seven_days_count: number;
  simple_count: number;
  full_count: number;
};

export const dynamic = "force-dynamic";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

export default async function StatistikaPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/hyr?next=/statistika");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail || data.user.email?.toLowerCase() !== adminEmail) {
    redirect("/");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return (
      <main className="min-h-screen bg-[#f6faf7] px-5 py-10 text-slate-900">
        <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-amber-200">
          <h1 className="text-2xl font-bold">Statistikat nuk janë konfiguruar</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Shto variablën server-side <code>SUPABASE_SERVICE_ROLE_KEY</code> dhe
            ekzekuto migrimin e statistikave në Supabase.
          </p>
        </section>
      </main>
    );
  }

  const adminClient = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [{ data: rows, error }, { data: totalsRows, error: totalsError }] =
    await Promise.all([
      adminClient
        .from("calculator_usage_daily")
        .select("usage_date,calculator_mode,usage_count")
        .order("usage_date", { ascending: false })
        .limit(180),
      adminClient.rpc("get_calculator_usage_totals"),
    ]);

  if (error || totalsError) {
    throw new Error(
      `Nuk u lexuan statistikat: ${error?.message ?? totalsError?.message}`,
    );
  }

  const usageRows = (rows ?? []) as UsageRow[];
  const totals = ((totalsRows ?? [])[0] ?? {
    total_count: 0,
    today_count: 0,
    last_seven_days_count: 0,
    simple_count: 0,
    full_count: 0,
  }) as UsageTotals;
  const total = Number(totals.total_count);
  const todayTotal = Number(totals.today_count);
  const lastSevenDays = Number(totals.last_seven_days_count);
  const simpleTotal = Number(totals.simple_count);
  const fullTotal = Number(totals.full_count);
  const dailyRows = Array.from(
    usageRows.reduce((days, row) => {
      const current = days.get(row.usage_date) ?? { simple: 0, full: 0 };
      current[row.calculator_mode] += Number(row.usage_count);
      days.set(row.usage_date, current);
      return days;
    }, new Map<string, { simple: number; full: number }>()),
  );

  return (
    <main className="min-h-screen bg-[#f6faf7] px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-semibold text-emerald-800 hover:underline">
          ← Kthehu në ballinë
        </Link>
        <h1 className="mt-5 text-3xl font-black text-slate-950">
          Përdorimi i kalkulatorit
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Numërohet një hapje për sesion; nuk ruhen të dhëna financiare ose adresa IP.
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Sot", todayTotal],
            ["7 ditët e fundit", lastSevenDays],
            ["Gjithsej", total],
          ].map(([label, value]) => (
            <article
              key={String(label)}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100"
            >
              <p className="text-sm font-semibold text-slate-600">{label}</p>
              <p className="mt-2 text-4xl font-black text-emerald-800">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
          <h2 className="text-lg font-bold">Sipas versionit</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <p className="rounded-xl bg-emerald-50 p-4">
              I thjeshtë <strong className="block text-2xl">{simpleTotal}</strong>
            </p>
            <p className="rounded-xl bg-emerald-50 p-4">
              I plotë <strong className="block text-2xl">{fullTotal}</strong>
            </p>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-emerald-100">
          <h2 className="p-5 text-lg font-bold">Përdorimet ditore</h2>
          {dailyRows.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-slate-600">
              Ende nuk ka përdorime të regjistruara.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-emerald-50 text-emerald-950">
                  <tr>
                    <th className="px-5 py-3">Data</th>
                    <th className="px-5 py-3">I thjeshtë</th>
                    <th className="px-5 py-3">I plotë</th>
                    <th className="px-5 py-3">Gjithsej</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRows.map(([date, counts]) => (
                    <tr key={date} className="border-t border-slate-100">
                      <td className="px-5 py-3 font-semibold">{formatDate(date)}</td>
                      <td className="px-5 py-3">{counts.simple}</td>
                      <td className="px-5 py-3">{counts.full}</td>
                      <td className="px-5 py-3 font-bold">
                        {counts.simple + counts.full}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
