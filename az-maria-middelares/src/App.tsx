import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema } from './lib/schema';
import type { OrderFormData } from './lib/schema';
import Header from './components/Header';
import Section1Aanmelder from './components/Section1Aanmelder';
import Section2Aflever from './components/Section2Aflever';
import Section3Patient from './components/Section3Patient';
import Section5Bedkeuze from './components/Section5Bedkeuze';
import Section6Logistiek from './components/Section6Logistiek';
import BottomUSP from './components/BottomUSP';
import { brand } from './brand';

// Naam-lookup afgeleid uit de productcatalogus van het actieve merk,
// zodat de e-mail de juiste productnaam toont bij de gekozen id.
const BED_NAMES: Record<string, string> = Object.fromEntries(
  brand.products.map((p) => [p.id, p.name]),
);

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      dealer_id: import.meta.env.VITE_DEALER_ID ?? '',
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    setStatus('submitting');
    setSubmitError('');

    const payload = {
      ...data,
      bed_naam: BED_NAMES[data.bed_keuze] ?? data.bed_keuze,
      ingediend_op: new Date().toISOString(),
      // Basis-URL van deze site meesturen voor de afmeldlink in de e-mails.
      site_url: window.location.origin,
      // Merkinfo meesturen zodat de e-mail dezelfde branding krijgt.
      brand: {
        id: brand.id,
        name: brand.email.fromName,
        tagline: brand.tagline,
        footerNote: brand.email.footerNote,
        primary: brand.colors.primary,
        secondary: brand.colors.secondary,
      },
    };

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuratie ontbreekt.');
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Server fout (${res.status})`);
      }

      setStatus('success');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Er is een fout opgetreden. Probeer het opnieuw.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="app-wrapper">
        <Header />
        <div className="form-container">
          <div className="success-screen">
            <div className="success-check">✓</div>
            <h2>Aanvraag ontvangen!</h2>
            <p>
              Bedankt voor uw aanvraag! Wij nemen zo snel mogelijk contact met u op.<br /><br />
              <strong>Binnen 4 uur geleverd en inzetbaar.</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Header />
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" {...register('dealer_id')} />

          <Section5Bedkeuze register={register} errors={errors} watch={watch} />
          <Section6Logistiek register={register} errors={errors} watch={watch} />
          <Section1Aanmelder register={register} errors={errors} />
          <Section2Aflever register={register} errors={errors} />
          <Section3Patient register={register} errors={errors} />

          <BottomUSP />

          <button
            type="submit"
            className="submit-btn"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' && <span className="spinner" />}
            {status === 'submitting' ? 'Bezig met versturen...' : '✉ Aanvraag versturen'}
          </button>

          {status === 'error' && (
            <div className="submit-error">
              ⚠️ {submitError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
