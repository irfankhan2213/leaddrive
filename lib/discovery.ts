import type { CampaignInput, LeadSource } from '@/lib/types';
import { parseLocations } from '@/lib/pipeline';
import { fetchWithRetry, fetchWithTimeout } from '@/lib/http';

export interface DiscoveredProspect {
  company_name: string;
  website_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  rating?: number;
  reviews_count?: number;
  matched_keyword?: string;
  source_url?: string;
  source: LeadSource;
}

export async function discoverProspects(input: CampaignInput, keywords: string[]): Promise<DiscoveredProspect[]> {
  if (input.source === 'csv' || input.source === 'url_list') {
    return [];
  }

  if (input.source === 'instagram') {
    return discoverInstagramProspects(input, keywords);
  }

  if (input.source === 'google_maps') {
    return discoverGoogleMapsProspects(input, keywords);
  }

  const apifyResults = await discoverWithApify(input, keywords);
  if (apifyResults.length > 0) return apifyResults;

  return [];
}

export async function discoverInstagramProspects(input: CampaignInput, keywords: string[]): Promise<DiscoveredProspect[]> {
  const token = process.env.APIFY_TOKEN;
  const actorId = process.env.APIFY_ACTOR_ID || 'nH2AHrwxeTRJoN5hX'; // User's Instagram Scraper Actor
  const taskId = process.env.APIFY_TASK_ID;
  const serpKey = process.env.SERPAPI_KEY;
  const limit = Math.max(1, Math.min(input.limit || 25, 100));
  const locations = parseLocations(input.locations);
  const primaryLocation = locations[0] || '';

  const results: DiscoveredProspect[] = [];

  // 1. Check if user provided explicit Instagram usernames or post/profile URLs in sourcePayload
  const manualHandles = extractInstagramHandlesFromPayload(input.sourcePayload);
  let targetHandlesOrUrls: string[] = manualHandles;

  // 2. If no manual handles provided, find real Instagram accounts using Google search (site:instagram.com)
  if (targetHandlesOrUrls.length === 0 && serpKey) {
    try {
      const searchQueries = buildInstagramSearchQueries(input, keywords, locations);
      for (const query of searchQueries) {
        if (targetHandlesOrUrls.length >= limit) break;
        const serpUrl = new URL('https://serpapi.com/search.json');
        serpUrl.searchParams.set('q', `site:instagram.com ${query}`);
        serpUrl.searchParams.set('api_key', serpKey);
        serpUrl.searchParams.set('num', String(Math.min(limit, 20)));

        const res = await fetchWithRetry(serpUrl, {}, { timeoutMs: 20_000, retries: 1 });
        if (res.ok) {
          const data = (await res.json()) as { organic_results?: Array<{ link?: string; title?: string; snippet?: string }> };
          const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
          for (const item of organic) {
            if (!item.link || !item.link.includes('instagram.com')) continue;
            const handle = extractHandleFromInstagramUrl(item.link);
            if (handle && !['p', 'reel', 'explore', 'stories', 'tv', 'tags'].includes(handle.toLowerCase())) {
              targetHandlesOrUrls.push(item.link);

              // Pre-populate prospect from Google metadata
              const emails = extractEmails(item.snippet || '');
              const phones = extractPhones(item.snippet || '');
              const companyName = cleanInstagramTitle(item.title || handle);

              results.push({
                company_name: companyName,
                website_url: undefined,
                email: emails[0],
                phone: phones[0],
                city: primaryLocation,
                matched_keyword: query,
                source_url: item.link,
                source: 'instagram'
              });
            }
          }
        }
      }
    } catch {
      // Continue to Apify scrape
    }
  }

  // 3. If still no handles, generate algorithmic niche handles for Apify scrape
  if (targetHandlesOrUrls.length === 0) {
    const cleanAudience = input.audience.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLoc = primaryLocation.toLowerCase().replace(/[^a-z0-9]/g, '');
    targetHandlesOrUrls = [
      `${cleanAudience}${cleanLoc}`,
      `${cleanLoc}${cleanAudience}`,
      cleanAudience
    ].filter(Boolean);
  }

  // 4. Scrape & enrich profiles/posts using Apify Instagram Scraper Actor
  if (token && targetHandlesOrUrls.length > 0) {
    try {
      const endpoint = taskId
        ? `https://api.apify.com/v2/actor-tasks/${encodeURIComponent(taskId)}/run-sync-get-dataset-items`
        : `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items`;

      const inputPayload = {
        username: targetHandlesOrUrls.slice(0, Math.min(limit, 20)),
        resultsLimit: limit,
        dataDetailLevel: 'basicData'
      };

      const res = await fetchWithTimeout(`${endpoint}?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputPayload)
      }, 120_000);

      if (res.ok) {
        const apifyItems = (await res.json()) as Array<Record<string, unknown>>;
        for (const item of apifyItems) {
          const username = asString(item.ownerUsername || item.username || item.author);
          if (!username || item.error === 'not_found') continue;

          const caption = asString(item.caption || item.text || item.biography || item.bio);
          const fullName = asString(item.ownerFullName || item.fullName || item.name || item.title);
          const companyName = fullName || formatHandleToCompanyName(username);
          const emails = extractEmails(caption);
          const phones = extractPhones(caption);
          const website = extractUrlFromText(caption) || (item.externalUrl ? asString(item.externalUrl) : undefined);

          results.push({
            company_name: companyName,
            website_url: website,
            email: emails[0],
            phone: phones[0],
            city: primaryLocation,
            // NOTE: engagement metrics are not customer ratings. Fabricating
            // one here would poison fit-scoring and outreach claims, so both
            // are left unset and scored as "unknown".
            matched_keyword: keywords[0] || input.audience,
            source_url: `https://www.instagram.com/${username}`,
            source: 'instagram'
          });
        }
      }
    } catch {
      // Continue with any discovered results
    }
  }

  return dedupeProspects(results).slice(0, limit);
}

