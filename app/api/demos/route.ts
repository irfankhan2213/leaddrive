import { NextResponse } from 'next/server';
import { createV0Demo } from '@/lib/v0';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { AppSettings, Lead } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as Lead | { lead: Lead; settings?: AppSettings };
  const lead = 'lead' in body ? body.lead : body;
  const settings = 'lead' in body ? body.settings : undefined;

  if (!lead?.id || !lead?.company_name) {
    return NextResponse.json({ error: 'Lead id and company_name are required.' }, { status: 400 });
  }

  const v0ApiKey = settings?.v0ApiKey || process.env.V0_API_KEY;
  const v0Model = settings?.v0Model || process.env.V0_MODEL;

  try {
    // v0 site builder engine using configured settings or env vars
    const demo = await createV0Demo(lead, v0ApiKey, v0Model);
    const demoUrl = demo.deploymentUrl || demo.demoUrl || `/demo/${lead.id}`;

    const supabase = getSupabaseAdmin();
    const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);

    if (supabase && isSupabaseLead) {
      await supabase
        .from('leads')
        .update({
          status: 'demo_ready',
          demo_url: demoUrl,
          v0_chat_id: demo.chatId,
          v0_version_id: demo.versionId
        })
        .eq('id', lead.id);
    }

    return NextResponse.json({
      ...demo,
      provider: 'v0',
      demoUrl
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'v0 site building failed.';
    const supabase = getSupabaseAdmin();
    const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);

    if (supabase && isSupabaseLead) {
      await supabase.from('leads').update({ status: 'demo_failed' }).eq('id', lead.id);
    }

    return NextResponse.json(
      {
        provider: 'v0',
        status: 'failed',
        error: message,
        demoUrl: `/demo/${lead.id}`
      },
      { status: 502 }
    );
  }
}
