import type { AppSettings } from '@/lib/types';

export const defaultSettings: AppSettings = {
  aiProvider: 'gemini',
  aiModel: 'gemini-2.5-flash',
  aiApiKey: '',
  v0ApiKey: '',
  v0Model: 'v0-mini',
  defaultDemoQuality: 'low',
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
