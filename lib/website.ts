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
  scrapedEmail?: string;
  scrapedPhone?: string;
  scrapedLinkedin?: string;
  isSpa: boolean;
  responseTimeMs: number;
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
  const timeout = setTimeout(() => controller.abort(), 2500);
  const startTime = Date.now();

  try {
    const res = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LeadDriveBot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const responseTimeMs = Date.now() - startTime;
    const html = await res.text();
    const lower = html.toLowerCase();
    const domain = parsedUrl.hostname.replace(/^www\./i, '');

    const emails = extractEmailsFromHtml(html, domain);
    const phones = extractPhonesFromHtml(html);
    const linkedin = extractLinkedinFromHtml(html);
    const isSpa = /<div[^>]+id=["'](root|app|__next|gatsby-focus-wrapper)["']/i.test(html) ||
                  /__NEXT_DATA__|window\.__NUXT__|react-root|gatsby/i.test(html);

    return {
      ok: res.ok,
      url,
      title: extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description: extractTag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i),
      hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
      hasBookingCue: /(book now|schedule|appointment|free consultation|request a demo|start trial|get a quote|contact us)/i.test(lower),
      hasContactCue: /(contact|call us|email|phone|tel:|mailto:)/i.test(lower),
      hasSocialCue: /(instagram\.com|linkedin\.com|facebook\.com|twitter\.com|x\.com)/i.test(lower),
      htmlSize: html.length,
      scrapedEmail: emails[0],
      scrapedPhone: phones[0],
      scrapedLinkedin: linkedin,
      isSpa,
      responseTimeMs
    };
  } catch (err) {
    return createErrorSnapshot(url, err instanceof Error ? err.message : 'Fetch failed.', Date.now() - startTime);
  } finally {
    clearTimeout(timeout);
  }
}

function createErrorSnapshot(url: string, error: string, responseTimeMs = 0): WebsiteSnapshot {
  return {
    ok: false,
    url,
    hasViewport: false,
    hasBookingCue: false,
    hasContactCue: false,
    hasSocialCue: false,
    htmlSize: 0,
    isSpa: false,
    responseTimeMs,
    error
  };
}

export function applyWebsiteSnapshot(lead: Lead, snapshot: WebsiteSnapshot): Lead {
  const updatedEmail = lead.email || snapshot.scrapedEmail;
  const updatedPhone = lead.phone || snapshot.scrapedPhone;
  const updatedLinkedin = lead.linkedin_url || snapshot.scrapedLinkedin;

  const signals: DigitalSignal[] = [
    ...lead.signals,
    {
      label: 'Website scrape',
      value: snapshot.ok ? snapshot.title || snapshot.url : snapshot.error || 'Could not fetch site',
      severity: snapshot.ok ? 'positive' : 'warning'
    },
    {
      label: 'Mobile viewport',
      value: snapshot.hasViewport ? 'Responsive viewport found' : snapshot.isSpa ? 'SPA layout detected' : 'Missing responsive viewport signal',
      severity: snapshot.hasViewport || snapshot.isSpa ? 'positive' : 'critical'
    },
    {
      label: 'Conversion CTA',
      value: snapshot.hasBookingCue
        ? 'Booking/demo CTA detected'
        : snapshot.isSpa
        ? 'SPA client-rendered layout (CTA dynamic)'
        : 'No obvious booking/demo CTA detected',
      severity: snapshot.hasBookingCue ? 'positive' : snapshot.isSpa ? 'warning' : 'critical'
    }
  ];

  if (snapshot.scrapedEmail) {
    signals.push({
      label: 'Scraped Email',
      value: snapshot.scrapedEmail,
      severity: 'positive'
    });
  }

  if (snapshot.scrapedLinkedin) {
    signals.push({
      label: 'Scraped LinkedIn',
      value: 'Found company profile link',
      severity: 'positive'
    });
  }

  const weakness = pickWebsiteWeakness(lead, snapshot);

  return {
    ...lead,
    email: updatedEmail,
    phone: updatedPhone,
    linkedin_url: updatedLinkedin,
    signals,
    weakness,
    qualification_reason: snapshot.ok
      ? `${lead.qualification_reason} Website scan: ${summarizeSnapshot(snapshot)}.`
      : `${lead.qualification_reason}`
  };
}

function pickWebsiteWeakness(lead: Lead, snapshot: WebsiteSnapshot) {
  if (!snapshot.ok && !snapshot.error?.includes('inspection skipped')) {
    return `The website could not be reliably loaded for analysis, which may indicate a technical or availability issue.`;
  }
  if (!snapshot.hasViewport && !snapshot.isSpa) {
    return `The site appears to be missing a responsive viewport setup, which can hurt mobile visitors in ${lead.city || 'the target market'}.`;
  }
  if (!snapshot.hasBookingCue && !snapshot.isSpa) {
    return `The page does not surface a clear booking, consultation, or demo CTA for visitors ready to act.`;
  }
  if (!snapshot.description) {
    return `The site lacks a strong meta description, making the offer weaker in search and link previews.`;
  }
  return lead.weakness;
}

function summarizeSnapshot(snapshot: WebsiteSnapshot) {
  const parts = [
    snapshot.title ? `title "${snapshot.title}"` : 'no title',
    snapshot.hasViewport ? 'mobile viewport present' : snapshot.isSpa ? 'SPA architecture' : 'mobile viewport missing',
    snapshot.scrapedEmail ? `email found (${snapshot.scrapedEmail})` : 'no direct email in HTML',
    snapshot.hasBookingCue ? 'CTA present' : 'CTA missing'
  ];
  return parts.join(', ');
}

function extractEmailsFromHtml(html: string, domain: string): string[] {
  const emails = new Set<string>();

  // 1. Mailto links
  const mailtoMatches = html.matchAll(/href=["']mailto:([^"?#\s]+)/gi);
  for (const m of mailtoMatches) {
    if (m[1]) {
      const email = m[1].trim().toLowerCase();
      if (isValidEmail(email)) emails.add(email);
    }
  }

  // 2. Text regex matching email address
  const textMatches = html.matchAll(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g);
  for (const m of textMatches) {
    const email = m[0].trim().toLowerCase();
    if (isValidEmail(email)) emails.add(email);
  }

  const emailList = Array.from(emails);
  emailList.sort((a, b) => {
    const aMatch = domain && a.includes(domain) ? -1 : 1;
    const bMatch = domain && b.includes(domain) ? -1 : 1;
    return aMatch - bMatch;
  });

  return emailList;
}

function isValidEmail(email: string): boolean {
  if (email.length < 5 || email.length > 100) return false;
  const invalidDomains = ['example.com', 'sentry.io', 'wixpress.com', 'schema.org', 'w3.org', 'domain.com', 'gravatar.com', 'png', 'jpg', 'svg', 'webp', 'js', 'css'];
  if (invalidDomains.some((inv) => email.includes(inv) || email.endsWith(`.${inv}`))) return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function extractPhonesFromHtml(html: string): string[] {
  const phones = new Set<string>();
  const telMatches = html.matchAll(/href=["']tel:([^"?#\s]+)/gi);
  for (const m of telMatches) {
    if (m[1]) {
      const raw = m[1].trim();
      if (raw.replace(/[^\d]/g, '').length >= 7) {
        phones.add(raw);
      }
    }
  }
  return Array.from(phones);
}

function extractLinkedinFromHtml(html: string): string | undefined {
  const match = html.match(/href=["'](https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[^"'?\s]+)/i);
  return match?.[1];
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
