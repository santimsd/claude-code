import { useState } from 'react';

export default function Header() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="logo-wrapper">
          {!logoFailed ? (
            <img
              src="/logo.png"
              alt="Kersten hulpmiddelen"
              className="logo-img"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="logo-fallback">
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                <circle cx="35" cy="35" r="28" fill="#3d2b8e"/>
                <circle cx="65" cy="35" r="28" fill="#78be20"/>
                <circle cx="35" cy="65" r="28" fill="#3d2b8e"/>
                <circle cx="65" cy="65" r="28" fill="#3d2b8e"/>
                <rect x="47" y="60" width="6" height="22" rx="3" fill="#3d2b8e"/>
              </svg>
              <div className="logo-text-block">
                <span className="logo-kersten">Kersten</span>
                <span className="logo-sub">hulpmiddelen</span>
              </div>
            </div>
          )}
        </div>
        <h2 className="header-headline">Vandaag nog het juiste speciale zorgbed.</h2>
        <p className="header-intro">
          Vul hieronder eenvoudig de gegevens in — wij regelen de rest.
        </p>
      </header>

      <div className="usp-bar">
        {['Proefplaatsing', 'Verhuur', 'Levering binnen 24 uur'].map((t) => (
          <div className="usp-item" key={t}>
            <span className="usp-check">✓</span>
            {t}
          </div>
        ))}
      </div>

      <div className="process-bar">
        <div className="process-step">
          <div className="process-icon">?</div>
          <span>Zorgvraag</span>
        </div>
        <span className="process-arrow">→</span>
        <div className="process-step">
          <div className="process-icon">🛏</div>
          <span>Passende oplossing</span>
        </div>
        <span className="process-arrow">→</span>
        <div className="process-step">
          <div className="process-icon">🚚</div>
          <span>Vandaag nog inzetbaar</span>
        </div>
      </div>
    </>
  );
}
