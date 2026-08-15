import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const live = url.searchParams.get('live') === '1';

  const status = {
    app: 'ok',
    supabase: {
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      ok: false as boolean | null,
      error: null as string | null
    },
    vertex: {
      configured: Boolean(process.env.GCP_PROJECT_ID),
      projectId: process.env.GCP_PROJECT_ID || null,
      location: process.env.GCP_LOCATION || 'us-central1',
      model: process.env.VERTEX_AI_MODEL || 'gemini-2.5-flash',
      ok: null as boolean | null,
      error: null as string | null
    },
    bigquery: {
      configured: Boolean(process.env.GCP_PROJECT_ID),
      dataset: process.env.BIGQUERY_DATASET || 'leaddrive_analytics',
      ok: null as boolean | null,
      error: null as string | null
    },
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      enabled: process.env.GEMINI_ENABLED === 'true',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      ok: null as boolean | null,
      error: null as string | null
    },
    v0: {
      configured: Boolean(process.env.V0_API_KEY),
      model: process.env.V0_MODEL || 'v0-mini',
      ok: null as boolean | null,
      error: null as string | null
    }
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    status.supabase.ok = false;
    status.supabase.error = 'Supabase server credentials are missing.';
  } else {
    const { error } = await supabase.from('campaigns').select('id', { count: 'exact', head: true });
    status.supabase.ok = !error;
    status.supabase.error = error?.message || null;
  }

  if (!live) return NextResponse.json(status);

  if (status.gemini.configured) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${status.gemini.model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY || ''
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Return OK' }] }],
            generationConfig: { maxOutputTokens: 8 }
          })
        }
      );
      status.gemini.ok = res.ok;
      status.gemini.error = res.ok ? null : `HTTP ${res.status}: Gemini check failed.`;
    } catch (err) {
      status.gemini.ok = false;
      status.gemini.error = err instanceof Error ? err.message : 'Gemini check failed.';
    }
  }

  if (status.v0.configured) {
    try {
      const res = await fetch('https://api.v0.dev/v1/chats?limit=1', {
        headers: {
          Authorization: `Bearer ${process.env.V0_API_KEY}`,
          Accept: 'application/json'
        }
      });
      status.v0.ok = res.ok;
      status.v0.error = res.ok ? null : `HTTP ${res.status}: v0 check failed.`;
    } catch (err) {
      status.v0.ok = false;
      status.v0.error = err instanceof Error ? err.message : 'v0 check failed.';
    }
  }

  return NextResponse.json(status);
}
