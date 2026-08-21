import type { AppSettings, Lead } from '@/lib/types';

export interface SendEmailParams {
  to: string;
  subject: string;
  bodyText: string;
  lead: Lead;
  settings?: Partial<AppSettings>;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  channel: 'email';
  error?: string;
}

export async function sendResendEmail(params: SendEmailParams): Promise<EmailSendResult> {
  const apiKey = params.settings?.resendApiKey || process.env.RESEND_API_KEY;
  const fromEmail = params.settings?.fromEmail || process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = params.settings?.fromName || process.env.FROM_NAME || 'LeadDrive Team';

  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      channel: 'email',
      error: 'RESEND_API_KEY is not configured in Settings or .env.local.'
    };
  }

  const html = renderProfessionalEmailHtml(params.bodyText, params.lead, fromName);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [params.to],
        subject: params.subject,
        text: params.bodyText,
        html
      })
    });

    const data = (await res.json()) as { id?: string; message?: string; statusCode?: number; name?: string };

    if (!res.ok) {
      return {
        success: false,
        channel: 'email',
        error: `Resend Error: ${data.message || res.statusText || 'Email dispatch failed'}`
      };
    }

    return {
      success: true,
      channel: 'email',
      messageId: data.id
    };
  } catch (err) {
    return {
      success: false,
      channel: 'email',
      error: err instanceof Error ? err.message : 'Network error sending email via Resend.'
    };
  }
}

export function renderProfessionalEmailHtml(text: string, lead: Lead, senderName: string): string {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const demoUrl = lead.demo_url || `${baseUrl}/demo/${lead.id}`;
  const companyName = lead.company_name || 'your business';

  // Format paragraphs
  const paragraphs = text
    .split('\n\n')
    .map((p) => {
      const escaped = p
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br />');

      // Check if paragraph is the demo link
      if (p.includes('http://') || p.includes('https://')) {
        return `<div style="margin: 24px 0; text-align: center;">
          <a href="${demoUrl}" target="_blank" style="background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(37,99,235,0.35);">
            ⚡ Open Interactive Live Demo for ${companyName} &rarr;
          </a>
        </div>`;
      }
      return `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #1f2937; font-size: 15px;">${escaped}</p>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Something for ${companyName}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
    <!-- Header Banner -->
    <tr>
      <td style="padding: 24px 32px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; background: rgba(96,165,250,0.15); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(96,165,250,0.3);">
                Privately Built for You
              </span>
              <h1 style="margin: 12px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                Custom Demo for ${companyName}
              </h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        ${paragraphs}
      </td>
    </tr>

    <!-- Audit Card Highlight -->
    <tr>
      <td style="padding: 0 32px 24px 32px;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="font-size: 12px; font-weight: 700; color: #0f172a; padding-bottom: 6px;">
                🔍 What We Found:
              </td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: #475569; line-height: 1.5;">
                "${lead.weakness}"
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
        <p style="margin: 0 0 6px 0; font-weight: 600; color: #4b5563;">
          Sent by ${senderName}
        </p>
        <p style="margin: 0; font-size: 11px; color: #9ca3af;">
          Not interested? Reply "unsubscribe" and you won't hear from us again.
        </p>
      </td>
    </tr>
  </table>

  <!-- Open Tracking Pixel -->
  <img src="${baseUrl}/api/track/open?leadId=${encodeURIComponent(lead.id)}" width="1" height="1" style="display:none;" alt="" />
</body>
</html>`;
}
