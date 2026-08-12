import { NextResponse } from 'next/server';
import { createV0Demo } from '@/lib/v0';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { DemoProvider, Lead } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as Lead | { lead: Lead; provider?: DemoProvider };
  const lead = 'lead' in body ? body.lead : body;
  const provider: DemoProvider = 'lead' in body ? body.provider || 'local' : 'local';
  if (!lead?.id || !lead?.company_name) {
    return NextResponse.json({ error: 'Lead id and company_name are required.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const isSupabaseLead = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.id);
  if (lead.demo_url && provider !== 'v0') {
    return NextResponse.json({
      provider: 'local',
      status: 'ready',
      reused: true,
      demoUrl: lead.demo_url
    });
  }

  if (provider === 'local') {
    const demoUrl = `/demo/${lead.id}`;
    if (supabase && isSupabaseLead) {
      await supabase.from('leads').update({ status: 'demo_ready', demo_url: demoUrl }).eq('id', lead.id);
    }

    return NextResponse.json({
      provider: 'local',
      status: 'ready',
      demoUrl
    });
  }

  try {
    const demo = await createV0Demo(lead);
    const demoUrl = demo.deploymentUrl || demo.demoUrl || `/demo/${lead.id}`;

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
      demoUrl
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Demo generation failed.';
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
