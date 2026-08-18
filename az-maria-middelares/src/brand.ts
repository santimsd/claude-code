/**
 * ─────────────────────────────────────────────────────────────
 *  MERK-CONFIGURATIE — AZ Maria Middelares (Gent, BE)
 * ─────────────────────────────────────────────────────────────
 *
 *  Zelfstandige app voor het aan- en afmelden van zorgbedden voor
 *  AZ Maria Middelares. Geen omgevingsvariabele of merkselectie nodig.
 *
 *  Huisstijl volgens de officiële "Huisstijlgids vzw Maria Middelares":
 *  hoofdkleur Pantone 280C (#023778), steunkleuren #4878a1 / #97b8e2 /
 *  #d2e1f5. Typografie: DIN OT (commercieel) — in de app vervangen door
 *  Barlow (gratis, DIN-achtig) tot er een DIN OT-webfontlicentie is.
 * ─────────────────────────────────────────────────────────────
 */

export type Product = {
  id: string;
  situation: string;
  situationColor: string;
  iconBg: string;
  icon: string;
  name: string;
  usps: string[];
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

export const brand: Brand = {
  id: 'az-maria-middelares',
  name: 'AZ Maria Middelares',
  nameFull: 'AZ Maria Middelares',
  subtitle: 'Gent',
  tagline: 'Zorg met een warm hart.', // ⚠️ pay-off — bevestigen met klant
  // Logo: upload het officiële logobestand als `logo.png` in de map `public/`
  // (via GitHub: Add file → Upload files). Zolang het bestand ontbreekt valt
  // de app automatisch terug op het tekst-logo.
  logo: '/logo.png',
  // Officiële kleuren uit de Huisstijlgids vzw Maria Middelares:
  // hoofdkleur Pantone 280C #023778, steunkleuren #4878a1 / #97b8e2 / #d2e1f5.
  colors: {
    primary: '#4878a1', // steunkleur middenblauw (accenten, knoppen)
    primaryDark: '#023778',
    secondary: '#023778', // hoofdkleur Pantone 280C
    secondaryLight: '#4878a1',
  },
  header: {
    headline: 'Snel een FeelSafe Pro tentbed aanvragen.',
    intro: 'Vul hieronder de gegevens in — wij leveren binnen 4 uur.',
  },
  usps: ['Proefplaatsing', 'Verhuur', 'Binnen 4 uur geleverd'],
  email: {
    fromName: 'AZ Maria Middelares',
    footerNote: 'AZ Maria Middelares · Aan- en afmeldapplicatie zorgbedden',
  },
  // Alleen het FeelSafe Pro tentbed. Overige bedden volgen later.
  products: [
    {
      id: 'feelsafe_pro',
      situation: 'Onrust / Dementie / Delier / Valrisico',
      situationColor: '#023778',
      iconBg: '#d2e1f5',
      icon: 'Shield',
      name: 'FeelSafe Pro Tentbed',
      usps: ['Rust & veiligheid', 'Minder valgevaar', 'Geborgen gevoel'],
      img: '/beds/feelsafe.png',
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
