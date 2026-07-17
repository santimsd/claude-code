import { useState } from 'react';
import {
  Brain, AlertTriangle, Users, RotateCw, Shield, Weight,
  BedDouble, Heart, Activity, Accessibility,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';
import { brand } from '../brand';

// Icoon-register: koppelt een icoonnaam uit brand.ts aan een Lucide-component.
// Nieuw icoon nodig? Importeer het hierboven en voeg het hier toe.
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
  errors: FieldErrors<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
}

export default function Section5Bedkeuze({ register, errors, watch }: Props) {
  const selected = watch('bed_keuze');

  return (
    <section className="form-section">
      <h3 className="section-title purple">1. Welke zorgsituatie speelt er?</h3>
      <div className="bed-grid">
        {brand.products.map((opt) => {
          const Icon = ICONS[opt.icon] ?? BedDouble;
          return (
            <label
              key={opt.id}
              className={`bed-card${selected === opt.id ? ' selected' : ''}`}
              htmlFor={`bed-${opt.id}`}
            >
              <input
                type="radio"
                id={`bed-${opt.id}`}
                value={opt.id}
                {...register('bed_keuze')}
              />
              <div className="bed-icon-circle" style={{ background: opt.iconBg }}>
                <Icon size={22} strokeWidth={1.75} color={opt.situationColor} />
              </div>
              <div className="bed-situation" style={{ color: opt.situationColor }}>
                {opt.situation}
              </div>
              <BedImage src={opt.img} alt={opt.name} />
              <div className="bed-name">{opt.name}</div>
              <ul className="bed-usps">
                {opt.usps.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </label>
          );
        })}
      </div>
      {errors.bed_keuze && (
        <p className="bed-error">{errors.bed_keuze.message}</p>
      )}
    </section>
  );
}
