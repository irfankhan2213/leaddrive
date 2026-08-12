import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const leadId = url.searchParams.get('leadId');
  const rawTarget = url.searchParams.get('target') || '/';

  // Security: sanitize target to prevent open redirect vulnerabilities
  const safeTarget = sanitizeRedirectTarget(rawTarget, url.origin);

  if (leadId) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('outreach_events').insert({
        lead_id: leadId,
        event_type: 'clicked',
        event_data: { target: safeTarget }
      });
      await incrementLeadCounter(supabase, leadId, 'clicks');
    }
  }

  return NextResponse.redirect(safeTarget);
}

function sanitizeRedirectTarget(target: string, requestOrigin: string): string {
  // Allow relative URLs starting with /
  if (target.startsWith('/') && !target.startsWith('//')) {
    return `${requestOrigin}${target}`;
  }

  try {
    const parsed = new URL(target);
    const appBase = process.env.APP_BASE_URL ? new URL(process.env.APP_BASE_URL).origin : null;

    // Allow same-origin redirects, app base URL, or trusted demo hosts (e.g. v0.dev)
    const isAllowedOrigin =
      parsed.origin === requestOrigin ||
      (appBase && parsed.origin === appBase) ||
      parsed.hostname.endsWith('v0.dev') ||
      parsed.hostname.endsWith('vercel.app');

    if (isAllowedOrigin) return target;
  } catch {
    // Invalid URL
  }

  return requestOrigin;
}

async function incrementLeadCounter(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  leadId: string,
  field: 'opens' | 'clicks' | 'replies'
) {
  // Use Supabase RPC if available, or atomic fallback
  const { error } = await supabase.rpc('increment_lead_counter', {
    lead_id_param: leadId,
    field_param: field
  });

  if (error) {
    // Fallback if RPC function is not installed in database yet
    const { data } = await supabase.from('leads').select(field).eq('id', leadId).single();
    const current = Number((data as Record<string, unknown> | null)?.[field] || 0);
    await supabase.from('leads').update({ [field]: current + 1 }).eq('id', leadId);
  }
}
