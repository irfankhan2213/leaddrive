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
  if (supabase && !lead.id.startsWith('lead_')) {
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
