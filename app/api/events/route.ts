import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ events: [] });
  }

  try {
    const { data: events, error } = await supabase
      .from('outreach_events')
      .select('*, leads(company_name, contact_name)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ events: [] });
    }

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}
