import { z } from 'zod';

const nlPhone = /^(\+31|0)[0-9]{9}$/;

export const orderSchema = z.object({
  // Sectie 1 – Aanmelder
  aanmelder_naam: z.string().min(2, 'Naam is verplicht'),
  aanmelder_afdeling: z.string().min(1, 'Afdeling is verplicht'),
  aanmelder_telefoon: z.string().regex(nlPhone, 'Voer een geldig Nederlands telefoonnummer in'),

  // Sectie 2 – Afleverinformatie
  instelling_naam: z.string().min(2, 'Naam instelling is verplicht'),
  aflever_straat: z.string().min(2, 'Straat + huisnummer is verplicht'),
  aflever_postcode: z.string().regex(/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/, 'Ongeldige postcode'),
  aflever_stad: z.string().min(2, 'Stad is verplicht'),
  aflever_afdeling: z.string().optional(),
  contact_naam: z.string().min(2, 'Contactpersoon is verplicht'),
  contact_telefoon: z.string().regex(nlPhone, 'Voer een geldig Nederlands telefoonnummer in'),
  contact_email: z.string().email('Voer een geldig e-mailadres in'),

  // Sectie 3 – Patiëntgegevens (minstens één verplicht)
  patient_naam: z.string().optional(),
  patient_nummer: z.string().optional(),
  patient_geboortedatum: z.string().optional(),
  patient_kamernummer: z.string().optional(),

  // Sectie 4 – Factuurinformatie
  factuur_instelling: z.string().min(2, 'Naam instelling is verplicht'),
  factuur_adres: z.string().min(5, 'Factuuradres is verplicht'),
  factuur_email: z.string().email('Voer een geldig e-mailadres in'),
  factuur_referentie: z.string().min(1, 'Referentie is verplicht'),

  // Sectie 5 – Bedkeuze
  bed_keuze: z.string().min(1, 'Kies een zorgbed'),

  // Sectie 6 – Logistiek
  ingangsdatum: z.string().min(1, 'Ingangsdatum is verplicht'),
  lift_aanwezig: z.enum(['ja', 'nee'] as const, { message: 'Geef aan of er een lift aanwezig is' }),
  ruimte_toegankelijk: z.enum(['ja', 'nee'] as const, { message: 'Geef aan of de ruimte toegankelijk is' }),
  toelichting_toegankelijkheid: z.string().optional(),

  // Dealer tracking
  dealer_id: z.string().optional(),
}).superRefine((data, ctx) => {
  const hasPatientInfo =
    (data.patient_naam && data.patient_naam.trim()) ||
    (data.patient_nummer && data.patient_nummer.trim()) ||
    (data.patient_geboortedatum && data.patient_geboortedatum.trim()) ||
    (data.patient_kamernummer && data.patient_kamernummer.trim());

  if (!hasPatientInfo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vul minimaal één patiëntgegeven in',
      path: ['patient_naam'],
    });
  }

  if (data.ruimte_toegankelijk === 'nee' && !data.toelichting_toegankelijkheid?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Geef een toelichting over de toegankelijkheid',
      path: ['toelichting_toegankelijkheid'],
    });
  }
});

export type OrderFormData = z.infer<typeof orderSchema>;
