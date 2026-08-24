import type { AppSettings } from '@/lib/types';
import { getSupabaseAdmin } from '@/lib/supabase';

export const defaultSettings: AppSettings = {
  aiProvider: 'vertex',
  aiModel: 'gemini-2.5-flash',
  aiApiKey: '',
  gcpProjectId: '',
  gcpLocation: 'us-central1',
  gcpClientEmail: '',
  vertexModel: 'gemini-2.5-flash',
  vertexGrounding: true,
  bigqueryEnabled: true,
  bigqueryDataset: 'leaddrive_analytics',
  v0ApiKey: '',
  v0Model: 'v0-mini',
  demoProvider: 'v0',
  defaultDemoQuality: 'low',
  maxAutoDemosPerCampaign: 3,
  minDemoScore: 75,
  resendApiKey: '',
  fromEmail: '',
  fromName: 'LeadDrive Team',
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioPhoneNumber: '',
  brandName: 'LeadDrive',
  customInstructions: ''
};

/**
 * Fields that hold provider credentials. These are write-only from the
 * client's perspective: they are stored server-side and never returned.
 */
export const SECRET_SETTING_FIELDS = [
  'aiApiKey',
  'v0ApiKey',
  'resendApiKey',
  'twilioAccountSid',
  'twilioAuthToken'
] as const;

export type SecretSettingField = (typeof SECRET_SETTING_FIELDS)[number];

export function isSecretField(key: string): key is SecretSettingField {
  return (SECRET_SETTING_FIELDS as readonly string[]).includes(key);
}

function sanitizeSettings(raw: Record<string, unknown>): Partial<AppSettings> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!(key in defaultSettings)) continue;
    if (value === null || value === undefined) continue;
    clean[key] = value;
  }
  return clean as Partial<AppSettings>;
}

/** Loads the user's settings row, falling back to defaults. Server-only. */
export async function getUserSettings(userId: string): Promise<AppSettings> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ...defaultSettings };

  try {
    const { data } = await supabase
      .from('app_settings')
      .select('settings')
      .eq('user_id', userId)
      .maybeSingle();

    if (data?.settings && typeof data.settings === 'object') {
      return { ...defaultSettings, ...sanitizeSettings(data.settings as Record<string, unknown>) };
    }
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', context: 'getUserSettings', message: err instanceof Error ? err.message : String(err) })
    );
  }
  return { ...defaultSettings };
}

/**
 * Persists user settings. For secret fields an empty/absent value means
 * "keep whatever is already stored", so secrets never need to round-trip
 * through the browser. Returns the sanitized public view for the response.
 */
export async function saveUserSettings(
  userId: string,
  incoming: Partial<AppSettings>
): Promise<{ publicSettings: PublicSettings }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase is not configured.');

  const cleanIncoming = sanitizeSettings(incoming as Record<string, unknown>);
  const current = await getUserSettings(userId);

  const merged: AppSettings = { ...current };
  for (const [key, value] of Object.entries(cleanIncoming)) {
    if (isSecretField(key)) {
      // Only overwrite a secret when a non-empty value was submitted.
      if (typeof value === 'string' && value.trim() !== '') {
        (merged as unknown as Record<string, unknown>)[key] = value.trim();
      }
    } else {
      (merged as unknown as Record<string, unknown>)[key] = value;
    }
  }

  const { error } = await supabase.from('app_settings').upsert({
    user_id: userId,
    settings: merged,
    updated_at: new Date().toISOString()
  });

  if (error) throw new Error(error.message);

  return { publicSettings: toPublicSettings(merged) };
}

export interface PublicSettings extends Omit<AppSettings, SecretSettingField> {
  configured: Record<string, boolean>;
}

/** Strips secrets out and reports which ones are set (for UI badges). */
export function toPublicSettings(settings: AppSettings): PublicSettings {
  const { aiApiKey, v0ApiKey, resendApiKey, twilioAccountSid, twilioAuthToken, ...rest } = settings;
  const configured: Record<string, boolean> = {
    aiApiKey: Boolean(aiApiKey || process.env.GEMINI_API_KEY),
    v0ApiKey: Boolean(v0ApiKey || process.env.V0_API_KEY),
    resendApiKey: Boolean(resendApiKey || process.env.RESEND_API_KEY),
    twilioAccountSid: Boolean(twilioAccountSid || process.env.TWILIO_ACCOUNT_SID),
    twilioAuthToken: Boolean(twilioAuthToken || process.env.TWILIO_AUTH_TOKEN)
  };

  // Fall back to env-provided non-secret values where the user hasn't set any.
  return {
    ...rest,
    fromEmail: rest.fromEmail || process.env.FROM_EMAIL || '',
    fromName: rest.fromName || process.env.FROM_NAME || 'LeadDrive Team',
    twilioPhoneNumber: rest.twilioPhoneNumber || process.env.TWILIO_PHONE_NUMBER || '',
    gcpProjectId: rest.gcpProjectId || process.env.GCP_PROJECT_ID || '',
    gcpLocation: rest.gcpLocation || process.env.GCP_LOCATION || 'us-central1',
    vertexModel: rest.vertexModel || process.env.VERTEX_AI_MODEL || 'gemini-2.5-flash',
    bigqueryDataset: rest.bigqueryDataset || process.env.BIGQUERY_DATASET || 'leaddrive_analytics',
    configured
  };
}
