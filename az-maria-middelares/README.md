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
- **Afmeldlink** in de bevestigings- (en reminder-)mail → afmeldpagina
  `/afmelden` met een **barcodeveld**; verstuurt de afmelding door naar dezelfde
  2 adressen. **Geen opslag** — puur doorsturen.
- **Reminder-mail na 5 dagen** naar de contactpersoon, ingepland via de
  scheduled-send van Resend (`scheduled_at`). **Geen database/cron nodig.**

## Aandachtspunten bij de no-database aanpak

- De reminder wordt bij verzending al ingepland. Omdat er niets wordt
  opgeslagen, kan hij **niet automatisch geannuleerd** worden als er eerder
  wordt afgemeld — de mail vermeldt daarom "indien al retour, negeer deze mail".
- Resend `scheduled_at` ondersteunt inplannen tot 30 dagen vooruit (5 dagen
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
