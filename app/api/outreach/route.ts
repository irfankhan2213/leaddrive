import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api-auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { buildOutreach } from '@/lib/pipeline';
import { buildSmsOutreach, sendTwilioSms } from '@/lib/sms';
import { sendResendEmail } from '@/lib/email';
import { getUserSettings } from '@/lib/settings';
import { logError } from '@/lib/http';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lead, OutreachChannel } from '@/lib/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const rl = checkRateLimit(req, 'outreach_post', 30, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  let body: {
    leadId?: string;
    channel?: OutreachChannel;
    subject?: string;
    customMessage?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const leadId = body.leadId;
  if (!leadId || !UUID_RE.test(leadId)) {
    return NextResponse.json({ error: 'A valid saved leadId is required.' }, { status: 400 });
  }

  // Load the lead through the user-scoped client — RLS guarantees it belongs
  // to the caller. Client-supplied lead payloads are never trusted.
  const { data: leadRow } = await auth.supabase.from('leads').select('*').eq('id', leadId).maybeSingle();
  const lead = leadRow as Lead | null;
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }

  if (lead.suppressed) {
    return NextResponse.json(
      { error: 'This contact has opted out. Suppressed leads cannot be contacted.' },
      { status: 409 }
    );
  }

  const channel: OutreachChannel = body.channel || 'email';

  // Credentials resolve server-side from stored settings + env.
  const settings = await getUserSettings(auth.user.id);

  const baseUrl = getBaseUrl(req);
  const demoUrl = lead.demo_url && /^https?:\/\//.test(lead.demo_url) ? lead.demo_url : `${baseUrl}/demo/${lead.id}`;

  const emailSubject =
    body.subject?.slice(0, 200) ||
    lead.outreach_subject ||
    `${lead.company_name.split(' ')[0]} ${lead.city ? `in ${lead.city}` : ''} demo concept`;
  const emailBody =
    body.customMessage?.slice(0, 10_000) ||
    lead.outreach_body ||
    buildOutreach({
      company: lead.company_name,
      contactName: lead.contact_name,
      city: lead.city,
      weakness: lead.weakness,
      demoUrl,
      channel: 'email',
      niche: lead.niche
    });

  const smsText = buildSmsOutreach(lead, body.customMessage?.slice(0, 1000));

  const results: {
    email?: { sent: boolean; messageId?: string; error?: string };
    sms?: { sent: boolean; messageId?: string; error?: string };
    channel: OutreachChannel;
    overallSuccess: boolean;
  } = { channel, overallSuccess: false };

  // 1. Email
  if ((channel === 'email' || channel === 'multi') && lead.email) {
    const emailResult = await sendResendEmail({
      to: lead.email,
      subject: emailSubject,
      bodyText: emailBody,
      lead: { ...lead, demo_url: demoUrl },
      settings
    });
    results.email = { sent: emailResult.success, messageId: emailResult.messageId, error: emailResult.error };
    if (emailResult.success) results.overallSuccess = true;
  } else if ((channel === 'email' || channel === 'multi') && !lead.email) {
    results.email = { sent: false, error: 'Lead has no email address.' };
  }

  // 2. SMS
  if ((channel === 'sms' || channel === 'multi') && lead.phone) {
    const smsResult = await sendTwilioSms({
      to: lead.phone,
      body: smsText,
      leadId: lead.id,
      settings
    });
    results.sms = { sent: smsResult.success, messageId: smsResult.messageId, error: smsResult.error };
    if (smsResult.success) results.overallSuccess = true;
  } else if ((channel === 'sms' || channel === 'multi') && !lead.phone) {
    results.sms = { sent: false, error: 'Lead has no phone number.' };
  }

  // 3. Record outcome only after a confirmed dispatch.
  if (results.overallSuccess) {
    await auth.supabase
      .from('leads')
      .update({
        outreach_subject: emailSubject,
        outreach_body: emailBody,
        status: 'outreach_sent'
      })
      .eq('id', lead.id);

    if (results.email?.sent) {
      await recordEvent(auth.supabase, lead.id, 'sent', { channel: 'email', provider_id: results.email.messageId, to: lead.email });
    }
    if (results.sms?.sent) {
      await recordEvent(auth.supabase, lead.id, 'sent', { channel: 'sms', provider_id: results.sms.messageId, to: lead.phone });
    }

    streamSentEvent(settings.bigqueryEnabled !== false, {
      lead_id: lead.id,
      event_type: 'sent',
      channel,
      payload: {
        emailSent: results.email?.sent,
        smsSent: results.sms?.sent,
        company: lead.company_name
      }
    });
  } else {
    const firstError = results.email?.error || results.sms?.error;
    if (firstError) logError('outreach:dispatch', new Error(firstError), { leadId: lead.id });
  }

  return NextResponse.json({
    ...results,
    leadId: lead.id,
    subject: emailSubject,
    body: emailBody,
    smsText
  });
}

async function recordEvent(
  supabase: SupabaseClient,
  leadId: string,
  eventType: 'sent',
  eventData: Record<string, unknown>
) {
  const { error } = await supabase.from('outreach_events').insert({
    lead_id: leadId,
    event_type: eventType,
    event_data: eventData
  });
  if (error) logError('outreach:record-event', error, { leadId, eventType });
}

async function streamSentEvent(enabled: boolean, event: Record<string, unknown>) {
  if (!enabled) return;
  import('@/lib/bigquery')
    .then(({ streamEventToBigQuery }) => {
      streamEventToBigQuery(event as Parameters<typeof streamEventToBigQuery>[0]).catch((err) =>
        logError('bigquery:stream-sent', err)
      );
    })
    .catch((err) => logError('bigquery:import-sent', err));
}

function getBaseUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configured = process.env.APP_BASE_URL;
  if (!configured || configured.includes('localhost')) return requestOrigin;
  return configured;
}
