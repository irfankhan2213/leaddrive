import { NextResponse } from 'next/server';
import { buildOutreach } from '@/lib/pipeline';
import { buildSmsOutreach, sendTwilioSms } from '@/lib/sms';
import { sendResendEmail } from '@/lib/email';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { AppSettings, Lead, OutreachChannel } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as {
    leads: Lead[];
    channel?: OutreachChannel;
    customTemplate?: string;
    settings?: AppSettings;
  };

  if (!body.leads || !Array.isArray(body.leads) || body.leads.length === 0) {
    return NextResponse.json({ error: 'At least one lead is required for batch outreach.' }, { status: 400 });
  }

  const channel: OutreachChannel = body.channel || 'email';
  const leads = body.leads;
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const supabase = getSupabaseAdmin();

  let sentCount = 0;
  let failedCount = 0;
  const dispatchResults: Array<{
    leadId: string;
    company: string;
    emailSent?: boolean;
    smsSent?: boolean;
    error?: string;
  }> = [];

  for (const lead of leads) {
    const demoUrl = lead.demo_url || `${baseUrl}/demo/${lead.id}`;
    let emailSent = false;
    let smsSent = false;
    let errorMsg = '';

    // Email Dispatch
    if ((channel === 'email' || channel === 'multi') && lead.email) {
      const subject = lead.outreach_subject || `${lead.company_name.split(' ')[0]} ${lead.city ? `in ${lead.city}` : ''} demo concept`;
      const bodyText = lead.outreach_body || buildOutreach({
        company: lead.company_name,
        contactName: lead.contact_name,
        city: lead.city,
        weakness: lead.weakness,
        demoUrl,
        channel: 'email',
        niche: lead.niche
      });

      const res = await sendResendEmail({
        to: lead.email,
        subject,
        bodyText,
        lead: { ...lead, demo_url: demoUrl },
        settings: body.settings
      });

      if (res.success) {
        emailSent = true;
        if (supabase) {
          await supabase.from('outreach_events').insert({
            lead_id: lead.id,
            event_type: 'sent',
            event_data: { channel: 'email', provider_id: res.messageId, to: lead.email }
          });
        }
      } else {
        errorMsg = res.error || 'Email send failed';
      }
    }

    // SMS Dispatch
    if ((channel === 'sms' || channel === 'multi') && lead.phone) {
      const smsBody = buildSmsOutreach(lead, body.customTemplate);
      const res = await sendTwilioSms({
        to: lead.phone,
        body: smsBody,
        leadId: lead.id,
        settings: body.settings
      });

      if (res.success) {
        smsSent = true;
        if (supabase) {
          await supabase.from('outreach_events').insert({
            lead_id: lead.id,
            event_type: 'sent',
            event_data: { channel: 'sms', provider_id: res.messageId, to: lead.phone }
          });
        }
      } else {
        errorMsg = (errorMsg ? `${errorMsg}; ` : '') + (res.error || 'SMS send failed');
      }
    }

    if (emailSent || smsSent) {
      sentCount += 1;
      const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);
      if (supabase && isSupabaseLead) {
        await supabase.from('leads').update({ status: 'outreach_sent' }).eq('id', lead.id);
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

  return NextResponse.json({
    total: leads.length,
    sentCount,
    failedCount,
    results: dispatchResults
  });
}
