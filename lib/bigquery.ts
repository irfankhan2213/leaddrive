import { BigQuery } from '@google-cloud/bigquery';
import type { Lead, OutreachEvent } from '@/lib/types';
import path from 'path';
import fs from 'fs';

function resolveGcpCredentials() {
  const projectId = process.env.GCP_PROJECT_ID || 'skillful-fx-467601-h4';
  const location = process.env.GCP_LOCATION || 'us-central1';

  try {
    const keyPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'gcp-service-account.json');
    if (fs.existsSync(keyPath)) {
      return { projectId, location, keyFilename: keyPath };
    }
  } catch {
    // Ignore fallback
  }

  return { projectId, location };
}

let bigqueryClient: BigQuery | null = null;

export function getBigQueryClient(): BigQuery {
  if (!bigqueryClient) {
    const auth = resolveGcpCredentials();
    bigqueryClient = new BigQuery({
      projectId: auth.projectId,
      keyFilename: auth.keyFilename,
      location: auth.location
    });
  }
  return bigqueryClient;
}

const DATASET_ID = process.env.BIGQUERY_DATASET || 'leaddrive_analytics';
let schemaReadyPromise: Promise<boolean> | null = null;

export async function ensureBigQuerySchema(): Promise<boolean> {
  try {
    const bq = getBigQueryClient();
    const dataset = bq.dataset(DATASET_ID);

    const [datasetExists] = await dataset.exists();
    if (!datasetExists) {
      await dataset.create({
        location: process.env.GCP_LOCATION || 'us-central1',
        description: 'LeadDrive B2B Prospecting & Outreach Analytics'
      });
    }

    const leadsTable = dataset.table('leads');
    const [leadsExists] = await leadsTable.exists();
    if (!leadsExists) {
      await leadsTable.create({
        schema: [
          { name: 'id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'campaign_id', type: 'STRING', mode: 'NULLABLE' },
          { name: 'company_name', type: 'STRING', mode: 'REQUIRED' },
          { name: 'contact_name', type: 'STRING', mode: 'NULLABLE' },
          { name: 'email', type: 'STRING', mode: 'NULLABLE' },
          { name: 'phone', type: 'STRING', mode: 'NULLABLE' },
          { name: 'website_url', type: 'STRING', mode: 'NULLABLE' },
          { name: 'city', type: 'STRING', mode: 'NULLABLE' },
          { name: 'niche', type: 'STRING', mode: 'NULLABLE' },
          { name: 'status', type: 'STRING', mode: 'REQUIRED' },
          { name: 'fit_score', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'weakness', type: 'STRING', mode: 'NULLABLE' },
          { name: 'demo_url', type: 'STRING', mode: 'NULLABLE' },
          { name: 'demo_quality', type: 'STRING', mode: 'NULLABLE' },
          { name: 'demo_provider', type: 'STRING', mode: 'NULLABLE' },
          { name: 'source', type: 'STRING', mode: 'NULLABLE' },
          { name: 'rating', type: 'FLOAT', mode: 'NULLABLE' },
          { name: 'reviews_count', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'opens', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'clicks', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'replies', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'created_at', type: 'TIMESTAMP', mode: 'NULLABLE' }
        ]
      });
    }

    const eventsTable = dataset.table('outreach_events');
    const [eventsExists] = await eventsTable.exists();
    if (!eventsExists) {
      await eventsTable.create({
        schema: [
          { name: 'id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'lead_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'event_type', type: 'STRING', mode: 'REQUIRED' },
          { name: 'channel', type: 'STRING', mode: 'NULLABLE' },
          { name: 'payload', type: 'STRING', mode: 'NULLABLE' },
          { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' }
        ]
      });
    }

    return true;
  } catch (err) {
    console.warn('[BigQuery] Schema initialization warning:', err instanceof Error ? err.message : err);
    return false;
  }
}

export async function streamLeadToBigQuery(lead: Lead): Promise<boolean> {
  if (process.env.BIGQUERY_ENABLED === 'false') return false;

  try {
    await ensureBigQuerySchemaOnce();
    const bq = getBigQueryClient();
    const table = bq.dataset(DATASET_ID).table('leads');

    const row = {
      id: lead.id,
      campaign_id: lead.campaign_id || null,
      company_name: lead.company_name,
      contact_name: lead.contact_name || null,
      email: lead.email || null,
      phone: lead.phone || null,
      website_url: lead.website_url || null,
      city: lead.city || null,
      niche: lead.niche || null,
      status: lead.status,
      fit_score: lead.fit_score || 0,
      weakness: lead.weakness || null,
      demo_url: lead.demo_url || null,
      demo_quality: lead.demo_quality || 'low',
      demo_provider: lead.demo_provider || 'v0',
      source: lead.source || 'google_maps',
      rating: lead.rating || null,
      reviews_count: lead.reviews_count || null,
      opens: lead.opens || 0,
      clicks: lead.clicks || 0,
      replies: lead.replies || 0,
      created_at: new Date().toISOString()
    };

    await table.insert([row], { ignoreUnknownValues: true });
    return true;
  } catch (err) {
    console.warn('[BigQuery] Lead stream warning:', err instanceof Error ? err.message : err);
    return false;
  }
}

export async function streamEventToBigQuery(
  event: {
    id?: string;
    lead_id: string;
    event_type: string;
    channel?: string;
    payload?: Record<string, unknown>;
  }
): Promise<boolean> {
  if (process.env.BIGQUERY_ENABLED === 'false') return false;

  try {
    await ensureBigQuerySchemaOnce();
    const bq = getBigQueryClient();
    const table = bq.dataset(DATASET_ID).table('outreach_events');

    const row = {
      id: event.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      lead_id: event.lead_id,
      event_type: event.event_type,
      channel: event.channel || 'email',
      payload: event.payload ? JSON.stringify(event.payload) : null,
      created_at: new Date().toISOString()
    };

    await table.insert([row], { ignoreUnknownValues: true });
    return true;
  } catch (err) {
    console.warn('[BigQuery] Event stream warning:', err instanceof Error ? err.message : err);
    return false;
  }
}

function ensureBigQuerySchemaOnce() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = ensureBigQuerySchema();
  }
  return schemaReadyPromise;
}

export async function testBigQueryConnection(): Promise<{ success: boolean; dataset: string; message: string }> {
  try {
    const bq = getBigQueryClient();
    const [datasets] = await bq.getDatasets({ maxResults: 10 });
    return {
      success: true,
      dataset: DATASET_ID,
      message: `Connected to Google BigQuery (${datasets.length} datasets found).`
    };
  } catch (err) {
    return {
      success: false,
      dataset: DATASET_ID,
      message: err instanceof Error ? err.message : 'BigQuery connection failed.'
    };
  }
}