async function discoverGoogleMapsProspects(input: CampaignInput, keywords: string[]) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error('SERPAPI_KEY is required for Google Maps lead discovery.');

  const limit = Math.max(1, Math.min(input.limit || 25, 100));
  const locations = parseLocations(input.locations);
  const queries = buildSearchQueries(input, keywords, locations);
  const results: DiscoveredProspect[] = [];

  for (const query of queries) {
    if (results.length >= limit) break;
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google_maps');
    url.searchParams.set('q', query.q);
    url.searchParams.set('type', 'search');
    url.searchParams.set('api_key', apiKey);

    const res = await fetchWithRetry(url, {}, { timeoutMs: 20_000, retries: 1 });
    if (!res.ok) throw new Error(`SerpAPI Google Maps failed: ${res.status} ${await res.text()}`);
    const data = (await res.json()) as {
      local_results?: Array<Record<string, unknown>>;
      place_results?: Record<string, unknown>;
      error?: string;
    };
    if (data.error) throw new Error(`SerpAPI error: ${data.error}`);

    const localResults = Array.isArray(data.local_results) ? data.local_results : [];
    for (const item of localResults) {
      const prospect = mapSerpApiResult(item, input, query.q, query.location);
      if (!prospect.company_name) continue;
      results.push(prospect);
      if (results.length >= limit) break;
    }
  }

  return dedupeProspects(results).slice(0, limit);
}

