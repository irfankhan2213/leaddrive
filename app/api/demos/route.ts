import { NextResponse } from 'next/server';
import { createV0Demo } from '@/lib/v0';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Lead } from '@/lib/types';

export async function POST(req: Request) {
  const lead = (await req.json()) as Lead;
  if (!lead?.id || !lead?.company_name) {
    return NextResponse.json({ error: 'Lead id and company_name are required.' }, { status: 400 });
  }

  const demo = await createV0Demo(lead);
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
    demoUrl
  });
}
