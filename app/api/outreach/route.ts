import { NextResponse } from 'next/server';
import { buildOutreach } from '@/lib/pipeline';
import { buildSmsOutreach, sendTwilioSms } from '@/lib/sms';
import { sendResendEmail } from '@/lib/email';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { AppSettings, Lead, OutreachChannel } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as {
    lead: Lead;
    demoUrl?: string;
    channel?: OutreachChannel;
    subject?: string;
    customMessage?: string;
    settings?: AppSettings;
  };

  if (!body.lead) {
    return NextResponse.json({ error: 'Lead is required.' }, { status: 400 });
  }

  const lead = body.lead;
  const channel: OutreachChannel = body.channel || 'email';
  const demoUrl = body.demoUrl || lead.demo_url || `${process.env.APP_BASE_URL || 'http://localhost:3000'}/demo/${lead.id}`;

  const emailSubject = body.subject || lead.outreach_subject || `${lead.company_name.split(' ')[0]} ${lead.city ? `in ${lead.city}` : ''} demo concept`;
  const emailBody = body.customMessage || lead.outreach_body || buildOutreach({
    company: lead.company_name,
    contactName: lead.contact_name,
    city: lead.city,
    weakness: lead.weakness,
    demoUrl,
    channel: 'email',
    niche: lead.niche
  });

  const smsText = body.customMessage || lead.outreach_sms || buildSmsOutreach(lead);

  const results: {
    email?: { sent: boolean; messageId?: string; error?: string };
    sms?: { sent: boolean; messageId?: string; error?: string };
    channel: OutreachChannel;
    overallSuccess: boolean;
  } = {
    channel,
    overallSuccess: false
  };

  // 1. Dispatch Email
  if ((channel === 'email' || channel === 'multi') && lead.email) {
    const emailResult = await sendResendEmail({
      to: lead.email,
      subject: emailSubject,
      bodyText: emailBody,
      lead: { ...lead, demo_url: demoUrl },
      settings: body.settings
    });

    results.email = {
      sent: emailResult.success,
      messageId: emailResult.messageId,
      error: emailResult.error
    };

    if (emailResult.success) results.overallSuccess = true;
  } else if ((channel === 'email' || channel === 'multi') && !lead.email) {
    results.email = { sent: false, error: 'Lead has no email address.' };
  }

  // 2. Dispatch SMS
  if ((channel === 'sms' || channel === 'multi') && lead.phone) {
    const smsResult = await sendTwilioSms({
      to: lead.phone,
      body: smsText,
      leadId: lead.id,
      settings: body.settings
    });

    results.sms = {
      sent: smsResult.success,
      messageId: smsResult.messageId,
      error: smsResult.error
    };

    if (smsResult.success) results.overallSuccess = true;
  } else if ((channel === 'sms' || channel === 'multi') && !lead.phone) {
    results.sms = { sent: false, error: 'Lead has no phone number.' };
  }

  // 3. Update Supabase status & record outreach events
  const supabase = getSupabaseAdmin();
  const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);

  if (supabase && isSupabaseLead) {
    if (results.overallSuccess) {
      await supabase
        .from('leads')
        .update({
          outreach_subject: emailSubject,
          outreach_body: emailBody,
          status: 'outreach_sent'
        })
        .eq('id', lead.id);

      if (results.email?.sent) {
        await supabase.from('outreach_events').insert({
          lead_id: lead.id,
          event_type: 'sent',
          event_data: { channel: 'email', provider_id: results.email.messageId, to: lead.email }
        });
      }

      if (results.sms?.sent) {
        await supabase.from('outreach_events').insert({
          lead_id: lead.id,
          event_type: 'sent',
          event_data: { channel: 'sms', provider_id: results.sms.messageId, to: lead.phone }
        });
      }
    }
  }

  // Stream outreach event to BigQuery
  if (results.overallSuccess && shouldStreamToBigQuery(body.settings)) {
    import('@/lib/bigquery').then(({ streamEventToBigQuery }) => {
      streamEventToBigQuery({
        lead_id: lead.id,
        event_type: 'sent',
        channel,
        payload: {
          emailSent: results.email?.sent,
          smsSent: results.sms?.sent,
          company: lead.company_name,
          email: lead.email,
          phone: lead.phone
        }
      }).catch(() => {});
    }).catch(() => {});
  }

  return NextResponse.json({
    ...results,
    leadId: lead.id,
    subject: emailSubject,
    body: emailBody,
    smsText
  });
}

function shouldStreamToBigQuery(settings?: AppSettings) {
  return settings?.bigqueryEnabled !== false && process.env.BIGQUERY_ENABLED !== 'false';
}
