import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { logError } from '@/lib/http';
import { signLeadId } from '@/lib/unsubscribe-signing';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * One-click unsubscribe for outreach recipients. The link is signed so it
 * can't be used to suppress arbitrary leads: sig = HMAC(leadId, secret).
 *
 * Marks the lead suppressed (enforced on every future send) and records an
 * `unsubscribed` event.
 */
export async function GET(req: Request) {
  const rl = checkRateLimit(req, 'unsubscribe', 30, 60_000);

  const url = new URL(req.url);
  const leadId = url.searchParams.get('leadId') || '';
  const sig = url.searchParams.get('sig') || '';

  if (!rl.ok) {
    return new NextResponse(renderPage('Too many requests', 'Please try again in a minute.'), {
      status: 429,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  if (!leadId || !UUID_RE.test(leadId) || !sig || !verifySignature(leadId, sig)) {
    return new NextResponse(
      renderPage('Invalid link', 'This unsubscribe link is invalid or has expired. Please reply to the original email instead.'),
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    logError('unsubscribe', new Error('Supabase not configured'));
    return new NextResponse(renderPage('Service unavailable', 'We could not process your request right now. Please try again later.'), {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Only flip the flag when the row exists; report honestly either way.
  const { data: lead } = await supabase.from('leads').select('id').eq('id', leadId).maybeSingle();

  if (!lead) {
    return new NextResponse(renderPage('Already removed', 'This contact is no longer in our system. You will not receive further emails.'), {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  const { error } = await supabase.from('leads').update({ suppressed: true }).eq('id', leadId);
  if (error) {
    logError('unsubscribe:update', error, { leadId });
    return new NextResponse(renderPage('Something went wrong', 'We could not process your request right now. Please try again later.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  await supabase.from('outreach_events').insert({
    lead_id: leadId,
    event_type: 'unsubscribed',
    event_data: { source: 'one_click_unsubscribe' }
  });

  return new NextResponse(renderPage('You are unsubscribed', 'You have been removed from this mailing list and will not receive further emails.'), {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

function verifySignature(leadId: string, sig: string): boolean {
  const expected = Buffer.from(signLeadId(leadId), 'hex');
  let provided: Buffer;
  try {
    provided = Buffer.from(sig, 'hex');
  } catch {
    return false;
  }
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

function renderPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
  .card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:40px; max-width:420px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,.05); }
  h1 { font-size:20px; color:#111827; margin:0 0 12px; }
  p { font-size:14px; color:#6b7280; line-height:1.6; margin:0; }
</style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
