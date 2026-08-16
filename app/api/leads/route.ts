import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { LeadStatus } from '@/lib/types';

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as {
      leadIds?: string[];
      status?: LeadStatus;
      campaignId?: string;
    };

    const supabase = getSupabaseAdmin();
    const leadIds = body.leadIds || [];
    const status = body.status;
    const campaignId = body.campaignId;

    if (!leadIds.length && !status && !campaignId) {
      return NextResponse.json({ error: 'leadIds, status, or campaignId required for deletion.' }, { status: 400 });
    }

    if (supabase) {
      if (leadIds.length > 0) {
        // Delete associated outreach events
        await supabase.from('outreach_events').delete().in('lead_id', leadIds);
        // Delete leads
        const { error } = await supabase.from('leads').delete().in('id', leadIds);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      } else if (status && campaignId) {
        // Find leads by status
        const { data: matched } = await supabase
          .from('leads')
          .select('id')
          .eq('campaign_id', campaignId)
          .eq('status', status);
        const idsToDelete = (matched || []).map((l) => l.id);
        if (idsToDelete.length > 0) {
          await supabase.from('outreach_events').delete().in('lead_id', idsToDelete);
          await supabase.from('leads').delete().in('id', idsToDelete);
        }
      } else if (campaignId) {
        // Delete all leads in campaign
        const { data: matched } = await supabase.from('leads').select('id').eq('campaign_id', campaignId);
        const idsToDelete = (matched || []).map((l) => l.id);
        if (idsToDelete.length > 0) {
          await supabase.from('outreach_events').delete().in('lead_id', idsToDelete);
          await supabase.from('leads').delete().in('id', idsToDelete);
        }
      }

      if (campaignId) {
        await refreshCampaignCounters(supabase, campaignId);
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount: leadIds.length,
      deletedIds: leadIds
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Batch lead deletion failed.' },
      { status: 500 }
    );
  }
}

async function refreshCampaignCounters(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  campaignId: string
) {
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
