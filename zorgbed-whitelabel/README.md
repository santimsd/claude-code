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
   USP's, e-mailbranding en de **producten** (zie hieronder).
3. **Logo**: zet je logo in `public/` en verwijs ernaar via
   `logo: '/mijn-logo.png'`. Of laat `logo: null` staan voor een automatisch
   tekst-logo (naam + subtitel).
4. **Activeer** het merk via `.env`: `VITE_BRAND=mijnmerk`.

Meer hoef je nergens aan te passen — de kleuren, de header, de paginatitel,
de producten en de e-mails nemen automatisch de merkinstellingen over.

### Producten per merk

Elk merk heeft een eigen `products`-lijst in `src/brand.ts`. Zo biedt elk merk
z'n eigen assortiment aan. Per product stel je in:

| Veld | Betekenis |
| --- | --- |
| `id` | Unieke sleutel (wordt opgeslagen bij de aanvraag) |
| `situation` | De zorgsituatie, bv. "Hoog valrisico" |
| `situationColor` | Kleur van de situatie-tekst en het icoon (hex) |
| `iconBg` | Achtergrondkleur van het icoon-rondje (hex) |
| `icon` | Naam van een Lucide-icoon (zie hieronder) |
| `name` | Productnaam |
| `usps` | Korte voordelen (bullets) |
| `img` | Afbeelding in `public/beds/` (optioneel) |

**Afbeeldingen**: zet je productfoto in `public/beds/` en verwijs ernaar via
`img: '/beds/mijnbed.png'`. Laat `img` weg voor een "Afbeelding volgt"-vak.

**Iconen**: `icon` verwijst naar een [Lucide-icoon](https://lucide.dev/icons).
Beschikbaar in deze app: `Brain`, `AlertTriangle`, `Users`, `RotateCw`,
`Shield`, `Weight`, `BedDouble`, `Heart`, `Activity`, `Accessibility`. Een
ander icoon nodig? Importeer het in `src/components/Section5Bedkeuze.tsx` en
voeg het toe aan het `ICONS`-register. Bij een onbekende naam wordt een
standaard bed-icoon getoond.

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

De `vercel.json` in de **repo-root** bouwt nog steeds de originele
`kersten-zorgbed` map — die deployment blijft dus ongewijzigd werken. Deze
white-label variant heeft z'n eigen `zorgbed-whitelabel/vercel.json` en deploy
je als een **apart Vercel-project**:

1. Maak in Vercel een nieuw project op deze repo.
2. Zet **Root Directory** op `zorgbed-whitelabel`.
3. Voeg de environment-variabelen toe (`VITE_BRAND`, `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`, evt. `VITE_DEALER_ID`).

**Meerdere merken?** Kies één van twee aanpakken:

- **Eén project per merk** (aanbevolen): maak per merk een Vercel-project met
  een eigen `VITE_BRAND` en eigen domein/subdomein
  (bv. `kersten.example.nl`, `zorgcomfort.example.nl`). Elk merk krijgt zo z'n
  eigen build en URL.
- **Preview-branches**: gebruik per merk een branch met een eigen
  `VITE_BRAND`-waarde in de Vercel-omgevingsinstellingen.

## Scripts

```bash
npm run dev      # ontwikkelserver
npm run build    # productie-build (dist/)
npm run preview  # productie-build lokaal bekijken
npm run lint     # eslint
```
