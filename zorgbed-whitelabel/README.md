# Zorgbed Aanvragen — White-label

Aanvraagformulier voor speciale zorgbedden (React + TypeScript + Vite).
Dit is de **white-label variant**: alle merk-specifieke zaken (naam, logo,
kleuren, teksten en e-mailbranding) staan centraal in één bestand, zodat je
dezelfde app onder meerdere merken kunt draaien.

## Snel starten

```bash
npm install
cp .env.example .env   # vul je eigen waarden in
npm run dev
```

## Een merk kiezen

Het actieve merk bepaal je met de omgevingsvariabele `VITE_BRAND` in `.env`:

```bash
VITE_BRAND=kersten       # standaardmerk
# VITE_BRAND=zorgcomfort # meegeleverd demo-voorbeeldmerk
```

Laat je `VITE_BRAND` leeg, dan wordt het standaardmerk (`kersten`) gebruikt.

## Een nieuw merk toevoegen

Alle merken staan in **`src/brand.ts`**. Een nieuw merk toevoegen doe je zo:

1. **Kopieer** een bestaand blok in `brands` (bv. `kersten`) en geef het een
   nieuwe sleutel, bv. `mijnmerk`.
2. **Vul de velden in**: naam, subtitel, slogan, kleuren, headerteksten,
   USP's en e-mailbranding.
3. **Logo**: zet je logo in `public/` en verwijs ernaar via
   `logo: '/mijn-logo.png'`. Of laat `logo: null` staan voor een automatisch
   tekst-logo (naam + subtitel).
4. **Activeer** het merk via `.env`: `VITE_BRAND=mijnmerk`.

Meer hoef je nergens aan te passen — de kleuren, de header, de paginatitel en
de e-mails nemen automatisch de merkinstellingen over.

### Wat is (nog) niet merk-specifiek?

De productcatalogus (`BED_NAMES` in `src/App.tsx`) en de bedafbeeldingen in
`public/beds/` zijn nu gedeeld tussen alle merken. Wil je per merk andere
producten tonen, dan kun je die lijst later ook naar `src/brand.ts` verhuizen.

## E-mail (Supabase edge function)

De functie `supabase/functions/send-order-email` stuurt de aanvraag- en
bevestigingsmail. De frontend stuurt de merkinfo mee, dus de e-mails krijgen
automatisch de juiste kleuren, naam en slogan. Alleen het **afzenderadres**
stel je per merk in via de secret `EMAIL_FROM` (moet een geverifieerd
Resend-domein zijn):

```bash
supabase secrets set RESEND_API_KEY=re_xxxx
supabase secrets set RECIPIENT_EMAIL=info@mijnmerk.nl
supabase secrets set EMAIL_FROM="Mijn Merk <noreply@mijnmerk.nl>"
```

## Deployen op Vercel

De `vercel.json` in de repo-root bouwt standaard de originele `kersten-zorgbed`
map. Wil je deze white-label variant deployen, laat de build dan naar
`zorgbed-whitelabel` wijzen en stel `VITE_BRAND` in bij de Vercel
environment-variabelen (eventueel een aparte deployment/subdomein per merk).

## Scripts

```bash
npm run dev      # ontwikkelserver
npm run build    # productie-build (dist/)
npm run preview  # productie-build lokaal bekijken
npm run lint     # eslint
```
