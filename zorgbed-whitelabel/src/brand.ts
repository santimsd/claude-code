/**
 * ─────────────────────────────────────────────────────────────
 *  WHITE-LABEL MERKEN-CONFIGURATIE
 * ─────────────────────────────────────────────────────────────
 *
 *  Alle merk-specifieke informatie (naam, logo, kleuren, teksten,
 *  e-mail) staat hier centraal. Een nieuw merk toevoegen doe je in
 *  3 stappen:
 *
 *    1. Kopieer een blok hieronder (bv. `kersten`) en geef het een
 *       nieuwe sleutel, bv. `zorgcomfort`.
 *    2. Pas de velden aan (naam, kleuren, teksten, e-mail, logo).
 *    3. Zet het merk als actief via de omgevingsvariabele in `.env`:
 *          VITE_BRAND=zorgcomfort
 *       Laat je deze leeg, dan wordt `DEFAULT_BRAND` gebruikt.
 *
 *  Een eigen logo? Zet het bestand in `public/` en verwijs ernaar
 *  via `logo: '/mijn-logo.png'`. Laat `logo: null` staan om het
 *  automatische tekst-logo (naam + subtitel) te tonen.
 * ─────────────────────────────────────────────────────────────
 */

export type Brand = {
  /** Interne sleutel, moet gelijk zijn aan de sleutel in `brands`. */
  id: string;
  /** Korte merknaam, bv. "Kersten". */
  name: string;
  /** Volledige merknaam, bv. "Kersten Hulpmiddelen". */
  nameFull: string;
  /** Subtitel naast het logo, bv. "hulpmiddelen". */
  subtitle: string;
  /** Slogan / pay-off, bv. "Het draait om mensen." */
  tagline: string;
  /**
   * Pad naar het logo in `public/`, bv. "/logo.jpeg".
   * `null` = automatisch tekst-logo (merknaam + subtitel).
   */
  logo: string | null;
  /** Merkkleuren. `primary` = accent, `secondary` = donker/hoofdkleur. */
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
  };
  /** Teksten in de header bovenaan het formulier. */
  header: {
    headline: string;
    intro: string;
  };
  /** De drie korte USP's in de balk onder de header. */
  usps: [string, string, string];
  /** E-mailbranding (gebruikt in de bevestigings- en aanvraagmail). */
  email: {
    /** Weergavenaam van de afzender, bv. "Kersten Hulpmiddelen". */
    fromName: string;
    /** Voettekst onderaan de e-mails. */
    footerNote: string;
  };
};

export const brands: Record<string, Brand> = {
  /* ───────────────────────── KERSTEN (standaard) ───────────────────────── */
  kersten: {
    id: 'kersten',
    name: 'Kersten',
    nameFull: 'Kersten Hulpmiddelen',
    subtitle: 'hulpmiddelen',
    tagline: 'Het draait om mensen.',
    logo: '/logo.jpeg',
    colors: {
      primary: '#78be20',
      primaryDark: '#5f9a18',
      secondary: '#3d2b8e',
      secondaryLight: '#5a4aaa',
    },
    header: {
      headline: 'Vandaag nog het juiste speciale zorgbed.',
      intro: 'Vul hieronder eenvoudig de gegevens in — wij regelen de rest.',
    },
    usps: ['Proefplaatsing', 'Verhuur', 'Levering binnen 24 uur'],
    email: {
      fromName: 'Kersten Hulpmiddelen',
      footerNote: 'Kersten Hulpmiddelen · Het draait om mensen.',
    },
  },

  /* ─────────────── ZORGCOMFORT (demo-voorbeeldmerk) ─────────────── *
   *  Fictief tweede merk om te laten zien hoe white-labeling werkt.
   *  Andere naam, andere kleuren, geen eigen logo (tekst-logo).
   *  Activeren met:  VITE_BRAND=zorgcomfort
   * ──────────────────────────────────────────────────────────────── */
  zorgcomfort: {
    id: 'zorgcomfort',
    name: 'ZorgComfort',
    nameFull: 'ZorgComfort Zorgbedden',
    subtitle: 'zorgbedden',
    tagline: 'Comfort in de zorg.',
    logo: null,
    colors: {
      primary: '#0ea5a4',
      primaryDark: '#0b807f',
      secondary: '#1e3a5f',
      secondaryLight: '#3b5a80',
    },
    header: {
      headline: 'Snel een passend zorgbed geregeld.',
      intro: 'Vul het formulier in — wij zorgen voor een snelle levering.',
    },
    usps: ['Gratis proefplaatsing', 'Flexibele huur', 'Snel geleverd'],
    email: {
      fromName: 'ZorgComfort Zorgbedden',
      footerNote: 'ZorgComfort Zorgbedden · Comfort in de zorg.',
    },
  },
};

/** Merk dat gebruikt wordt als `VITE_BRAND` niet is ingesteld. */
export const DEFAULT_BRAND = 'kersten';

/** Het actieve merk, bepaald door `VITE_BRAND` in de omgeving. */
export const brand: Brand =
  brands[import.meta.env.VITE_BRAND as string] ?? brands[DEFAULT_BRAND];

/**
 * Zet de merkkleuren als CSS-variabelen op <html>, zodat alle
 * bestaande `var(--green)` / `var(--purple)` verwijzingen in de CSS
 * automatisch de kleuren van het actieve merk gebruiken.
 */
export function applyBrandTheme(b: Brand = brand): void {
  const root = document.documentElement;
  root.style.setProperty('--green', b.colors.primary);
  root.style.setProperty('--green-dark', b.colors.primaryDark);
  root.style.setProperty('--purple', b.colors.secondary);
  root.style.setProperty('--purple-light', b.colors.secondaryLight);
}
