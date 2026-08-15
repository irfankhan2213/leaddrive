import { generateAgenticDemoStrategy } from '@/lib/vertex';
import { createV0Demo } from '@/lib/v0';
import type { AppSettings, DemoProvider, DemoQuality, Lead, V0DemoResult } from '@/lib/types';

interface DemoEngineOptions {
  settings?: AppSettings;
  quality?: DemoQuality;
  provider?: DemoProvider;
  baseUrl: string;
}

export async function createDemoForLead(
  lead: Lead,
  options: DemoEngineOptions
): Promise<V0DemoResult> {
  const provider = resolveDemoProvider(options.provider, options.settings);
  const quality = options.quality || lead.demo_quality || options.settings?.defaultDemoQuality || 'low';

  if (provider === 'agentic') {
    return createAgenticDemo(lead, options, quality);
  }

  if (provider === 'hybrid') {
    return createHybridDemo(lead, options, quality);
  }

  return createV0Demo(
    { ...lead, demo_provider: 'v0', demo_quality: quality },
    options.settings?.v0ApiKey || process.env.V0_API_KEY,
    options.settings?.v0Model || (quality === 'high' ? 'v0-pro' : 'v0-mini'),
    quality
  );
}

export function resolveDemoProvider(provider?: DemoProvider, settings?: AppSettings): DemoProvider {
  return provider || settings?.demoProvider || 'agentic';
}

async function createAgenticDemo(
  lead: Lead,
  options: DemoEngineOptions,
  quality: DemoQuality
): Promise<V0DemoResult> {
  const strategy = await generateAgenticDemoStrategy(lead, quality, {
    projectId: options.settings?.gcpProjectId,
    location: options.settings?.gcpLocation,
    model: options.settings?.vertexModel || options.settings?.aiModel,
    enableGrounding: options.settings?.vertexGrounding
  });
  const demoArtifact = JSON.stringify(strategy);
  const strategyBase64 = Buffer.from(demoArtifact).toString('base64url');
  const demoUrl = `${options.baseUrl}/demo/${lead.id}?engine=agentic&strategy=${strategyBase64}`;

  return {
    provider: 'agentic',
    status: 'ready',
    demoUrl,
    deploymentUrl: demoUrl,
    webUrl: demoUrl,
    demoArtifact
  };
}

async function createHybridDemo(
  lead: Lead,
  options: DemoEngineOptions,
  quality: DemoQuality
): Promise<V0DemoResult> {
  const strategy = await generateAgenticDemoStrategy(lead, quality, {
    projectId: options.settings?.gcpProjectId,
    location: options.settings?.gcpLocation,
    model: options.settings?.vertexModel || options.settings?.aiModel,
    enableGrounding: options.settings?.vertexGrounding
  });

  const enhancedLead: Lead = {
    ...lead,
    demo_provider: 'hybrid',
    demo_quality: quality,
    weakness: `${lead.weakness} Agentic strategy: ${strategy.promptEnhancement}`,
    signals: [
      ...lead.signals,
      { label: 'Agentic demo strategy', value: strategy.positioning, severity: 'positive' }
    ]
  };

  const demo = await createV0Demo(
    enhancedLead,
    options.settings?.v0ApiKey || process.env.V0_API_KEY,
    options.settings?.v0Model || (quality === 'high' ? 'v0-pro' : 'v0-mini'),
    quality
  );

  return {
    ...demo,
    provider: demo.status === 'ready' ? 'hybrid' : demo.provider || 'hybrid'
  };
}
