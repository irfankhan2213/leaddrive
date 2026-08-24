import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { logError } from '@/lib/http';

const pixel = Buffer.from(
  'R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public endpoint hit by email clients. Rate-limited per IP so it can't be
// used to spam event rows or inflate analytics.
export async function GET(req: Request) {
  const rl = checkRateLimit(req, 'track_open', 60, 60_000);
  if (!rl.ok) {
    return new NextResponse(pixel, {
      status: 429,
      headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store, max-age=0', 'Retry-After': String(rl.retryAfterSec) }
    });
  }

  const url = new URL(req.url);
  const leadId = url.searchParams.get('leadId');

  if (leadId && UUID_RE.test(leadId)) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      // Deduplicated by outreach_events_daily_dedupe_idx (one per lead/day);
      // duplicates are silently ignored.
      // Upsert + ignoreDuplicates = at most one opened event per lead/day
      // (dedupe index targets lead_id,event_type,event_day).
      const { error } = await supabase.from('outreach_events').upsert(
        {
          lead_id: leadId,
          event_type: 'opened',
          event_data: {}
        },
        { onConflict: 'lead_id,event_type,event_day', ignoreDuplicates: true }
      );

      if (error && error.code !== '23505') {
        // Unique violations are expected for repeat opens; anything else is real.
        logError('track/open:event-insert', error, { leadId });
      }

      await incrementLeadCounter(supabase, leadId, 'opens');

      import('@/lib/bigquery').then(({ streamEventToBigQuery }) => {
        streamEventToBigQuery({
          lead_id: leadId,
          event_type: 'opened',
          channel: 'email',
          payload: { source: 'tracking_pixel' }
        }).catch((err) => logError('bigquery:stream-open', err));
      }).catch((err) => logError('bigquery:import-open', err));
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
    // The atomic RPC failed (e.g. not installed). Log it rather than falling
    // back to a read-modify-write, which loses updates under concurrency.
    logError('track/open:increment', error, { leadId, field });
  }
}
