export default function Header() {
  return (
    <>
      <header className="site-header">
        <div className="logo-wrapper">
          {/* Klaver icoon als inline SVG in Kersten huisstijl */}
          <svg className="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="28" fill="#3d2b8e" opacity="0.9"/>
            <circle cx="65" cy="35" r="28" fill="#78be20" opacity="0.9"/>
            <circle cx="35" cy="65" r="28" fill="#3d2b8e" opacity="0.85"/>
            <circle cx="65" cy="65" r="28" fill="#3d2b8e" opacity="0.85"/>
            <rect x="47" y="55" width="6" height="28" rx="3" fill="#3d2b8e"/>
          </svg>
          <div className="logo-text-block">
            <h1>Kersten</h1>
            <span className="sub">hulpmiddelen</span>
          </div>
        </div>
        <p className="logo-tagline">Het draait om mensen.</p>
        <h2 className="header-headline">Vandaag nog het juiste speciale zorgbed.</h2>
        <p className="header-intro">
          Vul hieronder eenvoudig de gegevens in — wij regelen de rest.
        </p>
      </header>

      {/* USP balk */}
      <div className="usp-bar">
        {['Proefplaatsing', 'Verhuur', 'Levering binnen 24 uur'].map((t) => (
          <div className="usp-item" key={t}>
            <span className="usp-check">✓</span>
            {t}
          </div>
        ))}
      </div>

      {/* Proces balk */}
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
