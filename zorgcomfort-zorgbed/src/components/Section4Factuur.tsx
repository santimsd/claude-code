import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';
import FormField from './FormField';

interface Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

export default function Section4Factuur({ register, errors }: Props) {
  return (
    <section className="form-section">
      <h3 className="section-title green">6. Factuurinformatie</h3>
      <div className="field-group">
        <FormField label="Naam instelling (factuur)" required registration={register('factuur_instelling')} error={errors.factuur_instelling?.message} placeholder="Officiële naam voor op de factuur" />
        <FormField label="Factuuradres" required registration={register('factuur_adres')} error={errors.factuur_adres?.message} placeholder="Straat, huisnummer, postcode, stad" />
        <FormField label="Factuur e-mailadres" required registration={register('factuur_email')} error={errors.factuur_email?.message} placeholder="crediteuren@instelling.nl" type="email" />
        <FormField
          label="Referentie"
          required
          registration={register('factuur_referentie')}
          error={errors.factuur_referentie?.message}
          placeholder="bijv. KP-2025-0042"
          hint="Bijv. kostenplaats of inkoopordernummer, afhankelijk van uw organisatie"
        />
      </div>
    </section>
  );
}
