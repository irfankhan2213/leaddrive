import type { AppSettings, Lead } from '@/lib/types';

export interface SendSmsParams {
  to: string;
  body: string;
  leadId?: string;
  settings?: Partial<AppSettings>;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  channel: 'sms';
  error?: string;
}

export async function sendTwilioSms(params: SendSmsParams): Promise<SmsSendResult> {
  const accountSid = params.settings?.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID;
  const authToken = params.settings?.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = params.settings?.twilioPhoneNumber || process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      success: false,
      channel: 'sms',
      error: 'Twilio SMS credentials (Account SID, Auth Token, From Phone) are not configured in Settings or .env.local.'
    };
  }

  // Normalize phone number (strip whitespace, ensure + prefix for international E.164)
  let cleanTo = params.to.replace(/[^\d+]/g, '');
  if (!cleanTo.startsWith('+')) {
    if (cleanTo.length === 10) cleanTo = `+1${cleanTo}`;
    else if (cleanTo.length === 11 && cleanTo.startsWith('1')) cleanTo = `+${cleanTo}`;
    else cleanTo = `+${cleanTo}`;
  }

  try {
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`;
    const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;

    const formData = new URLSearchParams();
    formData.append('To', cleanTo);
    formData.append('From', fromNumber);
    formData.append('Body', params.body);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = (await res.json()) as { sid?: string; message?: string; status?: string; code?: number };

    if (!res.ok) {
      return {
        success: false,
        channel: 'sms',
        error: `Twilio Error (${data.code || res.status}): ${data.message || 'Failed to dispatch SMS'}`
      };
    }

    return {
      success: true,
      channel: 'sms',
      messageId: data.sid
    };
  } catch (err) {
    return {
      success: false,
      channel: 'sms',
      error: err instanceof Error ? err.message : 'Network error sending SMS.'
    };
  }
}

export function buildSmsOutreach(lead: Lead, customTemplate?: string): string {
  const companyName = lead.company_name || 'your business';
  const firstName = lead.contact_name ? lead.contact_name.split(' ')[0] : 'there';
  const city = lead.city || 'your area';
  const demoUrl = lead.demo_url || `${process.env.APP_BASE_URL || 'http://localhost:3000'}/demo/${lead.id}`;
  const weakness = lead.weakness || 'mobile booking gap';

  if (customTemplate && customTemplate.trim()) {
    return customTemplate
      .replace(/{{first_name}}/gi, firstName)
      .replace(/{{contact_name}}/gi, lead.contact_name || companyName)
      .replace(/{{company_name}}/gi, companyName)
      .replace(/{{city}}/gi, city)
      .replace(/{{demo_url}}/gi, demoUrl)
      .replace(/{{weakness}}/gi, weakness);
  }

  return `Hi ${firstName}, I privately built a custom demo for ${companyName} showing how to fix "${weakness}":

${demoUrl}

Worth 60 seconds? Reply STOP to opt out.`;
}
