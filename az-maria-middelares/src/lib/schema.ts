import { z } from 'zod';

// Belgisch (+32) én Nederlands (+31) telefoonnummer toestaan,
// of nationaal formaat beginnend met 0. Spaties en streepjes mogen.
const phone = /^(\+31|\+32|0)[0-9 \-]{8,13}$/;

export const orderSchema = z.object({
  // Referentie — belangrijk, apart veld
  referentie: z.string().min(1, 'Referentie is verplicht'),

  // Sectie – Aanmelder
  aanmelder_naam: z.string().min(2, 'Naam is verplicht'),
  aanmelder_afdeling: z.string().min(1, 'Afdeling is verplicht'),
  aanmelder_telefoon: z.string().regex(phone, 'Voer een geldig telefoonnummer in'),

  // Sectie – Afleverinformatie (ingekort: naam, afdeling, contactpersoon, telefoon, e-mail)
  instelling_naam: z.string().min(2, 'Naam is verplicht'),
  aflever_afdeling: z.string().min(1, 'Afdeling is verplicht'),
  contact_naam: z.string().min(2, 'Contactpersoon is verplicht'),
  contact_telefoon: z.string().regex(phone, 'Voer een geldig telefoonnummer in'),
  contact_email: z.string().email('Voer een geldig e-mailadres in'),

  // Sectie – Patiëntgegevens (AVG: minstens één van de vier volstaat)
  patient_naam: z.string().optional(),
  patient_nummer: z.string().optional(),
  patient_geboortedatum: z.string().optional(),
  patient_kamernummer: z.string().optional(),

  // Sectie – Bedkeuze (alleen FeelSafe Pro)
  bed_keuze: z.string().min(1, 'Kies een zorgbed'),

  // Sectie – Logistiek
  ingangsdatum: z.string().min(1, 'Ingangsdatum is verplicht'),
  lift_aanwezig: z.enum(['ja', 'nee'] as const, { message: 'Geef aan of er een lift aanwezig is' }),
  lift_lengte: z.string().optional(),
  lift_breedte: z.string().optional(),
  lift_hoogte: z.string().optional(),
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
