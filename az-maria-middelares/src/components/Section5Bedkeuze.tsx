import { useState } from 'react';
import {
  Brain, AlertTriangle, Users, RotateCw, Shield, Weight,
  BedDouble, Heart, Activity, Accessibility,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';
import { brand } from '../brand';

// Icoon-register: koppelt een icoonnaam uit brand.ts aan een Lucide-component.
const ICONS: Record<string, LucideIcon> = {
  Brain, AlertTriangle, Users, RotateCw, Shield, Weight,
  BedDouble, Heart, Activity, Accessibility,
};

function BedImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className="bed-img"><span>Afbeelding volgt</span></div>;
  }
  return (
    <div className="bed-img">
      <img src={src} alt={alt} onError={() => setFailed(true)} />
    </div>
  );
}

interface Props {
  register: UseFormRegister<OrderFormData>;
}

// Er is één zorgbed (FeelSafe Pro) — geen keuzemenu, maar een vast
// info-blok. De bedkeuze wordt automatisch meegestuurd via een hidden veld.
export default function Section5Bedkeuze({ register }: Props) {
  const bed = brand.products[0];
  const Icon = ICONS[bed.icon] ?? BedDouble;

  return (
    <section className="form-section">
      <h3 className="section-title purple">1. Het zorgbed</h3>
      <input type="hidden" {...register('bed_keuze')} />
      <div className="bed-grid">
        <div className="bed-card selected bed-card-static">
          <div className="bed-icon-circle" style={{ background: bed.iconBg }}>
            <Icon size={22} strokeWidth={1.75} color={bed.situationColor} />
          </div>
          <div className="bed-situation" style={{ color: bed.situationColor }}>
            {bed.situation}
          </div>
          <BedImage src={bed.img} alt={bed.name} />
          <div className="bed-name">{bed.name}</div>
          <ul className="bed-usps">
            {bed.usps.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
