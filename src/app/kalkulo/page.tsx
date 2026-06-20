"use client";

import Link from "next/link";
import { useState } from "react";

const toNumber = (value: string) => {
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) ? number : 0;
};

const money = (value: number, currency: string) =>
  `${value.toFixed(2)} ${currency}`;

export default function KalkuloPage() {
  const [currency, setCurrency] = useState("EUR");

  const [hasMoney, setHasMoney] = useState(true);
  const [hasGold, setHasGold] = useState(false);
  const [hasSilver, setHasSilver] = useState(false);

  const [nisab, setNisab] = useState("");
  const [cash, setCash] = useState("");
  const [bank, setBank] = useState("");
  const [savings, setSavings] = useState("");
  const [receivables, setReceivables] = useState("");
  const [debts, setDebts] = useState("");

  const [goldPrice, setGoldPrice] = useState("");
  const [goldType, setGoldType] = useState("investment");
const [jewelryRule, setJewelryRule] = useState("include");
  const [gold24, setGold24] = useState("");
  const [gold22, setGold22] = useState("");
  const [gold21, setGold21] = useState("");
  const [gold18, setGold18] = useState("");
  const [gold14, setGold14] = useState("");

  const [silverGrams, setSilverGrams] = useState("");
  const [silverPrice, setSilverPrice] = useState("");

  const moneyTotal = hasMoney
    ? toNumber(cash) +
      toNumber(bank) +
      toNumber(savings) +
      toNumber(receivables)
    : 0;

  const goldPureGrams = hasGold
    ? toNumber(gold24) +
      (toNumber(gold22) * 22) / 24 +
      (toNumber(gold21) * 21) / 24 +
      (toNumber(gold18) * 18) / 24 +
      (toNumber(gold14) * 14) / 24
    : 0;

  const goldValue = goldPureGrams * toNumber(goldPrice);

  const silverValue = hasSilver
    ? toNumber(silverGrams) * toNumber(silverPrice)
    : 0;

  const totalAssets = moneyTotal + goldValue + silverValue;
  const netAssets = Math.max(totalAssets - toNumber(debts), 0);

  const nisabValue = toNumber(nisab);
  const reachedNisab = nisabValue > 0 && netAssets >= nisabValue;
  const zakat = reachedNisab ? netAssets * 0.025 : 0;

  return (
    <main className="min-h-screen bg-[#f6faf7] px-5 py-8 text-slate-900 md:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-800 hover:underline"
        >
          ← Kthehu në ballinë
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-emerald-700">
            Kalkulim i shpejtë pa regjistrim
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Kalkulatori i Zekatit
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Zgjidh vetëm pasuritë që i ke. Seksionet e tjera mbeten të mbyllura.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
              <h2 className="text-xl font-bold">1. Nisabi dhe valuta</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Valuta
                  <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <option value="EUR">EUR</option>
                    <option value="CHF">CHF</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Nisabi në {currency}
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={nisab}
                    onChange={(event) => setNisab(event.target.value)}
                    placeholder="Shembull: 7000"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                </label>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Për tani nisabi vendoset manualisht. Më vonë do ta marrim
                automatikisht nga çmimi i arit dhe argjendit.
              </p>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
              <h2 className="text-xl font-bold">2. Çfarë pasurie ke?</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4">
                  <input
                    type="checkbox"
                    checked={hasMoney}
                    onChange={(event) => setHasMoney(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">Para dhe kursime</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4">
                  <input
                    type="checkbox"
                    checked={hasGold}
                    onChange={(event) => setHasGold(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">Ari dhe bizhuteri</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4">
                  <input
                    type="checkbox"
                    checked={hasSilver}
                    onChange={(event) => setHasSilver(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">Argjend</span>
                </label>
              </div>
            </section>

            {hasMoney && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
                <h2 className="text-xl font-bold">3. Para dhe kursime</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Para në dorë
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cash}
                      onChange={(event) => setCash(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Para në bankë
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bank}
                      onChange={(event) => setBank(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Kursime
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={savings}
                      onChange={(event) => setSavings(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Borxhe që pritet t’i marrësh
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={receivables}
                      onChange={(event) => setReceivables(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>
                </div>
              </section>
            )}

            {hasGold && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
                <h2 className="text-xl font-bold">4. Ari dhe bizhuteri</h2>

<div className="mt-5 grid gap-4 sm:grid-cols-2">
  <label className="text-sm font-semibold text-slate-700">
    Lloji i arit
    <select
      value={goldType}
      onChange={(event) => setGoldType(event.target.value)}
      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
    >
      <option value="investment">Ar për investim ose tregti</option>
      <option value="jewelry">Bizhuteri për përdorim personal</option>
    </select>
  </label>

  {goldType === "jewelry" && (
    <label className="text-sm font-semibold text-slate-700">
      Trajtimi në kalkulim
      <select
        value={jewelryRule}
        onChange={(event) => setJewelryRule(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
      >
        <option value="include">Përfshije në kalkulimin e zekatit</option>
        <option value="exclude">
          Mos e përfshi bizhuterinë personale
        </option>
      </select>
    </label>
  )}
</div>
                <label className="mt-5 block text-sm font-semibold text-slate-700">
                  Çmimi i arit të pastër për 1 gram në {currency}
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={goldPrice}
                    onChange={(event) => setGoldPrice(event.target.value)}
                    placeholder="Shembull: 95"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                </label>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Ari 24K në gram
                    <input
                      type="number"
                      min="0"
                      value={gold24}
                      onChange={(event) => setGold24(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Ari 22K në gram
                    <input
                      type="number"
                      min="0"
                      value={gold22}
                      onChange={(event) => setGold22(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Ari 21K në gram
                    <input
                      type="number"
                      min="0"
                      value={gold21}
                      onChange={(event) => setGold21(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Ari 18K në gram
                    <input
                      type="number"
                      min="0"
                      value={gold18}
                      onChange={(event) => setGold18(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Ari 14K në gram
                    <input
                      type="number"
                      min="0"
                      value={gold14}
                      onChange={(event) => setGold14(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Ari 14K llogaritet automatikisht si 14/24 ari i pastër.
                </p>
              </section>
            )}

            {hasSilver && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
                <h2 className="text-xl font-bold">5. Argjendi</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Argjend në gram
                    <input
                      type="number"
                      min="0"
                      value={silverGrams}
                      onChange={(event) => setSilverGrams(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Çmimi për gram në {currency}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={silverPrice}
                      onChange={(event) => setSilverPrice(event.target.value)}
                      placeholder="Shembull: 1.10"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>
                </div>
              </section>
            )}

            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
              <h2 className="text-xl font-bold">6. Detyrime të zbritshme</h2>

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                Borxhe / detyrime që i ke
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={debts}
                  onChange={(event) => setDebts(event.target.value)}
                  placeholder="0.00"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                />
              </label>
            </section>
          </div>

          <aside className="h-fit rounded-2xl bg-emerald-800 p-6 text-white shadow-lg lg:sticky lg:top-6">
            <p className="text-sm font-semibold text-emerald-100">
              Përmbledhja
            </p>

            <div className="mt-6 space-y-4 border-b border-emerald-700 pb-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">Para dhe kursime</span>
                <strong>{money(moneyTotal, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">Ari i pastër</span>
                <strong>{goldPureGrams.toFixed(2)} g</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">Vlera e arit</span>
                <strong>{money(goldValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">Vlera e argjendit</span>
                <strong>{money(silverValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">Detyrimet</span>
                <strong>{money(toNumber(debts), currency)}</strong>
              </div>

              <div className="flex justify-between gap-4 font-bold">
                <span>Pasuria neto</span>
                <strong>{money(netAssets, currency)}</strong>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-emerald-100">Zekati i llogaritur</p>

              <p className="mt-2 text-4xl font-bold">
                {money(zakat, currency)}
              </p>

              {nisabValue === 0 ? (
                <p className="mt-4 rounded-xl bg-amber-300/15 p-3 text-sm leading-6 text-amber-100">
                  Vendose nisabin që sistemi të kontrollojë pragun e zekatit.
                </p>
              ) : reachedNisab ? (
                <p className="mt-4 rounded-xl bg-emerald-700 p-3 text-sm leading-6 text-emerald-50">
                  Pasuria neto e kalon nisabin. Zekati është llogaritur me 2.5%.
                </p>
              ) : (
                <p className="mt-4 rounded-xl bg-emerald-700 p-3 text-sm leading-6 text-emerald-50">
                  Pasuria neto ende nuk e kalon nisabin e vendosur.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}