async function discoverWithApify(input: CampaignInput, keywords: string[]) {
  const token = process.env.APIFY_TOKEN;
  const actorId = process.env.APIFY_ACTOR_ID;
  const taskId = process.env.APIFY_TASK_ID;
  if (!token || (!actorId && !taskId)) return [];

  const searchQueries = buildSearchQueries(input, keywords, parseLocations(input.locations)).map((query) => query.q);
  const inputPayload = {
    searchStringsArray: searchQueries,
    queries: searchQueries,
    maxCrawledPlacesPerSearch: Math.max(1, Math.min(input.limit || 25, 100)),
    maxItems: Math.max(1, Math.min(input.limit || 25, 100)),
    language: 'en'
  };
  const endpoint = taskId
    ? `https://api.apify.com/v2/actor-tasks/${encodeURIComponent(taskId)}/run-sync-get-dataset-items`
    : `https://api.apify.com/v2/acts/${encodeURIComponent(actorId || '')}/run-sync-get-dataset-items`;

  const res = await fetchWithTimeout(`${endpoint}?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputPayload)
  }, 120_000);
  if (!res.ok) throw new Error(`Apify discovery failed: ${res.status} ${await res.text()}`);

  const data = (await res.json()) as Array<Record<string, unknown>>;
  return dedupeProspects(
    data.map((item) => ({
      company_name: asString(item.title || item.name || item.companyName || item.businessName),
      website_url: normalizeUrl(asString(item.website || item.url || item.websiteUrl)),
      phone: asString(item.phone || item.phoneNumber),
      address: asString(item.address || item.street),
      city: asString(item.city) || parseLocations(input.locations)[0],
      rating: asNumber(item.rating || item.stars),
      reviews_count: asNumber(item.reviewsCount || item.reviews || item.reviewCount),
      matched_keyword: searchQueries[0],
      source: input.source
    }))
  ).slice(0, input.limit || 25);
}

function buildSearchQueries(input: CampaignInput, keywords: string[], locations: string[]) {
  const baseKeywords = keywords.length ? keywords : [input.audience];
  const locs = locations.length ? locations : [''];
  const queries: Array<{ q: string; location?: string }> = [];

  for (const location of locs) {
    for (const keyword of baseKeywords) {
      const alreadyLocalized = location && keyword.toLowerCase().includes(location.toLowerCase());
      queries.push({
        q: alreadyLocalized || !location ? keyword : `${keyword} in ${location}`,
        location: location || undefined
      });
    }
  }

  return queries.slice(0, 8);
}

function buildInstagramSearchQueries(input: CampaignInput, keywords: string[], locations: string[]) {
  const cleanAudience = input.audience.replace(/with weak mobile booking|outdated websites/gi, '').trim();
  const locs = locations.length ? locations : [''];
  const queries: string[] = [];

  for (const loc of locs) {
    if (loc) {
      queries.push(`"${cleanAudience}" "${loc}"`);
      queries.push(`${cleanAudience} in ${loc}`);
    } else {
      queries.push(`"${cleanAudience}"`);
    }
  }

  return [...new Set(queries)].slice(0, 6);
}

function mapSerpApiResult(
  item: Record<string, unknown>,
  input: CampaignInput,
  matchedKeyword: string,
  fallbackCity?: string
): DiscoveredProspect {
  return {
    company_name: asString(item.title || item.name),
    website_url: normalizeUrl(asString(item.website)),
    phone: asString(item.phone),
    address: asString(item.address),
    city: inferCityFromAddress(asString(item.address)) || fallbackCity || parseLocations(input.locations)[0],
    rating: asNumber(item.rating),
    reviews_count: asNumber(item.reviews),
    matched_keyword: matchedKeyword,
    source_url: asString(item.place_id_search || item.link),
    source: 'google_maps'
  };
}

export function dedupeProspects(prospects: DiscoveredProspect[]) {
  const seen = new Set<string>();
  const deduped: DiscoveredProspect[] = [];

  for (const prospect of prospects) {
    const key = [
      prospect.website_url?.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''),
      prospect.company_name.toLowerCase(),
      prospect.source_url?.toLowerCase()
    ]
      .filter(Boolean)
      .join('|');
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(prospect);
  }

  deduped.sort((a, b) => {
    const aContact = (a.email ? 2 : 0) + (a.phone ? 1 : 0);
    const bContact = (b.email ? 2 : 0) + (b.phone ? 1 : 0);
    return bContact - aContact;
  });

  return deduped;
}

function extractInstagramHandlesFromPayload(payload?: string): string[] {
  if (!payload || !payload.trim()) return [];
  const lines = payload.split(/[\n,;]/).map((l) => l.trim()).filter(Boolean);
  const handles: string[] = [];

  for (const line of lines) {
    if (line.includes('instagram.com/')) {
      const handle = extractHandleFromInstagramUrl(line);
      if (handle) handles.push(handle);
    } else if (line.startsWith('@')) {
      handles.push(line.replace(/^@/, ''));
    } else if (/^[a-zA-Z0-9._]{2,30}$/.test(line)) {
      handles.push(line);
    }
  }

  return [...new Set(handles)];
}

function extractHandleFromInstagramUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length > 0) return parts[0];
  } catch {
    // Fallback regex
    const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

function formatHandleToCompanyName(handle: string): string {
  return handle
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanInstagramTitle(title: string): string {
  return title
    .replace(/\(@[a-zA-Z0-9._]+\)/gi, '')
    .replace(/• Instagram photos and videos/gi, '')
    .replace(/• Instagram/gi, '')
    .replace(/on Instagram/gi, '')
    .trim()
    .replace(/[-|].*$/, '')
    .trim();
}

function extractEmails(text: string): string[] {
  const matches = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
  return [...new Set(matches.map((e) => e.toLowerCase()))];
}

function extractPhones(text: string): string[] {
  const matches = text.match(/\+?\d[\d\s().-]{7,}\d/g) || [];
  return [...new Set(matches.map((p) => p.trim()))];
}

function extractUrlFromText(text: string): string | undefined {
  const match = text.match(/https?:\/\/[^\s"'<>]+/i);
  return match?.[0];
}

function normalizeUrl(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.includes('.')) return `https://${url}`;
  return undefined;
}

function inferCityFromAddress(address?: string) {
  if (!address) return undefined;
  const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2];
  return undefined;
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown) {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : undefined;
}
