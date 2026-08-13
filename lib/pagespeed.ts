import type { DigitalSignal, Lead } from '@/lib/types';

export interface PageSpeedAudit {
  ok: boolean;
  finalUrl: string;
  performance?: number;
  seo?: number;
  accessibility?: number;
  bestPractices?: number;
  audits: Record<string, { score?: number | null; title?: string; displayValue?: string }>;
  error?: string;
}

export async function runPageSpeedAudit(url: string): Promise<PageSpeedAudit> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) return createPageSpeedError(url, 'PAGESPEED_API_KEY is not configured.');

  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('key', apiKey);
  endpoint.searchParams.set('strategy', 'mobile');
  for (const category of ['performance', 'seo', 'accessibility', 'best-practices']) {
    endpoint.searchParams.append('category', category);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    if (!res.ok) return createPageSpeedError(url, `PageSpeed failed: ${res.status} ${await res.text()}`);
    const data = (await res.json()) as {
      id?: string;
      lighthouseResult?: {
        finalDisplayedUrl?: string;
        categories?: Record<string, { score?: number | null }>;
        audits?: Record<string, { score?: number | null; title?: string; displayValue?: string }>;
      };
    };
    const categories = data.lighthouseResult?.categories || {};
    return {
      ok: true,
      finalUrl: data.lighthouseResult?.finalDisplayedUrl || data.id || url,
      performance: scaleScore(categories.performance?.score),
      seo: scaleScore(categories.seo?.score),
      accessibility: scaleScore(categories.accessibility?.score),
      bestPractices: scaleScore(categories['best-practices']?.score),
      audits: data.lighthouseResult?.audits || {}
    };
  } catch (err) {
    return createPageSpeedError(url, err instanceof Error ? err.message : 'PageSpeed request failed.');
  } finally {
    clearTimeout(timeout);
  }
}

export function applyPageSpeedAudit(lead: Lead, audit: PageSpeedAudit): Lead {
  if (!audit.ok) {
    return {
      ...lead,
      signals: [
        ...lead.signals,
        { label: 'PageSpeed', value: audit.error || 'PageSpeed unavailable', severity: 'warning' }
      ]
    };
  }

  const signals: DigitalSignal[] = [
    ...lead.signals,
    scoreSignal('Performance', audit.performance),
    scoreSignal('SEO', audit.seo),
    scoreSignal('Accessibility', audit.accessibility),
    scoreSignal('Best practices', audit.bestPractices)
  ];
  const factorWeaknesses = determineTechnicalWeaknesses(audit);
  const score = classifyFitScore(lead, audit, factorWeaknesses);
  const weakness = factorWeaknesses[0] || lead.weakness;

  return {
    ...lead,
    signals,
    fit_score: score,
    status: score >= 70 ? 'qualified' : score >= 50 ? 'scraped' : 'skipped',
    weakness,
    qualification_reason: `${lead.qualification_reason} Technical audit: performance ${displayScore(audit.performance)}, SEO ${displayScore(audit.seo)}, accessibility ${displayScore(audit.accessibility)}. ${factorWeaknesses.join(' ')}`
  };
}

function determineTechnicalWeaknesses(audit: PageSpeedAudit) {
  const weaknesses: string[] = [];
  if ((audit.performance || 0) < 55) weaknesses.push('Mobile performance is weak enough to lose high-intent visitors before they convert.');
  if ((audit.seo || 0) < 80) weaknesses.push('SEO fundamentals need work, which can limit local search visibility.');
  if ((audit.accessibility || 0) < 80) weaknesses.push('Accessibility issues may reduce usability and trust on mobile.');

  const audits = audit.audits;
  if (audits.viewport?.score === 0) weaknesses.push('The page is not configured correctly for responsive mobile viewport behavior.');
  if (audits['meta-description']?.score === 0) weaknesses.push('The page is missing a useful meta description for search snippets.');
  if (audits['document-title']?.score === 0) weaknesses.push('The page title is missing or not descriptive enough for search.');
  if (audits['is-crawlable']?.score === 0) weaknesses.push('The page may not be crawlable by search engines.');
  if (audits['tap-targets']?.score === 0) weaknesses.push('Mobile tap targets are too small or crowded for easy conversion.');

  return [...new Set(weaknesses)];
}

function classifyFitScore(lead: Lead, audit: PageSpeedAudit, weaknesses: string[]) {
  const highTicket = /(law|legal|med|clinic|spa|dental|roof|solar|real estate|finance|consult|b2b|saas)/i.test(lead.niche);
  const reviewStrength = (lead.rating || 0) >= 4.3 && (lead.reviews_count || 0) >= 15 ? 8 : 0;
  const weaknessOpportunity = Math.min(24, weaknesses.length * 7);
  const performanceOpportunity = Math.max(0, 70 - (audit.performance || 70)) * 0.25;
  const seoOpportunity = Math.max(0, 85 - (audit.seo || 85)) * 0.2;
  const base = highTicket ? 54 : 44;

  return Math.max(1, Math.min(100, Math.round(base + reviewStrength + weaknessOpportunity + performanceOpportunity + seoOpportunity)));
}

function scoreSignal(label: string, score?: number): DigitalSignal {
  const value = score === undefined ? 'Unavailable' : `${score}/100`;
  const severity = score === undefined ? 'warning' : score < 55 ? 'critical' : score < 80 ? 'warning' : 'positive';
  return { label, value, severity };
}

function scaleScore(score?: number | null) {
  return typeof score === 'number' ? Math.round(score * 100) : undefined;
}

function displayScore(score?: number) {
  return score === undefined ? 'unavailable' : `${score}/100`;
}

function createPageSpeedError(url: string, error: string): PageSpeedAudit {
  return { ok: false, finalUrl: url, audits: {}, error };
}
