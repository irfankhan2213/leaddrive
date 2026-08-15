import fs from 'fs';
import path from 'path';
import type { AgenticStrategy, Lead } from '@/lib/types';

interface PublishedDemoRecord {
  leadId: string;
  strategy: AgenticStrategy;
  lead?: Partial<Lead>;
  publishedAt: string;
  demoUrl: string;
}

// In-memory cache for fast sub-millisecond retrieval
const memoryCache = new Map<string, PublishedDemoRecord>();

function getStoragePath(): string {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), '.data');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
  return path.join(dir, 'published-demos.json');
}

function loadFromDisk(): Record<string, PublishedDemoRecord> {
  try {
    const file = getStoragePath();
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data) as Record<string, PublishedDemoRecord>;
    }
  } catch {}
  return {};
}

function saveToDisk(records: Record<string, PublishedDemoRecord>): void {
  try {
    const file = getStoragePath();
    fs.writeFileSync(file, JSON.stringify(records, null, 2), 'utf8');
  } catch {}
}

export function publishAgenticDemo(
  leadId: string,
  strategy: AgenticStrategy,
  baseUrl: string,
  lead?: Partial<Lead>
): string {
  const demoArtifact = JSON.stringify(strategy);
  const strategyBase64 = Buffer.from(demoArtifact).toString('base64url');
  
  // Clean canonical published URL + portable fallback
  const demoUrl = `${baseUrl}/demo/${encodeURIComponent(leadId)}?engine=agentic&strategy=${strategyBase64}`;

  const record: PublishedDemoRecord = {
    leadId,
    strategy,
    lead,
    publishedAt: new Date().toISOString(),
    demoUrl
  };

  // 1. Update memory cache
  memoryCache.set(leadId, record);

  // 2. Persist to disk
  try {
    const diskRecords = loadFromDisk();
    diskRecords[leadId] = record;
    saveToDisk(diskRecords);
  } catch {}

  return demoUrl;
}

export function getPublishedDemo(leadId: string): PublishedDemoRecord | null {
  // 1. Check memory cache
  if (memoryCache.has(leadId)) {
    return memoryCache.get(leadId)!;
  }

  // 2. Check disk storage
  const diskRecords = loadFromDisk();
  if (diskRecords[leadId]) {
    memoryCache.set(leadId, diskRecords[leadId]);
    return diskRecords[leadId];
  }

  return null;
}
