import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';
import FormField from './FormField';

interface Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

export default function Section3Patient({ register, errors }: Props) {
  return (
    <section className="form-section">
      <h3 className="section-title purple">5. Patiëntgegevens</h3>
      <p className="section-note">
        Conform AVG volstaat één gegeven — vul in wat van toepassing is. Minimaal één veld is verplicht.
      </p>
      <div className="field-group">
        <div className="field-row">
          <FormField label="Naam" registration={register('patient_naam')} error={errors.patient_naam?.message} placeholder="Naam patiënt" />
          <FormField label="Patiëntennummer" registration={register('patient_nummer')} error={errors.patient_nummer?.message} placeholder="bijv. P-00123" />
        </div>
        <div className="field-row">
          <FormField label="Geboortedatum" registration={register('patient_geboortedatum')} error={errors.patient_geboortedatum?.message} type="date" />
          <FormField label="Kamernummer" registration={register('patient_kamernummer')} error={errors.patient_kamernummer?.message} placeholder="bijv. 14" />
        </div>
      </div>
    </section>
  );
}
