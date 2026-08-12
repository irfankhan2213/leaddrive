import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const leadId = url.searchParams.get('leadId');
  const target = url.searchParams.get('target') || '/';

  if (leadId) {
    const supabase = getSupabaseAdmin();
    await supabase?.from('outreach_events').insert({
      lead_id: leadId,
      event_type: 'clicked',
      event_data: { target }
    });
    if (supabase) await incrementLeadCounter(supabase, leadId, 'clicks');
  }

  return NextResponse.redirect(target);
}

async function incrementLeadCounter(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  leadId: string,
  field: 'opens' | 'clicks' | 'replies'
) {
  const { data } = await supabase.from('leads').select(field).eq('id', leadId).single();
  const current = Number((data as Record<string, unknown> | null)?.[field] || 0);
  await supabase.from('leads').update({ [field]: current + 1 }).eq('id', leadId);
}
