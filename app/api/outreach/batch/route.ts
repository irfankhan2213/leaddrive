import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api-auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { buildSmsOutreach, sendTwilioSms } from '@/lib/sms';
import { sendResendEmail } from '@/lib/email';
import { getUserSettings } from '@/lib/settings';
import { logError } from '@/lib/http';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lead, OutreachChannel } from '@/lib/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BATCH = 100;

export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const rl = checkRateLimit(req, 'outreach_batch', 6, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  let body: { leadIds?: string[]; channel?: OutreachChannel; customTemplate?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const leadIds = (body.leadIds || []).filter((id) => typeof id === 'string' && UUID_RE.test(id));
  if (leadIds.length === 0) {
    return NextResponse.json({ error: 'At least one valid saved leadId is required for batch outreach.' }, { status: 400 });
  }
  if (leadIds.length > MAX_BATCH) {
    return NextResponse.json({ error: `Batch size is capped at ${MAX_BATCH} leads per request.` }, { status: 400 });
  }

  const channel: OutreachChannel = body.channel || 'email';

  // Load leads through the user-scoped client — RLS guarantees ownership.
  const { data: leadRows } = await auth.supabase.from('leads').select('*').in('id', leadIds);
  const leads = (leadRows || []) as Lead[];

  const foundIds = new Set(leads.map((l) => l.id));
  const notFound = leadIds.filter((id) => !foundIds.has(id));
  // Suppression is enforced server-side: opted-out contacts are never sent to.
  const suppressedLeads = leads.filter((l) => l.suppressed);
  const sendable = leads.filter((l) => !l.suppressed);

  const settings = await getUserSettings(auth.user.id);
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

  let sentCount = 0;
  let failedCount = 0;
  const dispatchResults: Array<{
    leadId: string;
    company: string;
    emailSent?: boolean;
    smsSent?: boolean;
    error?: string;
  }> = [];

  for (const lead of sendable) {
    const demoUrl = lead.demo_url && /^https?:\/\//.test(lead.demo_url) ? lead.demo_url : `${baseUrl}/demo/${lead.id}`;
    let emailSent = false;
    let smsSent = false;
    let errorMsg = '';

    if ((channel === 'email' || channel === 'multi') && lead.email) {
      const subject = lead.outreach_subject || `${lead.company_name.split(' ')[0]} ${lead.city ? `in ${lead.city}` : ''} demo concept`;
      const bodyText = lead.outreach_body ||
        [
          `Hi ${lead.contact_name ? lead.contact_name.split(' ')[0] : 'there'},`,
          ``,
          `I built a custom interactive demo showing what a high-converting version of ${lead.company_name}'s site could look like:`,
          ``,
          demoUrl
        ].join('\n');

      const res = await sendResendEmail({
        to: lead.email,
        subject,
        bodyText,
        lead: { ...lead, demo_url: demoUrl },
        settings
      });

      if (res.success) {
        emailSent = true;
        await recordEvent(auth.supabase, lead.id, { channel: 'email', provider_id: res.messageId, to: lead.email });
      } else {
        errorMsg = res.error || 'Email send failed';
        logError('outreach-batch:email', new Error(errorMsg), { leadId: lead.id });
      }
    }

    if ((channel === 'sms' || channel === 'multi') && lead.phone) {
      const smsBody = buildSmsOutreach(lead, body.customTemplate?.slice(0, 1000));
      const res = await sendTwilioSms({
        to: lead.phone,
        body: smsBody,
        leadId: lead.id,
        settings
      });

      if (res.success) {
        smsSent = true;
        await recordEvent(auth.supabase, lead.id, { channel: 'sms', provider_id: res.messageId, to: lead.phone });
      } else {
        errorMsg = (errorMsg ? `${errorMsg}; ` : '') + (res.error || 'SMS send failed');
        logError('outreach-batch:sms', new Error(errorMsg), { leadId: lead.id });
      }
    }

    if (emailSent || smsSent) {
      sentCount += 1;
      await auth.supabase.from('leads').update({ status: 'outreach_sent' }).eq('id', lead.id);

      if (settings.bigqueryEnabled !== false) {
        import('@/lib/bigquery')
          .then(({ streamEventToBigQuery }) => {
            streamEventToBigQuery({
              lead_id: lead.id,
              event_type: 'sent',
              channel,
              payload: { emailSent, smsSent, company: lead.company_name }
            }).catch((err) => logError('bigquery:stream-sent', err));
          })
          .catch((err) => logError('bigquery:import-sent', err));
      }
    } else {
      failedCount += 1;
    }

    dispatchResults.push({
      leadId: lead.id,
      company: lead.company_name,
      emailSent,
      smsSent,
      error: errorMsg || (!lead.email && !lead.phone ? 'Missing email and phone number' : undefined)
    });
  }

  for (const lead of suppressedLeads) {
    dispatchResults.push({
      leadId: lead.id,
      company: lead.company_name,
      error: 'Suppressed (opted out) — skipped.'
    });
    failedCount += 1;
  }
  for (const id of notFound) {
    dispatchResults.push({ leadId: id, company: 'Unknown', error: 'Lead not found.' });
    failedCount += 1;
  }

  return NextResponse.json({
    total: leadIds.length,
    sentCount,
    failedCount,
    results: dispatchResults
  });
}

async function recordEvent(
  supabase: SupabaseClient,
  leadId: string,
  eventData: Record<string, unknown>
) {
  const { error } = await supabase.from('outreach_events').insert({
    lead_id: leadId,
    event_type: 'sent',
    event_data: eventData
  });
  if (error) logError('outreach-batch:record-event', error, { leadId });
}
