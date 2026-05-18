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
      <h3 className="section-title green">2. Afleverinformatie</h3>
      <div className="field-group">
        <FormField label="Naam instelling" required registration={register('instelling_naam')} error={errors.instelling_naam?.message} placeholder="bijv. Zorgcentrum De Lindenhof" />
        <FormField label="Straat + huisnummer" required registration={register('aflever_straat')} error={errors.aflever_straat?.message} placeholder="Kerkstraat 12" />
        <div className="field-row">
          <FormField label="Postcode" required registration={register('aflever_postcode')} error={errors.aflever_postcode?.message} placeholder="1234 AB" />
          <FormField label="Stad" required registration={register('aflever_stad')} error={errors.aflever_stad?.message} placeholder="Amsterdam" />
        </div>
        <FormField label="Afdeling / locatie binnen gebouw" registration={register('aflever_afdeling')} error={errors.aflever_afdeling?.message} placeholder="bijv. verdieping 2, kamer 14" />
        <FormField label="Contactpersoon ter plaatse" required registration={register('contact_naam')} error={errors.contact_naam?.message} placeholder="Voor- en achternaam" />
        <div className="field-row">
          <FormField label="Telefoonnummer contactpersoon" required registration={register('contact_telefoon')} error={errors.contact_telefoon?.message} placeholder="06-12345678" type="tel" />
          <FormField label="E-mailadres contactpersoon" required registration={register('contact_email')} error={errors.contact_email?.message} placeholder="naam@instelling.nl" type="email" />
        </div>
      </div>
    </section>
  );
}
