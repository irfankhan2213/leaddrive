import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const pixel = Buffer.from(
  'R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const leadId = url.searchParams.get('leadId');

  if (leadId) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('outreach_events').insert({
        lead_id: leadId,
        event_type: 'opened',
        event_data: {}
      });
      await incrementLeadCounter(supabase, leadId, 'opens');
    }
  }

  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

async function incrementLeadCounter(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  leadId: string,
  field: 'opens' | 'clicks' | 'replies'
) {
  const { error } = await supabase.rpc('increment_lead_counter', {
    lead_id_param: leadId,
    field_param: field
  });

  if (error) {
    const { data } = await supabase.from('leads').select(field).eq('id', leadId).single();
    const current = Number((data as Record<string, unknown> | null)?.[field] || 0);
    await supabase.from('leads').update({ [field]: current + 1 }).eq('id', leadId);
  }
}
