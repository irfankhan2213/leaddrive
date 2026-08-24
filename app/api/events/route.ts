import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api-auth';

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  try {
    // RLS scopes these events to leads owned by the caller.
    const { data: events, error } = await auth.supabase
      .from('outreach_events')
      .select('*, leads(company_name, contact_name)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error(JSON.stringify({ level: 'error', context: 'GET /api/events', message: error.message }));
      return NextResponse.json({ events: [] });
    }

    return NextResponse.json({ events });
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', context: 'GET /api/events', message: err instanceof Error ? err.message : String(err) })
    );
    return NextResponse.json({ events: [] });
  }
}
