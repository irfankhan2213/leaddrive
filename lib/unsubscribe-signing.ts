import { createHmac } from 'crypto';

/**
 * Signs a lead id for unsubscribe links: sig = HMAC-SHA256(leadId, secret).
 * Shared by the email renderer and /api/unsubscribe so the algorithm can
 * never drift between them.
 */
export function signLeadId(leadId: string): string {
  return createHmac('sha256', getSecret()).update(leadId).digest('hex');
}

function getSecret(): string {
  // Dedicated secret first; the service-role key is a server-only fallback.
  return process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'leaddrive-dev-secret';
}
