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
    await supabase?.from('outreach_events').insert({
      lead_id: leadId,
      event_type: 'opened',
      event_data: {}
    });
  }

  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
