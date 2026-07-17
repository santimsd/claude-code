import { useState } from 'react';
import { CheckCircle2, HelpCircle, BedDouble, Truck } from 'lucide-react';
import { brand } from '../brand';

export default function Header() {
  const [logoFailed, setLogoFailed] = useState(false);
  const showImageLogo = brand.logo && !logoFailed;

  return (
    <>
      <header className="site-header">
        <div className="logo-wrapper">
          {showImageLogo ? (
            <img
              src={brand.logo as string}
              alt={brand.nameFull}
              className="logo-img"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="logo-fallback">
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                <circle cx="35" cy="35" r="28" fill={brand.colors.secondary}/>
                <circle cx="65" cy="35" r="28" fill={brand.colors.primary}/>
                <circle cx="35" cy="65" r="28" fill={brand.colors.secondary}/>
                <circle cx="65" cy="65" r="28" fill={brand.colors.secondary}/>
                <rect x="47" y="60" width="6" height="22" rx="3" fill={brand.colors.secondary}/>
              </svg>
              <div className="logo-text-block">
                <span className="logo-name">{brand.name}</span>
                <span className="logo-sub">{brand.subtitle}</span>
              </div>
            </div>
          )}
        </div>
        <h2 className="header-headline">{brand.header.headline}</h2>
        <p className="header-intro">
          {brand.header.intro}
        </p>
      </header>

      <div className="usp-bar">
        {brand.usps.map((t) => (
          <div className="usp-item" key={t}>
            <CheckCircle2 size={20} color={brand.colors.primary} strokeWidth={2.5} />
            {t}
          </div>
        ))}
      </div>

      <div className="process-bar">
        <div className="process-step">
          <div className="process-icon"><HelpCircle size={18} strokeWidth={2} /></div>
          <span>Zorgvraag</span>
        </div>
        <span className="process-arrow">→</span>
        <div className="process-step">
          <div className="process-icon"><BedDouble size={18} strokeWidth={2} /></div>
          <span>Passende oplossing</span>
        </div>
        <span className="process-arrow">→</span>
        <div className="process-step">
          <div className="process-icon"><Truck size={18} strokeWidth={2} /></div>
          <span>Binnen 4 uur inzetbaar</span>
        </div>
      </div>
    </>
  );
}
