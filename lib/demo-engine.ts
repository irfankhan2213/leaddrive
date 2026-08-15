import { createV0Demo } from '@/lib/v0';
import type { AppSettings, DemoProvider, DemoQuality, Lead, V0DemoResult } from '@/lib/types';

interface DemoEngineOptions {
  settings?: AppSettings;
  quality?: DemoQuality;
  provider?: DemoProvider;
  baseUrl?: string;
}

export async function createDemoForLead(
  lead: Lead,
  options: DemoEngineOptions
): Promise<V0DemoResult> {
  const quality = options.quality || lead.demo_quality || options.settings?.defaultDemoQuality || 'low';

  return createV0Demo(
    { ...lead, demo_provider: 'v0', demo_quality: quality },
    options.settings?.v0ApiKey || process.env.V0_API_KEY,
    options.settings?.v0Model || (quality === 'high' ? 'v0-pro' : 'v0-mini'),
    quality
  );
}

export function resolveDemoProvider(provider?: DemoProvider, settings?: AppSettings): DemoProvider {
  return 'v0';
}
