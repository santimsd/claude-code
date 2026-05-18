import { useState } from 'react';
import { Brain, AlertTriangle, Users, RotateCw, Shield, Weight } from 'lucide-react';
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';

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

interface BedOption {
  id: string;
  situation: string;
  situationColor: string;
  iconBg: string;
  icon: React.ReactNode;
  name: string;
  usps: string[];
  img?: string;
}

const BED_OPTIONS: BedOption[] = [
  {
    id: 'feelsafe',
    situation: 'Onrust / Dementie / Delier',
    situationColor: '#c2185b',
    iconBg: '#fce4ec',
    icon: <Brain size={22} strokeWidth={1.75} color="#c2185b" />,
    name: 'FeelSafe Go Tentbed',
    usps: ['Rust & veiligheid', 'Minder valgevaar', 'Geborgen gevoel'],
    img: '/beds/feelsafe.png',
  },
  {
    id: 'vloerbed',
    situation: 'Hoog valrisico',
    situationColor: '#1565c0',
    iconBg: '#e3f2fd',
    icon: <AlertTriangle size={22} strokeWidth={1.75} color="#1565c0" />,
    name: 'Vloerbed (Extra Laag)',
    usps: ['Veilig slapen', 'Minder valletsel', 'Comfortabel en laagdrempelig'],
    img: '/beds/vloerbed.png',
  },
  {
    id: 'koppelbed',
    situation: 'Nabijheid familie',
    situationColor: '#00695c',
    iconBg: '#e0f2f1',
    icon: <Users size={22} strokeWidth={1.75} color="#00695c" />,
    name: 'Koppelbed',
    usps: ['Samen slapen', 'Versterkt contact', 'Rust & geborgenheid'],
    img: '/beds/koppelbed.png',
  },
  {
    id: 'rollassist',
    situation: 'Hulp bij draaien / verplaatsen op bed',
    situationColor: '#e65100',
    iconBg: '#fff3e0',
    icon: <RotateCw size={22} strokeWidth={1.75} color="#e65100" />,
    name: 'RollAssist',
    usps: ['Comfortabel draaien/verplaatsen', 'Minder fysieke belasting', 'Snel beschikbaar'],
    img: '/beds/rollassist.png',
  },
  {
    id: 'cloudcuddle',
    situation: 'Prikkelgevoeligheid / Veilig slapen',
    situationColor: '#4a148c',
    iconBg: '#f3e5f5',
    icon: <Shield size={22} strokeWidth={1.75} color="#4a148c" />,
    name: 'CloudCuddle Maxx Mobiele Bedtent',
    usps: ['Geborgenheid', 'Minder prikkels', 'Mobiele oplossing'],
    img: '/beds/cloudcuddle.png',
  },
  {
    id: 'flexobed',
    situation: 'Obesitas / In-uit bed problematiek',
    situationColor: '#2e7d32',
    iconBg: '#e8f5e9',
    icon: <Weight size={22} strokeWidth={1.75} color="#2e7d32" />,
    name: 'Flexobed Bariatrisch Bed',
    usps: ['Zelfstandigheid', 'Minder zorgbelasting', 'Direct leverbaar'],
    img: '/beds/flexobed.png',
  },
];

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
        {BED_OPTIONS.map((opt) => (
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
              {opt.icon}
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
        ))}
      </div>
      {errors.bed_keuze && (
        <p className="bed-error">{errors.bed_keuze.message}</p>
      )}
    </section>
  );
}
