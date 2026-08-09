import { NextResponse } from 'next/server';
import { buildOutreach } from '@/lib/pipeline';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Lead, OutreachChannel } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as { lead: Lead; demoUrl?: string; channel?: OutreachChannel };
  if (!body.lead) {
    return NextResponse.json({ error: 'Lead is required.' }, { status: 400 });
  }

  const demoUrl = body.demoUrl || body.lead.demo_url || `${process.env.APP_BASE_URL || 'http://localhost:3000'}/demo/${body.lead.id}`;
  const channel = body.channel || 'email';
  const bodyText = buildOutreach({
    company: body.lead.company_name,
    city: body.lead.city,
    weakness: body.lead.weakness,
    demoUrl,
    channel
  });

  const outreach = {
    subject: `${body.lead.company_name.split(' ')[0]} demo idea`,
    body: bodyText,
    channel,
    sent: false,
    providerId: undefined as string | undefined
  };

  if (channel === 'email' && process.env.RESEND_API_KEY && process.env.FROM_EMAIL && body.lead.email) {
    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${process.env.FROM_NAME || 'LeadDrive'} <${process.env.FROM_EMAIL}>`,
        to: [body.lead.email],
        subject: outreach.subject,
        text: outreach.body,
        html: renderEmailHtml(outreach.body, body.lead.id)
      })
    });

    if (!sendRes.ok) {
      const errorText = await sendRes.text();
      return NextResponse.json({ error: `Resend failed: ${errorText}` }, { status: 502 });
    }

    const sent = (await sendRes.json()) as { id?: string };
    outreach.sent = true;
    outreach.providerId = sent.id;
  }

  const supabase = getSupabaseAdmin();
  const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.lead.id);
  if (supabase && isSupabaseLead) {
    await supabase
      .from('leads')
      .update({
        outreach_subject: outreach.subject,
        outreach_body: outreach.body,
        status: outreach.sent ? 'outreach_sent' : body.lead.status
      })
      .eq('id', body.lead.id);

    if (outreach.sent) {
      await supabase.from('outreach_events').insert({
        lead_id: body.lead.id,
        event_type: 'sent',
        event_data: { provider_id: outreach.providerId, channel }
      });
    }
  }

  return NextResponse.json(outreach);
}

function renderEmailHtml(text: string, leadId: string) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  return `${escaped}<img src="${baseUrl}/api/track/open?leadId=${leadId}" width="1" height="1" alt="" />`;
}
