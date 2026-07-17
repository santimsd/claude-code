import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';
import FormField from './FormField';

interface Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

export default function Section1Aanmelder({ register, errors }: Props) {
  return (
    <section className="form-section">
      <h3 className="section-title purple">3. Aanmelder</h3>
      <div className="field-group">
        <FormField label="Referentie" required registration={register('referentie')} error={errors.referentie?.message} placeholder="bijv. dossier- of besteldnummer" />
        <FormField label="Naam aanmelder" required registration={register('aanmelder_naam')} error={errors.aanmelder_naam?.message} placeholder="Voor- en achternaam" />
        <FormField label="Afdeling / woning" required registration={register('aanmelder_afdeling')} error={errors.aanmelder_afdeling?.message} placeholder="bijv. Afdeling 3B" />
        <FormField label="Telefoonnummer aanmelder" required registration={register('aanmelder_telefoon')} error={errors.aanmelder_telefoon?.message} placeholder="06-12345678" type="tel" />
      </div>
    </section>
  );
}
