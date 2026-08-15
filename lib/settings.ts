import type { AppSettings } from '@/lib/types';

export const defaultSettings: AppSettings = {
  aiProvider: 'vertex',
  aiModel: 'gemini-3.7-flash',
  aiApiKey: '',
  gcpProjectId: 'skillful-fx-467601-h4',
  gcpLocation: 'us-central1',
  gcpClientEmail: 'vertex-express@skillful-fx-467601-h4.iam.gserviceaccount.com',
  vertexModel: 'gemini-3.7-flash',
  vertexGrounding: true,
  bigqueryEnabled: true,
  bigqueryDataset: 'leaddrive_analytics',
  v0ApiKey: '',
  v0Model: 'v0-mini',
  demoProvider: 'agentic',
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

const SETTINGS_KEY = 'leaddrive_app_settings_v1';

export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage quota or disabled
  }
}
