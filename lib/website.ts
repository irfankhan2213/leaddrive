import type { DigitalSignal, Lead } from '@/lib/types';

export interface WebsiteSnapshot {
  ok: boolean;
  url: string;
  title?: string;
  description?: string;
  hasViewport: boolean;
  hasBookingCue: boolean;
  hasContactCue: boolean;
  hasSocialCue: boolean;
  htmlSize: number;
  error?: string;
}

export async function inspectWebsite(url: string): Promise<WebsiteSnapshot> {
  // Security & Fast path: Validate URL scheme to prevent SSRF against internal resources (localhost, 169.254, 10.x, etc.)
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return createErrorSnapshot(url, 'Invalid protocol.');
    }

    const host = parsedUrl.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host.startsWith('127.') ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host.includes('.example') ||
      host.includes('example.com') ||
      host.includes('example.org') ||
      host.includes('example.net')
    ) {
      return createErrorSnapshot(url, 'Domain inspection skipped for internal/mock host.');
    }
  } catch {
    return createErrorSnapshot(url, 'Invalid URL format.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'LeadDriveBot/0.1 (+https://leaddrive.app)',
        Accept: 'text/html,application/xhtml+xml'
      }
    });
    const html = await res.text();
    const lower = html.toLowerCase();

    return {
      ok: res.ok,
      url,
      title: extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description: extractTag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i),
      hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
      hasBookingCue: /(book now|schedule|appointment|free consultation|request a demo|start trial)/i.test(html),
      hasContactCue: /(contact|call us|email|phone|tel:|mailto:)/i.test(html),
      hasSocialCue: /(instagram\.com|linkedin\.com|facebook\.com|twitter\.com|x\.com)/i.test(lower),
      htmlSize: html.length
    };
  } catch (err) {
    return createErrorSnapshot(url, err instanceof Error ? err.message : 'Fetch failed.');
  } finally {
    clearTimeout(timeout);
  }
}

function createErrorSnapshot(url: string, error: string): WebsiteSnapshot {
  return {
    ok: false,
    url,
    hasViewport: false,
    hasBookingCue: false,
    hasContactCue: false,
    hasSocialCue: false,
    htmlSize: 0,
    error
  };
}

export function applyWebsiteSnapshot(lead: Lead, snapshot: WebsiteSnapshot): Lead {
  const signals: DigitalSignal[] = [
    ...lead.signals,
    {
      label: 'Website scrape',
      value: snapshot.ok ? snapshot.title || snapshot.url : snapshot.error || 'Could not fetch site',
      severity: snapshot.ok ? 'positive' : 'warning'
    },
    {
      label: 'Mobile viewport',
      value: snapshot.hasViewport ? 'Responsive viewport found' : 'Missing responsive viewport signal',
      severity: snapshot.hasViewport ? 'positive' : 'critical'
    },
    {
      label: 'Conversion CTA',
      value: snapshot.hasBookingCue ? 'Booking/demo CTA detected' : 'No obvious booking/demo CTA detected',
      severity: snapshot.hasBookingCue ? 'positive' : 'critical'
    }
  ];

  const weakness = pickWebsiteWeakness(lead, snapshot);
  return {
    ...lead,
    signals,
    weakness,
    qualification_reason: snapshot.ok
      ? `${lead.qualification_reason} Website scan found: ${summarizeSnapshot(snapshot)}`
      : `${lead.qualification_reason}`
  };
}

function pickWebsiteWeakness(lead: Lead, snapshot: WebsiteSnapshot) {
  if (!snapshot.ok && !snapshot.error?.includes('inspection skipped')) {
    return `The website could not be reliably loaded for analysis, which may indicate a technical or availability issue.`;
  }
  if (!snapshot.hasViewport) return `The site appears to be missing a responsive viewport setup, which can hurt mobile visitors in ${lead.city || 'the target market'}.`;
  if (!snapshot.hasBookingCue) return `The page does not surface a clear booking, consultation, or demo CTA for visitors ready to act.`;
  if (!snapshot.description) return `The site lacks a strong meta description, making the offer weaker in search and link previews.`;
  return lead.weakness;
}

function summarizeSnapshot(snapshot: WebsiteSnapshot) {
  const parts = [
    snapshot.title ? `title "${snapshot.title}"` : 'no title',
    snapshot.hasViewport ? 'mobile viewport present' : 'mobile viewport missing',
    snapshot.hasBookingCue ? 'CTA cue present' : 'CTA cue missing',
    snapshot.hasContactCue ? 'contact cue present' : 'contact cue missing'
  ];
  return parts.join(', ');
}

function extractTag(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  if (!match?.[1]) return undefined;
  return decodeHtml(match[1].replace(/\s+/g, ' ').trim()).slice(0, 180);
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
