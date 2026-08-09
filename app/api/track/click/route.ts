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
  }

  return NextResponse.redirect(target);
}
