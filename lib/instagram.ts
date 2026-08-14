import type { DigitalSignal, Lead } from '@/lib/types';

export interface InstagramAuditResult {
  username?: string;
  fullName?: string;
  bio?: string;
  externalUrl?: string;
  email?: string;
  phone?: string;
  followersCount?: number;
  recentLikesCount?: number;
  recentPostsCount?: number;
  hasBioBookingLink?: boolean;
  signals: DigitalSignal[];
  weaknessEnhancement?: string;
  qualificationReason?: string;
}

export async function scrapeAndEnrichInstagramLead(lead: Lead): Promise<Lead> {
  const token = process.env.APIFY_TOKEN;
  const actorId = process.env.APIFY_ACTOR_ID || 'nH2AHrwxeTRJoN5hX';
  const taskId = process.env.APIFY_TASK_ID;

  const instagramUrl = lead.instagram_url;
  if (!token || !instagramUrl) {
    return lead;
  }

  const handle = extractHandleFromInstagramUrl(instagramUrl);
  if (!handle) return lead;

  try {
    const endpoint = taskId
      ? `https://api.apify.com/v2/actor-tasks/${encodeURIComponent(taskId)}/run-sync-get-dataset-items`
      : `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${endpoint}?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: [handle, instagramUrl],
        resultsLimit: 3,
        dataDetailLevel: 'basicData'
      })
    });

    clearTimeout(timeout);

    if (!res.ok) return lead;

    const items = (await res.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(items) || items.length === 0) return lead;

    const item = items[0];
    if (item.error === 'not_found') return lead;

    const bio = asString(item.biography || item.bio || item.caption);
    const fullName = asString(item.fullName || item.name || item.ownerFullName);
    const externalUrl = asString(item.externalUrl || item.url);
    const emails = extractEmails(bio);
    const phones = extractPhones(bio);
    const likes = asNumber(item.likesCount || item.likes || item.commentsCount) || 0;

    const newEmail = lead.email || emails[0];
    const newPhone = lead.phone || phones[0];
    const updatedSignals: DigitalSignal[] = [...lead.signals];

    updatedSignals.push({
      label: 'Instagram Scrape',
      value: `@${handle} active profile audited via Apify`,
      severity: 'positive'
    });

    if (likes > 0) {
      updatedSignals.push({
        label: 'Instagram Engagement',
        value: `Active social reach (~${likes} avg post interactions)`,
        severity: 'positive'
      });
    }

    const hasBookingInBio = /(book|calendly|schedule|appointment|acuity|janeapp|vagaro)/i.test(bio + externalUrl);
    if (!hasBookingInBio) {
      updatedSignals.push({
        label: 'Instagram Bio Gap',
        value: 'Bio lacks 1-tap instant booking funnel',
        severity: 'critical'
      });
    }

    // Enhance weakness with Instagram intelligence
    let enhancedWeakness = lead.weakness;
    if (!hasBookingInBio) {
      enhancedWeakness = `Drives active traffic from Instagram (@${handle}), but profile bio lacks an instant 1-click booking tool, causing mobile social visitors in ${lead.city || 'the area'} to drop off.`;
    }

    // Boost fit score for active social accounts with conversion leak
    const currentScore = typeof lead.fit_score === 'number' ? lead.fit_score : 50;
    const boostedScore = Math.min(95, currentScore + (newEmail || newPhone ? 12 : 8));

    const newReason = `${lead.qualification_reason} Instagram Intelligence: @${handle} active on Instagram with engaged local audience, but losing mobile clients from social traffic due to weak conversion funnel.`;

    return {
      ...lead,
      email: newEmail,
      phone: newPhone,
      instagram_url: lead.instagram_url || `https://www.instagram.com/${handle}`,
      fit_score: boostedScore,
      weakness: enhancedWeakness,
      qualification_reason: newReason,
      signals: updatedSignals
    };
  } catch {
    // If Apify scrape times out or fails, gracefully return lead with existing data
    return lead;
  }
}

function extractHandleFromInstagramUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length > 0) return parts[0];
  } catch {
    const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

function extractEmails(text: string): string[] {
  const matches = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
  return [...new Set(matches.map((e) => e.toLowerCase()))];
}

function extractPhones(text: string): string[] {
  const matches = text.match(/\+?\d[\d\s().-]{7,}\d/g) || [];
  return [...new Set(matches.map((p) => p.trim()))];
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown) {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : undefined;
}
