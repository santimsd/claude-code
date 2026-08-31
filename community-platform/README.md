# Community-platform

Besloten community-platform: chat, evenementen en fotogalerij voor leden, op uitnodiging.

**Stack:** Next.js (App Router, TypeScript) · Supabase (Postgres, Auth, Storage, Realtime) · Tailwind CSS · Vercel (hosting, later)

## Status

- [x] **Stap 1** — Projectopzet, Supabase-schema, RLS en storage-policies
- [ ] Stap 2 — Login via uitnodiging + rollen
- [ ] Stap 3 — Chat (realtime)
- [ ] Stap 4 — Evenementen
- [ ] Stap 5 — Foto's
- [ ] Stap 6 — Admin-beheer

## Lokaal draaien

```bash
cd community-platform
npm install
cp .env.example .env.local   # en vul de waarden in (zie hieronder)
npm run dev
```

## Stap 1 — wat je zelf in het Supabase-dashboard doet

1. **Migraties draaien.** Open in het dashboard **SQL Editor** en voer de drie
   bestanden uit `supabase/migrations/` uit, in volgorde:
   1. `20260831000100_schema.sql` — tabellen, helperfuncties, triggers, seed van kanaal `algemeen`, realtime op `messages`
   2. `20260831000200_rls.sql` — RLS aan op alle tabellen + alle policies
   3. `20260831000300_storage.sql` — privé bucket `photos` (5 MB, jpg/png/webp) + storage-policies

   *(Alternatief met de Supabase CLI: `supabase link --project-ref <ref>` en `supabase db push`.)*

2. **Open registratie uitzetten.** Ga naar **Authentication → Sign In / Providers → Email**
   en zet **"Allow new users to sign up"** UIT. Leden komen er straks alleen in
   via een uitnodiging (stap 2). Er bestaat geen registratiepagina in de app.

3. **API-keys kopiëren.** Ga naar **Project Settings → API** en zet in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — de Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — de `anon` `public` key
   - `SUPABASE_SERVICE_ROLE_KEY` — de `service_role` key (**alleen server-side**, wordt gebruikt vanaf stap 2)

4. **Controleren.** In **Table Editor** zie je nu `profiles`, `channels` (met 1 rij
   `algemeen`), `messages`, `events`, `photos` — allemaal met het RLS-schildje aan.
   In **Storage** staat de privé bucket `photos`.

### Zo test je de RLS (optioneel maar aanbevolen)

In de SQL Editor:

```sql
-- Als anonieme bezoeker: alles hoort leeg/geweigerd te zijn
set role anon;
select * from public.channels;   -- 0 rijen
reset role;
```

Zonder ingelogde gebruiker geeft ook `authenticated` niets terug, omdat
`is_active_member()` dan false is. Echte end-to-end tests met ingelogde
leden en admins volgen in stap 2.

## Datamodel (kort)

| Tabel | Doel | Schrijfrechten |
|---|---|---|
| `profiles` | 1-op-1 met `auth.users`; `display_name`, `role` (`admin`/`member`), `is_active` | eigen naam zelf; rol/actief alleen admin (trigger-bescherming) |
| `channels` | chatkanalen (nu alleen `algemeen`) | alleen admin |
| `messages` | chatberichten per kanaal | eigen berichten; admin mag alles verwijderen |
| `events` | beurzen/congressen, gesorteerd op `starts_at` | alleen admin |
| `photos` | metadata van foto's (bestand in privé bucket `photos`) | eigen foto's; admin mag alles verwijderen |

Lezen mag overal alleen voor **actieve, ingelogde leden**. Gedeactiveerde leden
(`is_active = false`) verliezen direct alle lees- en schrijftoegang, inclusief
storage. Profielen worden automatisch aangemaakt door een trigger zodra een
uitgenodigde gebruiker in `auth.users` verschijnt.

## Vercel (later)

Deze repository bevat meerdere projecten. Maak op Vercel een project aan met
**Root Directory = `community-platform`** en zet daar dezelfde drie
environment-variabelen (de service-role key alleen als server-side variable).
