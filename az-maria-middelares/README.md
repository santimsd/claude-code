# AZ Maria Middelares — Aan- en afmeldapplicatie zorgbedden

Zelfstandige app voor het aanvragen van het **FeelSafe Pro tentbed** voor
AZ Maria Middelares (Gent, BE). React + TypeScript + Vite. Geen
omgevingsvariabele of merkselectie nodig — deze map deployt direct als
AZ Maria Middelares.

## 🧪 TESTFASE (staat nu AAN)

Alle intake- en afmeldmails gaan tijdens de test **alleen naar
`santi@humanprotection.nl`** (constante `TEST_MODE` bovenin beide edge
functions in `supabase/functions/`). De bevestigings- en reminder-mail gaan
naar het e-mailadres dat de invuller zelf opgeeft.

**Go-live:** zet `TEST_MODE = false` in beide functions — dan gaan de mails
naar `info@humanprotection.nl` + het klantadres (`RECIPIENT_EMAIL`).

## ⚠️ Nog nodig / in te vullen

- **Logo** — upload het officiële logobestand als **`public/logo.png`**
  (via GitHub: Add file → Upload files in deze map). De app gebruikt het dan
  automatisch; tot die tijd toont hij het tekst-logo. Kleuren (navy/teal)
  zijn al ingesteld.
- **Liftmaat** — de minimaal benodigde liftafmetingen (staan in het papieren
  aanvraagformulier). Nu een placeholder in `Section6Logistiek.tsx`.
- **Klant-intakeadres** — `RECIPIENT_EMAIL` (gebruikt na de testfase, naast
  het vaste `info@humanprotection.nl`).

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
- **Afmeldlink** in de bevestigings- (en reminder-)mail → afmeldpagina
  `/afmelden` met een **barcodeveld**; verstuurt de afmelding door naar dezelfde
  2 adressen. **Geen opslag** — puur doorsturen.
- **Reminder-mail "huur loopt nog" na 7 dagen** naar de contactpersoon, ingepland via de
  scheduled-send van Resend (`scheduled_at`). **Geen database/cron nodig.**

## Aandachtspunten bij de no-database aanpak

- De reminder wordt bij verzending al ingepland. Omdat er niets wordt
  opgeslagen, kan hij **niet automatisch geannuleerd** worden als er eerder
  wordt afgemeld — de mail vermeldt daarom "indien al retour, negeer deze mail".
- Resend `scheduled_at` ondersteunt inplannen tot 30 dagen vooruit (7 dagen
  past ruim). Verifieer dit in jullie Resend-account.
- De afmeldlink gebruikt de site-URL van de deployment; alleen de **referentie**
  (geen persoonsgegevens) wordt voorinvuld via de link.

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
