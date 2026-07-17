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

/**
 * Eén product (zorgbed) dat een merk aanbiedt. De productcatalogus is
 * per merk instelbaar — zo kan elk merk andere bedden tonen.
 */
export type Product = {
  /** Unieke sleutel van het product (wordt opgeslagen bij de aanvraag). */
  id: string;
  /** De zorgsituatie waar dit bed bij past, bv. "Hoog valrisico". */
  situation: string;
  /** Kleur van de situatie-tekst (hex). */
  situationColor: string;
  /** Achtergrondkleur van het icoon-rondje (hex). */
  iconBg: string;
  /**
   * Naam van een Lucide-icoon (zie https://lucide.dev/icons).
   * Beschikbaar in deze app: Brain, AlertTriangle, Users, RotateCw,
   * Shield, Weight, BedDouble, Heart, Activity, Accessibility.
   * Onbekende naam? Dan wordt een standaard bed-icoon getoond.
   */
  icon: string;
  /** Productnaam, bv. "FeelSafe Go Tentbed". */
  name: string;
  /** Korte voordelen (bullets) onder het product. */
  usps: string[];
  /** Pad naar de productafbeelding in `public/`, bv. "/beds/feelsafe.png". */
  img?: string;
};

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
  /** Producten (zorgbedden) die dit merk aanbiedt. */
  products: Product[];
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
    products: [
      {
        id: 'feelsafe',
        situation: 'Onrust / Dementie / Delier',
        situationColor: '#c2185b',
        iconBg: '#fce4ec',
        icon: 'Brain',
        name: 'FeelSafe Go Tentbed',
        usps: ['Rust & veiligheid', 'Minder valgevaar', 'Geborgen gevoel'],
        img: '/beds/feelsafe.png',
      },
      {
        id: 'vloerbed',
        situation: 'Hoog valrisico',
        situationColor: '#1565c0',
        iconBg: '#e3f2fd',
        icon: 'AlertTriangle',
        name: 'Vloerbed (Extra Laag)',
        usps: ['Veilig slapen', 'Minder valletsel', 'Comfortabel en laagdrempelig'],
        img: '/beds/vloerbed.png',
      },
      {
        id: 'koppelbed',
        situation: 'Nabijheid familie',
        situationColor: '#00695c',
        iconBg: '#e0f2f1',
        icon: 'Users',
        name: 'Koppelbed',
        usps: ['Samen slapen', 'Versterkt contact', 'Rust & geborgenheid'],
        img: '/beds/koppelbed.png',
      },
      {
        id: 'rollassist',
        situation: 'Hulp bij draaien / verplaatsen op bed',
        situationColor: '#e65100',
        iconBg: '#fff3e0',
        icon: 'RotateCw',
        name: 'RollAssist',
        usps: ['Comfortabel draaien/verplaatsen', 'Minder fysieke belasting', 'Snel beschikbaar'],
        img: '/beds/rollassist.png',
      },
      {
        id: 'cloudcuddle',
        situation: 'Prikkelgevoeligheid / Veilig slapen',
        situationColor: '#4a148c',
        iconBg: '#f3e5f5',
        icon: 'Shield',
        name: 'CloudCuddle Maxx Mobiele Bedtent',
        usps: ['Geborgenheid', 'Minder prikkels', 'Mobiele oplossing'],
        img: '/beds/cloudcuddle.png',
      },
      {
        id: 'flexobed',
        situation: 'Obesitas / In-uit bed problematiek',
        situationColor: '#2e7d32',
        iconBg: '#e8f5e9',
        icon: 'Weight',
        name: 'Flexobed Bariatrisch Bed',
        usps: ['Zelfstandigheid', 'Minder zorgbelasting', 'Direct leverbaar'],
        img: '/beds/flexobed.png',
      },
    ],
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
    // Eigen, afwijkende catalogus — ander assortiment dan Kersten.
    products: [
      {
        id: 'hooglaagbed',
        situation: 'Algemene verpleegzorg',
        situationColor: '#0ea5a4',
        iconBg: '#d9f5f4',
        icon: 'BedDouble',
        name: 'ComfortCare Hoog-Laagbed',
        usps: ['In hoogte verstelbaar', 'Ontlast de rug van zorgpersoneel', 'Elektrisch bedienbaar'],
        img: '/beds/rollassist.png',
      },
      {
        id: 'laagbed',
        situation: 'Hoog valrisico',
        situationColor: '#1565c0',
        iconBg: '#e3f2fd',
        icon: 'AlertTriangle',
        name: 'SafeLow Laagbed',
        usps: ['Extra laag', 'Minder valletsel', 'Rustig slapen'],
        img: '/beds/vloerbed.png',
      },
      {
        id: 'tentbed',
        situation: 'Onrust / Dementie',
        situationColor: '#4a148c',
        iconBg: '#f3e5f5',
        icon: 'Shield',
        name: 'CozyTent Bedtent',
        usps: ['Geborgenheid', 'Minder prikkels', 'Veilig gevoel'],
        img: '/beds/cloudcuddle.png',
      },
      {
        id: 'bariatrisch',
        situation: 'Obesitas',
        situationColor: '#2e7d32',
        iconBg: '#e8f5e9',
        icon: 'Weight',
        name: 'MaxiComfort Bariatrisch Bed',
        usps: ['Hoge belastbaarheid', 'Zelfstandigheid', 'Direct leverbaar'],
        img: '/beds/flexobed.png',
      },
    ],
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
