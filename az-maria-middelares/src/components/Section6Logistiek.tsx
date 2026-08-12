import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { OrderFormData } from '../lib/schema';
import FormField from './FormField';

interface Props {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
}

export default function Section6Logistiek({ register, errors, watch }: Props) {
  const lift = watch('lift_aanwezig');
  const toegankelijk = watch('ruimte_toegankelijk');

  return (
    <section className="form-section">
      <h3 className="section-title green">2. Logistieke vragen</h3>
      <div className="field-group">
        <FormField
          label="Ingangsdatum huur"
          required
          registration={register('ingangsdatum')}
          error={errors.ingangsdatum?.message}
          type="date"
        />

        <div className="field">
          <label>Is er een lift aanwezig?<span className="req">*</span></label>
          <div className="radio-group">
            <label className="radio-opt">
              <input type="radio" value="ja" {...register('lift_aanwezig')} />
              <span>Ja</span>
            </label>
            <label className="radio-opt">
              <input type="radio" value="nee" {...register('lift_aanwezig')} />
              <span>Nee</span>
            </label>
          </div>
          {errors.lift_aanwezig && <span className="field-error">{errors.lift_aanwezig.message}</span>}
          {lift === 'nee' && (
            <div className="warning-box">
              ⚠️ Let op: bij afwezigheid van een lift kunnen extra leveringskosten van toepassing zijn.
            </div>
          )}
        </div>

        {lift === 'ja' && (
          <div className="field">
            <label>Afmetingen lift (in cm)</label>
            <div className="field-row">
              <FormField
                label="Lengte"
                registration={register('lift_lengte')}
                error={errors.lift_lengte?.message}
                placeholder="bijv. 210"
                type="number"
              />
              <FormField
                label="Breedte"
                registration={register('lift_breedte')}
                error={errors.lift_breedte?.message}
                placeholder="bijv. 110"
                type="number"
              />
              <FormField
                label="Hoogte"
                registration={register('lift_hoogte')}
                error={errors.lift_hoogte?.message}
                placeholder="bijv. 220"
                type="number"
              />
            </div>
          </div>
        )}

        <div className="field">
          <label>Is de ruimte goed toegankelijk voor bezorging?<span className="req">*</span></label>
          <div className="radio-group">
            <label className="radio-opt">
              <input type="radio" value="ja" {...register('ruimte_toegankelijk')} />
              <span>Ja</span>
            </label>
            <label className="radio-opt">
              <input type="radio" value="nee" {...register('ruimte_toegankelijk')} />
              <span>Nee</span>
            </label>
          </div>
          {errors.ruimte_toegankelijk && <span className="field-error">{errors.ruimte_toegankelijk.message}</span>}
        </div>

        {toegankelijk === 'nee' && (
          <FormField
            label="Toelichting toegankelijkheid"
            required
            registration={register('toelichting_toegankelijkheid')}
            error={errors.toelichting_toegankelijkheid?.message}
            as="textarea"
            placeholder="Beschrijf de belemmeringen voor bezorging..."
          />
        )}
      </div>
    </section>
  );
}
