import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from './components/Header';
import FormField from './components/FormField';
import { brand } from './brand';

// Afmelden = zorgbed retour melden. Geen opslag: dit formulier stuurt
// simpelweg een e-mail door naar Human Protection + de klant.
const afmeldSchema = z.object({
  referentie: z.string().min(1, 'Referentie is verplicht'),
  barcode: z.string().min(1, 'Barcode is verplicht'),
  afdeling: z.string().optional(),
  opmerking: z.string().optional(),
});
type AfmeldData = z.infer<typeof afmeldSchema>;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Afmelden() {
  const [status, setStatus] = useState<Status>('idle');
  const [submitError, setSubmitError] = useState('');

  // Referentie voorinvullen vanuit de link (?ref=...), geen persoonsgegevens.
  const params = new URLSearchParams(window.location.search);
  const refFromUrl = params.get('ref') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AfmeldData>({
    resolver: zodResolver(afmeldSchema),
    defaultValues: { referentie: refFromUrl },
  });

  const onSubmit = async (data: AfmeldData) => {
    setStatus('submitting');
    setSubmitError('');

    const payload = {
      ...data,
      afgemeld_op: new Date().toISOString(),
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

      const res = await fetch(`${supabaseUrl}/functions/v1/send-afmeld-email`, {
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
            <h2>Afmelding ontvangen!</h2>
            <p>Bedankt. Wij verwerken de retourmelding van het zorgbed.</p>
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
          <section className="form-section">
            <h3 className="section-title purple">Zorgbed afmelden</h3>
            <p className="section-note">
              Meld hieronder het zorgbed retour. Scan of vul de barcode van het bed in.
            </p>
            <div className="field-group">
              <FormField label="Referentie" required registration={register('referentie')} error={errors.referentie?.message} placeholder="Referentie uit de aanvraag" />
              <FormField label="Barcode zorgbed" required registration={register('barcode')} error={errors.barcode?.message} placeholder="Scan of typ de barcode" />
              <FormField label="Afdeling" registration={register('afdeling')} error={errors.afdeling?.message} placeholder="bijv. afdeling geriatrie" />
              <FormField label="Opmerking" registration={register('opmerking')} error={errors.opmerking?.message} as="textarea" placeholder="Optionele toelichting..." />
            </div>
          </section>

          <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
            {status === 'submitting' && <span className="spinner" />}
            {status === 'submitting' ? 'Bezig met versturen...' : '✉ Afmelding versturen'}
          </button>

          {status === 'error' && (
            <div className="submit-error">⚠️ {submitError}</div>
          )}
        </form>
      </div>
    </div>
  );
}
