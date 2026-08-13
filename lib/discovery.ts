import type { CampaignInput, LeadSource } from '@/lib/types';
import { parseLocations } from '@/lib/pipeline';

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

  if (input.source === 'google_maps') {
    return discoverGoogleMapsProspects(input, keywords);
  }

  const apifyResults = await discoverWithApify(input, keywords);
  if (apifyResults.length > 0) return apifyResults;

  return [];
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

    const res = await fetch(url);
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

  const res = await fetch(`${endpoint}?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputPayload)
  });
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
      prospect.address?.toLowerCase()
    ]
      .filter(Boolean)
      .join('|');
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(prospect);
  }

  return deduped;
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
