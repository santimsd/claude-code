import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const recipientEmail = Deno.env.get('RECIPIENT_EMAIL') ?? 'info@kerstenhulpmiddelen.nl';

    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'E-mailservice niet geconfigureerd.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `Nieuwe aanvraag zorgbed – ${data.bed_naam ?? data.bed_keuze} – ${data.instelling_naam} – ${data.aanmelder_naam}`;
    const html = buildEmailHtml(data);

    // Stuur bevestigingsmail naar contactpersoon
    const emails = [
      { to: recipientEmail, subject, html },
    ];

    if (data.contact_email) {
      emails.push({
        to: data.contact_email,
        subject: `Bevestiging aanvraag zorgbed – ${data.bed_naam ?? data.bed_keuze}`,
        html: buildConfirmationHtml(data),
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
          from: 'Kersten Hulpmiddelen <noreply@kerstenhulpmiddelen.nl>',
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

function row(label: string, value: string | undefined) {
  if (!value) return '';
  return `<tr>
    <td style="padding:6px 12px;font-weight:700;color:#3d2b8e;width:200px;vertical-align:top;">${label}</td>
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

function buildEmailHtml(d: Record<string, string>) {
  const dt = new Date(d.ingediend_op ?? Date.now());
  const datum = dt.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const tijd = dt.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f5f8;margin:0;padding:20px;">
<table style="max-width:680px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr><td colspan="2" style="background:#3d2b8e;padding:24px 28px;">
    <h1 style="margin:0;color:#78be20;font-size:22px;font-weight:900;">Kersten Hulpmiddelen</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Het draait om mensen.</p>
  </td></tr>
  <!-- Titel -->
  <tr><td colspan="2" style="padding:20px 28px 8px;border-bottom:1px solid #e5e7eb;">
    <h2 style="margin:0;color:#1a1a2e;font-size:18px;">Nieuwe Zorgbed Aanvraag</h2>
    <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">Ingediend op ${datum} om ${tijd}</p>
  </td></tr>

  <table style="width:100%;border-collapse:collapse;">
    ${section('#3d2b8e', '#3d2b8e', `
      ${row('Aanmelder', d.aanmelder_naam)}
      ${row('Afdeling', d.aanmelder_afdeling)}
      ${row('Telefoon aanmelder', d.aanmelder_telefoon)}
    `)}
    ${section('Afleverinformatie', '#78be20', `
      ${row('Instelling', d.instelling_naam)}
      ${row('Adres', `${d.aflever_straat}, ${d.aflever_postcode} ${d.aflever_stad}`)}
      ${d.aflever_afdeling ? row('Afdeling/locatie', d.aflever_afdeling) : ''}
      ${row('Contactpersoon', d.contact_naam)}
      ${row('Telefoon contact', d.contact_telefoon)}
      ${row('E-mail contact', d.contact_email)}
    `)}
    ${section('Patiëntgegevens', '#3d2b8e', `
      ${row('Naam patiënt', d.patient_naam)}
      ${row('Patiëntennummer', d.patient_nummer)}
      ${row('Geboortedatum', d.patient_geboortedatum)}
      ${row('Kamernummer', d.patient_kamernummer)}
    `)}
    ${section('Factuurinformatie', '#78be20', `
      ${row('Instelling (factuur)', d.factuur_instelling)}
      ${row('Factuuradres', d.factuur_adres)}
      ${row('Factuur e-mail', d.factuur_email)}
      ${row('Referentie', d.factuur_referentie)}
    `)}
    ${section('Bedkeuze', '#3d2b8e', `
      ${row('Gekozen bed', `<strong style="color:#3d2b8e;">${d.bed_naam ?? d.bed_keuze}</strong>`)}
    `)}
    ${section('Logistiek', '#78be20', `
      ${row('Ingangsdatum huur', d.ingangsdatum)}
      ${row('Lift aanwezig', d.lift_aanwezig === 'ja' ? '✅ Ja' : '❌ Nee')}
      ${row('Ruimte toegankelijk', d.ruimte_toegankelijk === 'ja' ? '✅ Ja' : '❌ Nee')}
      ${row('Toelichting', d.toelichting_toegankelijkheid)}
      ${d.dealer_id ? row('Dealer ID', d.dealer_id) : ''}
    `)}
  </table>

  <!-- Footer -->
  <tr><td colspan="2" style="background:#f4f5f8;padding:16px 28px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#6b7280;">Kersten Hulpmiddelen · Het draait om mensen.<br/>
    Dit bericht is automatisch gegenereerd.</p>
  </td></tr>
</table>
</body></html>`;
}

function buildConfirmationHtml(d: Record<string, string>) {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f5f8;margin:0;padding:20px;">
<table style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td style="background:#3d2b8e;padding:24px 28px;">
    <h1 style="margin:0;color:#78be20;font-size:20px;font-weight:900;">Kersten Hulpmiddelen</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Het draait om mensen.</p>
  </td></tr>
  <tr><td style="padding:24px 28px;">
    <h2 style="color:#3d2b8e;margin-top:0;">Bedankt voor uw aanvraag, ${d.contact_naam}!</h2>
    <p style="color:#1a1a2e;">Wij hebben uw aanvraag voor een <strong>${d.bed_naam ?? d.bed_keuze}</strong> ontvangen voor <strong>${d.instelling_naam}</strong>.</p>
    <p style="color:#1a1a2e;">Wij nemen zo snel mogelijk contact met u op.</p>
    <div style="background:#f0f4ff;border-left:4px solid #78be20;padding:14px 18px;border-radius:0 8px 8px 0;margin:20px 0;">
      <strong style="color:#3d2b8e;">Vandaag aangevraagd = vandaag nog inzetbaar.</strong>
    </div>
    <p style="color:#6b7280;font-size:13px;">Heeft u vragen? Neem contact op met Kersten Hulpmiddelen.</p>
  </td></tr>
  <tr><td style="background:#f4f5f8;padding:14px 28px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#6b7280;">Kersten Hulpmiddelen · Het draait om mensen.</p>
  </td></tr>
</table>
</body></html>`;
}
