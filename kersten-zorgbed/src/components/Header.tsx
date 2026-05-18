export default function Header() {
  return (
    <>
      <header className="site-header">
        <div className="logo-wrapper">
          <img
            src="/logo.png"
            alt="Kersten hulpmiddelen"
            className="logo-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
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
