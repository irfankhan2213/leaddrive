import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api-auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { logError } from '@/lib/http';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { LeadStatus } from '@/lib/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const rl = checkRateLimit(req, 'leads_delete', 30, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  try {
    const body = (await req.json()) as {
      leadIds?: string[];
      status?: LeadStatus;
      campaignId?: string;
    };

    const leadIds = (body.leadIds || []).filter((id) => typeof id === 'string' && id.length < 64);
    const status = body.status;
    const campaignId = body.campaignId && UUID_RE.test(body.campaignId) ? body.campaignId : undefined;

    if (!leadIds.length && !status && !campaignId) {
      return NextResponse.json({ error: 'leadIds, status, or campaignId required for deletion.' }, { status: 400 });
    }

    // All queries run through the user-scoped client: RLS restricts deletes
    // to rows the caller owns.
    if (leadIds.length > 0) {
      await auth.supabase.from('outreach_events').delete().in('lead_id', leadIds);
      const { error } = await auth.supabase.from('leads').delete().in('id', leadIds);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (status && campaignId) {
      const { data: matched } = await auth.supabase
        .from('leads')
        .select('id')
        .eq('campaign_id', campaignId)
        .eq('status', status);
      const idsToDelete = (matched || []).map((l) => l.id);
      if (idsToDelete.length > 0) {
        await auth.supabase.from('outreach_events').delete().in('lead_id', idsToDelete);
        await auth.supabase.from('leads').delete().in('id', idsToDelete);
      }
    } else if (campaignId) {
      const { data: matched } = await auth.supabase.from('leads').select('id').eq('campaign_id', campaignId);
      const idsToDelete = (matched || []).map((l) => l.id);
      if (idsToDelete.length > 0) {
        await auth.supabase.from('outreach_events').delete().in('lead_id', idsToDelete);
        await auth.supabase.from('leads').delete().in('id', idsToDelete);
      }
    }

    if (campaignId) {
      await refreshCampaignCounters(auth.supabase, campaignId);
    }

    return NextResponse.json({
      success: true,
      deletedCount: leadIds.length,
      deletedIds: leadIds
    });
  } catch (err) {
    logError('DELETE /api/leads', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Batch lead deletion failed.' },
      { status: 500 }
    );
  }
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
