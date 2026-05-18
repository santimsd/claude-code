import { Moon, UserCheck, ShieldCheck, Truck, Wrench, Sparkles, QrCode } from 'lucide-react';

export default function BottomUSP() {
  return (
    <>
      <div className="bottom-usp-purple">
        <div className="bot-usp-item">
          <Moon size={28} strokeWidth={1.75} color="white" />
          <div className="bot-usp-label">Meer rust voor bewoner</div>
        </div>
        <div className="bot-usp-item">
          <UserCheck size={28} strokeWidth={1.75} color="white" />
          <div className="bot-usp-label">Minder werkdruk voor zorgpersoneel</div>
        </div>
        <div className="bot-usp-item">
          <ShieldCheck size={28} strokeWidth={1.75} color="white" />
          <div className="bot-usp-label">Veiligheid voorop</div>
        </div>
      </div>

      <div className="service-bar">
        <div className="svc-item">
          <Truck size={22} strokeWidth={1.75} color="#3d2b8e" className="svc-icon" />
          <div className="svc-text">
            <strong>Binnen 24 uur geleverd</strong>
            <span>Snel schakelen bij acute zorgvragen</span>
          </div>
        </div>
        <div className="svc-item">
          <Wrench size={22} strokeWidth={1.75} color="#3d2b8e" className="svc-icon" />
          <div className="svc-text">
            <strong>Installatie &amp; service</strong>
            <span>Vakkundige installatie en uitleg op locatie</span>
          </div>
        </div>
        <div className="svc-item">
          <Sparkles size={22} strokeWidth={1.75} color="#3d2b8e" className="svc-icon" />
          <div className="svc-text">
            <strong>Onderhoud &amp; reiniging</strong>
            <span>Volledige ontzorging, altijd hygiënisch</span>
          </div>
        </div>
        <div className="svc-item">
          <QrCode size={22} strokeWidth={1.75} color="#3d2b8e" className="svc-icon" />
          <div className="svc-text">
            <strong>Eenvoudig aanvragen via QR code</strong>
            <span>Direct een proefplaatsing of offerte aanvragen</span>
          </div>
        </div>
      </div>
    </>
  );
}
