import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';
import FormField from './FormField';

interface Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}

export default function Section2Aflever({ register, errors }: Props) {
  return (
    <section className="form-section">
      <h3 className="section-title green">4. Afleverinformatie</h3>
      <div className="field-group">
        <FormField label="Naam" required registration={register('instelling_naam')} error={errors.instelling_naam?.message} placeholder="bijv. AZ Maria Middelares" />
        <FormField label="Afdeling" required registration={register('aflever_afdeling')} error={errors.aflever_afdeling?.message} placeholder="bijv. afdeling geriatrie" />
        <FormField label="Contactpersoon" required registration={register('contact_naam')} error={errors.contact_naam?.message} placeholder="Voor- en achternaam" />
        <div className="field-row">
          <FormField label="Telefoonnummer" required registration={register('contact_telefoon')} error={errors.contact_telefoon?.message} placeholder="+32 9 246 26 23" type="tel" />
          <FormField label="E-mailadres" required registration={register('contact_email')} error={errors.contact_email?.message} placeholder="naam@mariamiddelares.be" type="email" />
        </div>
      </div>
    </section>
  );
}
