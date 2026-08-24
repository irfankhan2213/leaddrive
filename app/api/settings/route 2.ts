import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api-auth';
import { getUserSettings, saveUserSettings, toPublicSettings } from '@/lib/settings';
import type { AppSettings } from '@/lib/types';

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  try {
    const settings = await getUserSettings(auth.user.id);
    return NextResponse.json({ settings: toPublicSettings(settings) });
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', context: 'GET /api/settings', message: err instanceof Error ? err.message : String(err) })
    );
    return NextResponse.json({ error: 'Failed to load settings.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  let body: Partial<AppSettings>;
  try {
    body = (await req.json()) as Partial<AppSettings>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Settings payload required.' }, { status: 400 });
  }

  // Clamp numeric guardrails server-side.
  if (body.maxAutoDemosPerCampaign !== undefined) {
    body.maxAutoDemosPerCampaign = Math.min(Math.max(Number(body.maxAutoDemosPerCampaign) || 0, 0), 25);
  }
  if (body.minDemoScore !== undefined) {
    body.minDemoScore = Math.min(Math.max(Number(body.minDemoScore) || 0, 0), 100);
  }

  try {
    const { publicSettings } = await saveUserSettings(auth.user.id, body);
    return NextResponse.json({ settings: publicSettings });
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', context: 'PUT /api/settings', message: err instanceof Error ? err.message : String(err) })
    );
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save settings.' },
      { status: 500 }
    );
  }
}
