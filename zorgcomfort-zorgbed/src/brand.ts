/**
 * ─────────────────────────────────────────────────────────────
 *  MERK-CONFIGURATIE — ZorgComfort
 * ─────────────────────────────────────────────────────────────
 *
 *  Deze map is een zelfstandige app voor één merk: ZorgComfort.
 *  Er is geen omgevingsvariabele of merkselectie nodig — je deployt
 *  deze map en ziet direct de ZorgComfort-branding.
 *
 *  Alles wat merk-specifiek is (naam, logo, kleuren, teksten,
 *  producten, e-mail) staat hieronder in `brand`. Pas het gerust aan.
 *
 *  Een eigen logo? Zet het bestand in `public/` en verwijs ernaar
 *  via `logo: '/mijn-logo.png'`. Laat `logo: null` staan om het
 *  automatische tekst-logo (naam + subtitel) te tonen.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Eén product (zorgbed) dat het merk aanbiedt.
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
   * Beschikbaar: Brain, AlertTriangle, Users, RotateCw, Shield,
   * Weight, BedDouble, Heart, Activity, Accessibility.
   */
  icon: string;
  /** Productnaam. */
  name: string;
  /** Korte voordelen (bullets) onder het product. */
  usps: string[];
  /** Pad naar de productafbeelding in `public/`, bv. "/beds/laagbed.png". */
  img?: string;
};

export type Brand = {
  id: string;
  name: string;
  nameFull: string;
  subtitle: string;
  tagline: string;
  logo: string | null;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
  };
  header: {
    headline: string;
    intro: string;
  };
  usps: [string, string, string];
  email: {
    fromName: string;
    footerNote: string;
  };
  products: Product[];
};

/** Het merk van deze app. */
export const brand: Brand = {
  id: 'zorgcomfort',
  name: 'ZorgComfort',
  nameFull: 'ZorgComfort Zorgbedden',
  subtitle: 'zorgbedden',
  tagline: 'Comfort in de zorg.',
  logo: null, // Geen eigen logo → automatisch tekst-logo. Zet hier bv. '/logo.png'.
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
};

/**
 * Zet de merkkleuren als CSS-variabelen op <html>, zodat alle
 * `var(--green)` / `var(--purple)` verwijzingen in de CSS automatisch
 * de kleuren van dit merk gebruiken.
 */
export function applyBrandTheme(b: Brand = brand): void {
  const root = document.documentElement;
  root.style.setProperty('--green', b.colors.primary);
  root.style.setProperty('--green-dark', b.colors.primaryDark);
  root.style.setProperty('--purple', b.colors.secondary);
  root.style.setProperty('--purple-light', b.colors.secondaryLight);
}
