/**
 * ─────────────────────────────────────────────────────────────
 *  MERK-CONFIGURATIE — AZ Maria Middelares (Gent, BE)
 * ─────────────────────────────────────────────────────────────
 *
 *  Zelfstandige app voor het aan- en afmelden van zorgbedden voor
 *  AZ Maria Middelares. Geen omgevingsvariabele of merkselectie nodig.
 *
 *  ⚠️ HUISSTIJL = PLACEHOLDER
 *  Logo en kleuren komen van de afdeling marketing van AZ Maria
 *  Middelares. De waarden hieronder zijn tijdelijke placeholders —
 *  vervang `colors` en `logo` zodra de huisstijl binnen is.
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
  logo: null, // ⚠️ tekst-logo tot het officiële logobestand er is (zet dan bv. '/logo.svg')
  // Huisstijl AZ Maria Middelares: navy + teal (afgeleid van het logo).
  colors: {
    primary: '#45bdab', // teal-accent (cirkel / "DEINZE")
    primaryDark: '#2f9e8c',
    secondary: '#003a73', // navy (wordmark "MARIA MIDDELARES")
    secondaryLight: '#2d5f96',
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
      situationColor: '#003a5d',
      iconBg: '#e3edf3',
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
