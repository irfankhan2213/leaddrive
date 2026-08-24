import { requireUser } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserSettings } from '@/lib/settings';
import { normalizeParsed, parseCampaignRequest } from '@/lib/campaign-request';
import { runCampaign, type CampaignEvent } from '@/lib/campaign-runner';
import { logError } from '@/lib/http';

export const maxDuration = 300;

/**
 * Live campaign creation over Server-Sent Events.
 *
 * POST { request: "dentists in the uk", limit?: number }
 * -> text/event-stream of CampaignEvent frames, ending with a `done`
 *    frame that carries the full campaign + leads payload (same shape
 *    as the classic POST /api/campaigns response).
 */
export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const rl = checkRateLimit(req, 'campaigns_live', 10, 60_000);
  if (!rl.ok) {
    return Response.json({ error: `Rate limit exceeded. Try again in ${rl.retryAfterSec}s.` }, { status: 429 });
  }

  let body: { request?: string; limit?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const request = String(body.request || '').trim();
  if (!request) {
    return Response.json({ error: 'Describe who you want to reach, e.g. "dentists in the UK".' }, { status: 400 });
  }
  if (request.length > 500) {
    return Response.json({ error: 'Request is too long — keep it under 500 characters.' }, { status: 400 });
  }
  const limitOverride = body.limit ? Math.min(Math.max(Number(body.limit), 1), 100) : undefined;

  const userId = auth.user.id;
  const supabase = auth.supabase;
  const baseUrl = getBaseUrl(req);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let closed = false;

      const send = (event: CampaignEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          closed = true;
        }
      };

      try {
        const settings = await getUserSettings(userId);

        send({ type: 'status', phase: 'keywords', message: 'Analyzing your request…' });
        const parsed = await parseCampaignRequest(request, settings, limitOverride);
        const input = normalizeParsed(parsed);

        send({
          type: 'status',
          phase: 'keywords',
          message: `Plan ready: ${input.audience}${input.locations ? ` in ${input.locations}` : ''} · ${input.limit} leads · ${input.channel} outreach`
        });

        let finalEvent: CampaignEvent | null = null;
        await runCampaign({
          input,
          settings,
          userId,
          baseUrl,
          supabase,
          emit: (event) => {
            if (event.type === 'done') {
              finalEvent = event;
              return; // sent after the loop below
            }
            send(event);
          }
        });

        if (finalEvent) send(finalEvent);
      } catch (err) {
        logError('POST /api/campaigns/live', err);
        send({ type: 'error', message: err instanceof Error ? err.message : 'Campaign failed.' });
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed by client disconnect
        }
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}

function getBaseUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configured = process.env.APP_BASE_URL;
  if (!configured || configured.includes('localhost')) return requestOrigin;
  return configured;
}
