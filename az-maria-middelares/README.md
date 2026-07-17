# AZ Maria Middelares — Aan- en afmeldapplicatie zorgbedden

Zelfstandige app voor het aanvragen van het **FeelSafe Pro tentbed** voor
AZ Maria Middelares (Gent, BE). React + TypeScript + Vite. Geen
omgevingsvariabele of merkselectie nodig — deze map deployt direct als
AZ Maria Middelares.

## ⚠️ Nog nodig / in te vullen

- **Huisstijl (marketing)** — logo en exacte kleuren. Nu placeholders in
  `src/brand.ts` (`colors` + `logo`). Vervang zodra marketing aanlevert.
- **Liftmaat** — de minimaal benodigde liftafmetingen (staan in het papieren
  aanvraagformulier). Nu een placeholder in `Section6Logistiek.tsx`.
- **Klant-intakeadres** — `RECIPIENT_EMAIL` (naast het vaste
  `info@humanprotection.nl`).
- **Backend-fase** — afmeldlink + barcodeveld en reminder-mail na 5 dagen.
  Zie "Nog te bouwen".

## Wat is al aangepast (t.o.v. het originele formulier)

- Alleen het **FeelSafe Pro tentbed** zichtbaar (andere bedden later).
- **Factuurinformatie** volledig verwijderd.
- **Afleverinformatie** ingekort tot: naam, afdeling, contactpersoon,
  telefoonnummer, e-mailadres.
- **Patiëntgegevens** blijven (AVG: één van de vier volstaat); "Naam patiënt"
  → **Naam**.
- **Referentie** als apart, verplicht veld.
- **Liftmaat**-veld toegevoegd (zichtbaar als er een lift is).
- USP en teksten aangepast naar **binnen 4 uur geleverd**.
- E-mail: intake naar **2 adressen** (`info@humanprotection.nl` + klant),
  factuur-/adresvelden verwijderd, referentie toegevoegd.

## Nog te bouwen (backend-fase, i.o.m. Roland)

Deze features vereisen opslag van elke aanvraag (Supabase-tabel) + een
geplande functie, en zijn nog niet gebouwd:

- **Afmeldlink** in de e-mail, met een veld voor de **barcode**.
- **Reminder-mail** naar de klant **na 5 dagen** (gem. ligduur 4,5 dag).

## Deployen op Vercel

1. Vercel → **Add New → Project** → repo `claude-code` → **Import**.
2. **Root Directory** → `az-maria-middelares`.
3. Environment-variabelen toevoegen (zie `.env.example`).
4. **Deploy**.

## Lokaal draaien

```bash
npm install
cp .env.example .env
npm run dev
```

## Branding aanpassen

Alles staat in **`src/brand.ts`** (naam, logo, kleuren, teksten, USP's,
e-mail, producten).
