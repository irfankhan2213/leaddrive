import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { logError } from '@/lib/http';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const rl = checkRateLimit(req, 'track_click', 60, 60_000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const url = new URL(req.url);
  const leadId = url.searchParams.get('leadId');
  const rawTarget = url.searchParams.get('target') || '/';

  // Security: sanitize target to prevent open redirect vulnerabilities
  const safeTarget = sanitizeRedirectTarget(rawTarget, url.origin);

  if (leadId && UUID_RE.test(leadId)) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      // Deduplicated by outreach_events_daily_dedupe_idx (one per lead/day).
      // Upsert + ignoreDuplicates = at most one clicked event per lead/day.
      const { error } = await supabase.from('outreach_events').upsert(
        {
          lead_id: leadId,
          event_type: 'clicked',
          event_data: { target: safeTarget }
        },
        { onConflict: 'lead_id,event_type,event_day', ignoreDuplicates: true }
      );

      if (error && error.code !== '23505') {
        logError('track/click:event-insert', error, { leadId });
      }

      await incrementLeadCounter(supabase, leadId, 'clicks');

      import('@/lib/bigquery').then(({ streamEventToBigQuery }) => {
        streamEventToBigQuery({
          lead_id: leadId,
          event_type: 'clicked',
          channel: 'email',
          payload: { target: safeTarget }
        }).catch((err) => logError('bigquery:stream-click', err));
      }).catch((err) => logError('bigquery:import-click', err));
    }
  }

  return NextResponse.redirect(safeTarget);
}

/**
 * Exact-host allowlist with proper dot boundaries. A host matches only when
 * it equals a trusted domain or is a direct subdomain of one — so
 * "evilv0.dev" and arbitrary "*.vercel.app" deployments are rejected.
 */
const TRUSTED_DEMO_HOSTS = ['v0.dev', 'vusercontent.net'];

function sanitizeRedirectTarget(target: string, requestOrigin: string): string {
  // Allow relative URLs starting with / (rejecting // or backslash tricks)
  if (target.startsWith('/') && !target.startsWith('//') && !target.includes('\\')) {
    return `${requestOrigin}${target}`;
  }

  try {
    const parsed = new URL(target);
    const appBase = process.env.APP_BASE_URL ? new URL(process.env.APP_BASE_URL).origin : null;

    const isAllowedOrigin =
      parsed.origin === requestOrigin ||
      (appBase && parsed.origin === appBase) ||
      TRUSTED_DEMO_HOSTS.some(
        (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
      );

    if (isAllowedOrigin) return target;
  } catch (err) {
    logError('track/click:sanitize', err, { target: target.slice(0, 200) });
  }

  return requestOrigin;
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
    // Atomic RPC failed — log instead of using a racy read-modify-write.
    logError('track/click:increment', error, { leadId, field });
  }
}
