import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Afmelding = zorgbed retour. Geen opslag: dit stuurt enkel een e-mail door
// naar Human Protection + het intake-adres van de klant.

// ─── TESTFASE ───────────────────────────────────────────────
// Zolang TEST_MODE aan staat gaan afmeldingen alleen naar het
// testadres. Voor go-live: TEST_MODE op false zetten.
const TEST_MODE = true;
// Resend gratis plan: mag alléén naar het Resend-accountadres mailen totdat
// het domein humanprotection.nl geverifieerd is. Daarom tijdelijk gmail.
const TEST_EMAIL = 'santimaasdam@gmail.com';
// ────────────────────────────────────────────────────────────

const HUMAN_PROTECTION_EMAIL = 'info@humanprotection.nl';

type BrandInfo = { name: string; tagline: string; footerNote: string; primary: string; secondary: string };
const DEFAULT_BRAND: BrandInfo = {
  name: 'AZ Maria Middelares',
  tagline: 'Aan- en afmeldapplicatie zorgbedden',
  footerNote: 'AZ Maria Middelares · Aan- en afmeldapplicatie zorgbedden',
  primary: '#4878a1',
  secondary: '#023778',
};

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
    const fromAddress = Deno.env.get('EMAIL_FROM') ?? 'AZ Maria Middelares <noreply@humanprotection.nl>';
    const klantEmail = Deno.env.get('RECIPIENT_EMAIL') ?? '';
    const recipients = TEST_MODE
      ? [TEST_EMAIL]
      : [HUMAN_PROTECTION_EMAIL, ...(klantEmail ? [klantEmail] : [])];

    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'E-mailservice niet geconfigureerd.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `Afmelding zorgbed – ref. ${data.referentie ?? '-'} – barcode ${data.barcode ?? '-'}`;
    const html = buildAfmeldHtml(data, brand);

    for (const to of recipients) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromAddress, to: [to], subject, html }),
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

function buildAfmeldHtml(d: Record<string, string>, brand: BrandInfo) {
  const { primary, secondary } = brand;
  const dt = new Date(d.afgemeld_op ?? Date.now());
  const datum = dt.toLocaleDateString('nl-BE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const tijd = dt.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f5f8;margin:0;padding:20px;">
<table style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td colspan="2" style="background:${secondary};padding:24px 28px;">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:900;">${brand.name}</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Afmelding zorgbed</p>
  </td></tr>
  <tr><td colspan="2" style="padding:18px 28px 4px;border-bottom:1px solid #e5e7eb;">
    <p style="margin:0;color:#6b7280;font-size:13px;">Afgemeld op ${datum} om ${tijd}</p>
  </td></tr>
  <table style="width:100%;border-collapse:collapse;">
    ${row('Referentie', d.referentie, secondary)}
    ${row('Barcode', `<strong style="color:${secondary};">${d.barcode ?? '-'}</strong>`, secondary)}
    ${row('Afdeling', d.afdeling, secondary)}
    ${row('Opmerking', d.opmerking, secondary)}
  </table>
  <tr><td colspan="2" style="background:#f4f5f8;padding:16px 28px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#6b7280;">${brand.footerNote}<br/>Dit bericht is automatisch gegenereerd.</p>
  </td></tr>
</table>
</body></html>`;
}
