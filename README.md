# Zekat

Kalkulator web i zekatit në shqip dhe anglisht. Aplikacioni mbulon pasuritë financiare, arin e argjendin, stolitë, kripto, biznesin, bagëtinë dhe prodhimet bujqësore. Kalkulimet ruhen lokalisht; përdoruesit e kyçur mund t'i sinkronizojnë edhe me Supabase.

## Nisja lokale

Kërkohet Node.js dhe npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Aplikacioni hapet në [http://localhost:3001](http://localhost:3001).

## Konfigurimi

Variablat e mbështetura në `.env.local` janë:

- `METALS_DEV_API_KEY` — opsionale; mundëson çmimet referuese të arit dhe argjendit nga Metals.Dev.
- `NEXT_PUBLIC_SUPABASE_URL` — opsionale; URL-ja e projektit Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — opsionale; çelësi publik i Supabase.

Pa Supabase, kalkulatori vazhdon të punojë dhe i ruan kalkulimet vetëm në pajisje. Për sinkronizimin cloud, ekzekuto edhe migrimin në `supabase/migrations` në projektin përkatës Supabase dhe konfiguro URL-në e kthimit të autentikimit si `/auth/callback`.

## Verifikimi

```bash
npm run lint
npx tsc --noEmit
npm test -- --run
npm run build
```

## PWA

Faqja `/instalo` udhëzon instalimin në telefon. Service worker-i ruan shell-in bazë dhe faqet e vizituara, ndërsa `/offline` përdoret si fallback kur rrjeti nuk është i disponueshëm.
