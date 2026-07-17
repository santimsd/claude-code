import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Merk-fallbacks ──
// De frontend stuurt een `brand`-object mee in de payload. Ontbreekt dat
// (of losse velden), dan vallen we terug op deze standaardwaarden.
type BrandInfo = {
  name: string;
  tagline: string;
  footerNote: string;
  primary: string;
  secondary: string;
};

const DEFAULT_BRAND: BrandInfo = {
  name: 'AZ Maria Middelares',
  tagline: 'Aan- en afmeldapplicatie zorgbedden',
  footerNote: 'AZ Maria Middelares · Aan- en afmeldapplicatie zorgbedden',
  primary: '#1a9d8f',
  secondary: '#003a5d',
};

// Vast intake-adres van Human Protection (altijd meesturen).
const HUMAN_PROTECTION_EMAIL = 'info@humanprotection.nl';

function resolveBrand(raw: unknown): BrandInfo {
  const b = (raw ?? {}) as Partial<BrandInfo>;
  return {
    name: b.name ?? DEFAULT_BRAND.name,
    tagline: b.tagline ?? DEFAULT_BRAND.tagline,
    footerNote: b.footerNote ?? DEFAULT_BRAND.footerNote,
    primary: b.primary ?? DEFAULT_BRAND.primary,
    secondary: b.secondary ?? DEFAULT_BRAND.secondary,
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const brand = resolveBrand(data.brand);
    const resendKey = Deno.env.get('RESEND_API_KEY');
    // Afzender instelbaar via env (moet een geverifieerd Resend-domein zijn).
    const fromAddress = Deno.env.get('EMAIL_FROM') ?? 'AZ Maria Middelares <noreply@humanprotection.nl>';

    // Twee intake-ontvangers: Human Protection + het adres van de klant (via env).
    // KLANT_EMAIL = het vaste intake-adres van AZ Maria Middelares.
    const klantEmail = Deno.env.get('RECIPIENT_EMAIL') ?? '';
    const intakeRecipients = [HUMAN_PROTECTION_EMAIL, ...(klantEmail ? [klantEmail] : [])];

    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'E-mailservice niet geconfigureerd.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `Nieuwe aanvraag FeelSafe Pro – ${data.instelling_naam} – ref. ${data.referentie ?? '-'}`;
    const html = buildEmailHtml(data, brand);

    // Intake-notificatie naar beide backend-adressen.
    const emails = intakeRecipients.map((to) => ({ to, subject, html }));

    // Bevestiging naar de contactpersoon.
    // TODO (backend-fase): afmeldlink met barcode-veld + reminder na 5 dagen.
    //   Vereist opslag van de aanvraag (Supabase-tabel) + geplande functie.
    if (data.contact_email) {
      emails.push({
        to: data.contact_email,
        subject: `Bevestiging aanvraag FeelSafe Pro – ${data.instelling_naam}`,
        html: buildConfirmationHtml(data, brand),
      });
    }

    for (const mail of emails) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [mail.to],
          subject: mail.subject,
          html: mail.html,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Resend error:', err);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Interne fout bij verwerking.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function row(label: string, value: string | undefined, color: string) {
  if (!value) return '';
  return `<tr>
    <td style="padding:6px 12px;font-weight:700;color:${color};width:200px;vertical-align:top;">${label}</td>
    <td style="padding:6px 12px;color:#1a1a2e;">${value}</td>
  </tr>`;
}

function section(title: string, color: string, rows: string) {
  return `
  <tr><td colspan="2" style="padding:14px 12px 4px;">
    <h3 style="margin:0;font-size:14px;font-weight:900;color:${color};text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid ${color};padding-bottom:4px;">${title}</h3>
  </td></tr>
  ${rows}
  `;
}

function buildEmailHtml(d: Record<string, string>, brand: BrandInfo) {
  const primary = brand.primary;
  const secondary = brand.secondary;
  const dt = new Date(d.ingediend_op ?? Date.now());
  const datum = dt.toLocaleDateString('nl-BE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const tijd = dt.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f5f8;margin:0;padding:20px;">
<table style="max-width:680px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr><td colspan="2" style="background:${secondary};padding:24px 28px;">
    <h1 style="margin:0;color:${primary};font-size:22px;font-weight:900;">${brand.name}</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">${brand.tagline}</p>
  </td></tr>
  <!-- Titel -->
  <tr><td colspan="2" style="padding:20px 28px 8px;border-bottom:1px solid #e5e7eb;">
    <h2 style="margin:0;color:#1a1a2e;font-size:18px;">Nieuwe aanvraag FeelSafe Pro tentbed</h2>
    <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">Ingediend op ${datum} om ${tijd}</p>
  </td></tr>

  <table style="width:100%;border-collapse:collapse;">
    ${section('Aanmelder', secondary, `
      ${row('Referentie', d.referentie, secondary)}
      ${row('Aanmelder', d.aanmelder_naam, secondary)}
      ${row('Afdeling', d.aanmelder_afdeling, secondary)}
      ${row('Telefoon aanmelder', d.aanmelder_telefoon, secondary)}
    `)}
    ${section('Afleverinformatie', primary, `
      ${row('Naam', d.instelling_naam, secondary)}
      ${row('Afdeling', d.aflever_afdeling, secondary)}
      ${row('Contactpersoon', d.contact_naam, secondary)}
      ${row('Telefoon', d.contact_telefoon, secondary)}
      ${row('E-mail', d.contact_email, secondary)}
    `)}
    ${section('Patiëntgegevens', secondary, `
      ${row('Naam', d.patient_naam, secondary)}
      ${row('Patiëntennummer', d.patient_nummer, secondary)}
      ${row('Geboortedatum', d.patient_geboortedatum, secondary)}
      ${row('Kamernummer', d.patient_kamernummer, secondary)}
    `)}
    ${section('Bedkeuze', secondary, `
      ${row('Gekozen bed', `<strong style="color:${secondary};">${d.bed_naam ?? d.bed_keuze}</strong>`, secondary)}
    `)}
    ${section('Logistiek', primary, `
      ${row('Ingangsdatum huur', d.ingangsdatum, secondary)}
      ${row('Lift aanwezig', d.lift_aanwezig === 'ja' ? '✅ Ja' : '❌ Nee', secondary)}
      ${d.lift_afmetingen ? row('Afmetingen lift', d.lift_afmetingen, secondary) : ''}
      ${row('Ruimte toegankelijk', d.ruimte_toegankelijk === 'ja' ? '✅ Ja' : '❌ Nee', secondary)}
      ${row('Toelichting', d.toelichting_toegankelijkheid, secondary)}
    `)}
  </table>

  <!-- Footer -->
  <tr><td colspan="2" style="background:#f4f5f8;padding:16px 28px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#6b7280;">${brand.footerNote}<br/>
    Dit bericht is automatisch gegenereerd.</p>
  </td></tr>
</table>
</body></html>`;
}

function buildConfirmationHtml(d: Record<string, string>, brand: BrandInfo) {
  const primary = brand.primary;
  const secondary = brand.secondary;
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f5f8;margin:0;padding:20px;">
<table style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td style="background:${secondary};padding:24px 28px;">
    <h1 style="margin:0;color:${primary};font-size:20px;font-weight:900;">${brand.name}</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">${brand.tagline}</p>
  </td></tr>
  <tr><td style="padding:24px 28px;">
    <h2 style="color:${secondary};margin-top:0;">Bedankt voor uw aanvraag, ${d.contact_naam}!</h2>
    <p style="color:#1a1a2e;">Wij hebben uw aanvraag voor een <strong>${d.bed_naam ?? d.bed_keuze}</strong> ontvangen voor <strong>${d.instelling_naam}</strong> (referentie ${d.referentie ?? '-'}).</p>
    <p style="color:#1a1a2e;">Wij nemen zo snel mogelijk contact met u op.</p>
    <div style="background:#eef6f5;border-left:4px solid ${primary};padding:14px 18px;border-radius:0 8px 8px 0;margin:20px 0;">
      <strong style="color:${secondary};">Binnen 4 uur geleverd en inzetbaar.</strong>
    </div>
    <!-- TODO (backend-fase): afmeldlink met barcode-veld hier toevoegen. -->
    <p style="color:#6b7280;font-size:13px;">Heeft u vragen? Neem contact op met ${brand.name}.</p>
  </td></tr>
  <tr><td style="background:#f4f5f8;padding:14px 28px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#6b7280;">${brand.footerNote}</p>
  </td></tr>
</table>
</body></html>`;
}
