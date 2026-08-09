import type { Lead, V0DemoResult } from '@/lib/types';
import { buildDemoPrompt } from '@/lib/pipeline';

export async function createV0Demo(lead: Lead): Promise<V0DemoResult> {
  const apiKey = process.env.V0_API_KEY;
  if (!apiKey) {
    return {
      demoUrl: `/demo/${lead.id}`,
      webUrl: `/demo/${lead.id}`
    };
  }

  const chatRes = await fetch('https://api.v0.dev/v1/chats', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system:
        'You generate polished, production-quality Next.js and Tailwind demos for agency cold outreach. Keep copy specific, credible, and conversion focused.',
      message: lead.demo_prompt || buildDemoPrompt(lead),
      chatPrivacy: 'unlisted',
      responseMode: 'sync',
      modelConfiguration: {
        modelId: 'v0-pro',
        imageGenerations: false,
        thinking: false
      }
    })
  });

  if (!chatRes.ok) {
    throw new Error(`v0 chat creation failed: ${chatRes.status}`);
  }

  const chat = (await chatRes.json()) as {
    id?: string;
    webUrl?: string;
    latestVersion?: { id?: string; demoUrl?: string; status?: string };
  };

  const versionId = chat.latestVersion?.id;
  if (!chat.id || !versionId) {
    return {
      chatId: chat.id,
      versionId,
      demoUrl: chat.latestVersion?.demoUrl,
      webUrl: chat.webUrl
    };
  }

  const deploymentRes = await fetch('https://api.v0.dev/v1/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId: chat.id,
      versionId
    })
  });

  if (!deploymentRes.ok) {
    return {
      chatId: chat.id,
      versionId,
      demoUrl: chat.latestVersion?.demoUrl,
      webUrl: chat.webUrl
    };
  }

  const deployment = (await deploymentRes.json()) as { webUrl?: string; id?: string };
  return {
    chatId: chat.id,
    versionId,
    demoUrl: chat.latestVersion?.demoUrl || deployment.webUrl,
    deploymentUrl: deployment.webUrl,
    webUrl: chat.webUrl
  };
}
