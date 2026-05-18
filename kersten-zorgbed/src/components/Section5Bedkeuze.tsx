import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';

interface BedOption {
  id: string;
  situation: string;
  situationColor: string;
  iconBg: string;
  icon: string;
  name: string;
  usps: string[];
}

const BED_OPTIONS: BedOption[] = [
  {
    id: 'feelsafe',
    situation: 'Onrust / Dementie / Delier',
    situationColor: '#c2185b',
    iconBg: '#fce4ec',
    icon: '🧠',
    name: 'FeelSafe Go Tentbed',
    usps: ['Rust & veiligheid', 'Minder valgevaar', 'Geborgen gevoel'],
  },
  {
    id: 'vloerbed',
    situation: 'Hoog valrisico',
    situationColor: '#1565c0',
    iconBg: '#e3f2fd',
    icon: '🏃',
    name: 'Vloerbed (Extra Laag)',
    usps: ['Veilig slapen', 'Minder valletsel', 'Comfortabel en laagdrempelig'],
  },
  {
    id: 'koppelbed',
    situation: 'Nabijheid familie',
    situationColor: '#00695c',
    iconBg: '#e0f2f1',
    icon: '👨‍👩‍👧',
    name: 'Koppelbed',
    usps: ['Samen slapen', 'Versterkt contact', 'Rust & geborgenheid'],
  },
  {
    id: 'rollassist',
    situation: 'Hulp bij draaien / verplaatsen op bed',
    situationColor: '#e65100',
    iconBg: '#fff3e0',
    icon: '♿',
    name: 'RollAssist',
    usps: ['Comfortabel draaien/verplaatsen', 'Minder fysieke belasting', 'Snel beschikbaar'],
  },
  {
    id: 'cloudcuddle',
    situation: 'Prikkelgevoeligheid / Veilig slapen',
    situationColor: '#4a148c',
    iconBg: '#f3e5f5',
    icon: '🛡',
    name: 'CloudCuddle Maxx Mobiele Bedtent',
    usps: ['Geborgenheid', 'Minder prikkels', 'Mobiele oplossing'],
  },
  {
    id: 'flexobed',
    situation: 'Obesitas / In-uit bed problematiek',
    situationColor: '#2e7d32',
    iconBg: '#e8f5e9',
    icon: '⚖️',
    name: 'Flexobed Bariatrisch Bed',
    usps: ['Zelfstandigheid', 'Minder zorgbelasting', 'Direct leverbaar'],
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
      <h3 className="section-title purple">5. Welke zorgsituatie speelt er?</h3>
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
            <div className="bed-img">
              <span>Afbeelding volgt</span>
            </div>
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
