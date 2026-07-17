# ZorgComfort — Zorgbed Aanvragen

Zelfstandige aanvraag-app voor het merk **ZorgComfort** (React + TypeScript + Vite).
Deze map staat volledig op zichzelf: **geen omgevingsvariabele en geen merkselectie
nodig** — je deployt deze map en ziet direct de ZorgComfort-branding. Geen Kersten.

## Deployen op Vercel (in het kort)

1. Vercel → **Add New → Project** → repo `claude-code` → **Import**.
2. **Root Directory** → kies **`zorgcomfort-zorgbed`**.
3. (Optioneel voor het versturen van het formulier) voeg de Supabase
   environment-variabelen toe — zie `.env.example`.
4. **Deploy**. Klaar — de site toont meteen ZorgComfort.

> Framework wordt automatisch herkend als **Vite** (`vercel.json` staat in de map).

## Branding aanpassen

Alle merk-instellingen staan in **`src/brand.ts`**: naam, subtitel, slogan,
kleuren, headerteksten, USP's, e-mail en de producten. Pas daar aan wat je wilt.

- **Logo**: zet een bestand in `public/` en verwijs ernaar via
  `logo: '/mijn-logo.png'`. Nu staat `logo: null` → automatisch tekst-logo.
- **Kleuren**: `primary` (accent) en `secondary` (hoofdkleur).
- **Producten**: de `products`-lijst bepaalt welke bedden getoond worden
  (id, situatie, icoon, naam, voordelen, afbeelding).

## Lokaal draaien

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev      # ontwikkelserver
npm run build    # productie-build (dist/)
npm run preview  # productie-build lokaal bekijken
npm run lint     # eslint
```

---

**Meer merken?** Elk merk krijgt zo z'n eigen map (zoals `kersten-zorgbed` en
deze `zorgcomfort-zorgbed`). Een nieuw merk = deze map kopiëren, `src/brand.ts`
aanpassen, en als apart Vercel-project deployen met een eigen (sub)domein.
