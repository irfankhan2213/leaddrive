import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api-auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { logError } from '@/lib/http';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { LeadStatus } from '@/lib/types';

const statuses: LeadStatus[] = [
  'new',
  'scraped',
  'qualified',
  'skipped',
  'demo_ready',
  'demo_failed',
  'outreach_sent',
  'replied',
  'converted'
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const rl = checkRateLimit(req, 'leads_patch', 60, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid lead id.' }, { status: 400 });
  }

  const body = (await req.json()) as {
    status?: LeadStatus;
    reply_text?: string;
    demo_url?: string;
    email?: string;
  };

  const updates: Record<string, unknown> = {};
  if (body.status) {
    if (!statuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
    updates.status = body.status;
    if (body.status === 'replied' || body.status === 'converted') updates.replies = 1;
  }
  if (body.reply_text !== undefined) updates.reply_text = String(body.reply_text).slice(0, 10_000);
  if (body.demo_url !== undefined) updates.demo_url = String(body.demo_url).slice(0, 2000);
  if (body.email !== undefined) updates.email = String(body.email).slice(0, 320).trim();

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updates provided.' }, { status: 400 });
  }

  // RLS restricts this update to the caller's own lead.
  let { data, error } = await auth.supabase.from('leads').update(updates).eq('id', id).select().single();
  if (error && body.reply_text !== undefined && error.message.includes('reply_text')) {
    delete updates.reply_text;
    const retry = await auth.supabase.from('leads').update(updates).eq('id', id).select().single();
    data = retry.data;
    error = retry.error;
  }
  if (error) {
    logError('PATCH /api/leads/[id]', error, { leadId: id });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.status === 'replied' || body.status === 'converted') {
    await auth.supabase.from('outreach_events').insert({
      lead_id: id,
      event_type: body.status === 'replied' ? 'replied' : 'converted',
      event_data: { reply_text: body.reply_text || null }
    });
  }

  if (data?.campaign_id) {
    await refreshCampaignCounters(auth.supabase, data.campaign_id);
  }

  return NextResponse.json({ lead: data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const rl = checkRateLimit(req, 'leads_delete', 30, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ success: false, error: 'Invalid lead id.' }, { status: 400 });
  }

  // 1. Get campaign_id before deleting so we can refresh counters (own row only).
  const { data: lead } = await auth.supabase.from('leads').select('campaign_id').eq('id', id).single();

  // 2. Cascade delete outreach events
  await auth.supabase.from('outreach_events').delete().eq('lead_id', id);

  // 3. Delete lead
  const { error } = await auth.supabase.from('leads').delete().eq('id', id);
  if (error) {
    logError('DELETE /api/leads/[id]', error, { leadId: id });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4. Refresh campaign counters
  if (lead?.campaign_id) {
    await refreshCampaignCounters(auth.supabase, lead.campaign_id);
  }

  return NextResponse.json({ success: true, deletedId: id });
}

async function refreshCampaignCounters(supabase: SupabaseClient, campaignId: string) {
  const { data: leads } = await supabase
    .from('leads')
    .select('status')
    .eq('campaign_id', campaignId);
  const rows = leads || [];

  await supabase
    .from('campaigns')
    .update({
      total_prospects: rows.length,
      qualified: rows.filter((lead) => ['qualified', 'demo_ready', 'outreach_sent', 'replied', 'converted'].includes(lead.status)).length,
      demos_generated: rows.filter((lead) => ['demo_ready', 'outreach_sent', 'replied', 'converted'].includes(lead.status)).length,
      outreach_sent: rows.filter((lead) => ['outreach_sent', 'replied', 'converted'].includes(lead.status)).length,
      replies: rows.filter((lead) => ['replied', 'converted'].includes(lead.status)).length,
      conversions: rows.filter((lead) => lead.status === 'converted').length
    })
    .eq('id', campaignId);
}
