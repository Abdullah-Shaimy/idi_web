/**
 * Institute of Da'wa Islamiyya (IDI) - Resend Email Integration Service
 * Handles server-side email dispatch, attachment formatting, and webhook signature verification.
 */

import { Resend } from 'resend';
import crypto from 'crypto';

export interface SendEmailPayload {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
  isSimulated?: boolean;
}

/**
 * Returns a configured Resend instance or null if API key is absent
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey === 're_your_resend_api_key_here') {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Checks whether real Resend credentials are configured
 */
export function isResendConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return Boolean(apiKey && apiKey !== 're_your_resend_api_key_here' && apiKey.startsWith('re_'));
}

/**
 * Sends an email using the Resend API
 */
export async function sendEmailViaResend(payload: SendEmailPayload): Promise<SendEmailResult> {
  const resend = getResendClient();

  // Normalize recipients
  const toList = Array.isArray(payload.to)
    ? payload.to.filter(Boolean)
    : [payload.to].filter(Boolean);

  if (toList.length === 0) {
    return { success: false, error: 'Recipient address (To) is required.' };
  }

  const ccList = payload.cc
    ? Array.isArray(payload.cc)
      ? payload.cc.filter(Boolean)
      : [payload.cc].filter(Boolean)
    : undefined;

  const bccList = payload.bcc
    ? Array.isArray(payload.bcc)
      ? payload.bcc.filter(Boolean)
      : [payload.bcc].filter(Boolean)
    : undefined;

  // If Resend API key is not yet set, provide graceful mock simulation
  if (!resend) {
    console.warn('[Resend Service] RESEND_API_KEY not configured. Simulating delivery in dev mode.');
    const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      success: true,
      providerMessageId: simulatedId,
      isSimulated: true,
    };
  }

  try {
    const response = await resend.emails.send({
      from: payload.from,
      to: toList,
      cc: ccList && ccList.length ? ccList : undefined,
      bcc: bccList && bccList.length ? bccList : undefined,
      replyTo: payload.replyTo || undefined,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      headers: payload.headers,
      attachments: payload.attachments,
    });

    if (response.error) {
      console.error('[Resend Service] API send error:', response.error);
      return {
        success: false,
        error: response.error.message || 'Failed to dispatch email via Resend.',
      };
    }

    return {
      success: true,
      providerMessageId: response.data?.id,
      isSimulated: false,
    };
  } catch (error: any) {
    console.error('[Resend Service] Unexpected dispatch error:', error);
    return {
      success: false,
      error: error.message || 'Network error communicating with Resend API.',
    };
  }
}

/**
 * Verifies standard Svix webhook signature (used by Resend webhooks)
 * Supports standard Svix headers (svix-id, svix-timestamp, svix-signature)
 * and secret token comparison fallback.
 */
export function verifyWebhookSignature({
  rawBody,
  headers,
  secret,
}: {
  rawBody: string;
  headers: Record<string, string | undefined>;
  secret?: string;
}): { valid: boolean; reason?: string } {
  const webhookSecret = secret || process.env.RESEND_INBOUND_WEBHOOK_SECRET || process.env.RESEND_DELIVERY_WEBHOOK_SECRET;

  // If no secret configured in environment, permit with warning so incoming webhooks don't fail before user sets secret
  if (!webhookSecret || webhookSecret.includes('your_')) {
    console.warn('[Webhook /resend/inbound] RESEND_INBOUND_WEBHOOK_SECRET is not set in environment. Permitting request.');
    return { valid: true, reason: 'Webhook secret not configured in server environment' };
  }

  const svixId = headers['svix-id'] || headers['x-svix-id'];
  const svixTimestamp = headers['svix-timestamp'] || headers['x-svix-timestamp'];
  const svixSignature = headers['svix-signature'] || headers['x-svix-signature'];

  // Check for simple bearer or direct secret token
  const authHeader = headers['authorization'] || headers['x-webhook-secret'];
  if (authHeader && authHeader.replace(/^Bearer\s+/i, '') === webhookSecret) {
    return { valid: true };
  }

  if (!svixId || !svixTimestamp || !svixSignature) {
    return { valid: false, reason: 'Missing required Svix webhook signature headers.' };
  }

  // Prevent replay attacks (tolerance 5 minutes)
  const now = Math.floor(Date.now() / 1000);
  const timestampNum = parseInt(svixTimestamp, 10);
  if (isNaN(timestampNum) || Math.abs(now - timestampNum) > 300) {
    return { valid: false, reason: 'Webhook timestamp is outside valid tolerance window.' };
  }

  // Verify HMAC-SHA256 signature
  try {
    const toSign = `${svixId}.${svixTimestamp}.${rawBody}`;
    // Strip "whsec_" prefix if present and decode base64
    const key = webhookSecret.startsWith('whsec_')
      ? Buffer.from(webhookSecret.slice(6), 'base64')
      : Buffer.from(webhookSecret, 'utf-8');

    const expectedSignature = crypto
      .createHmac('sha256', key)
      .update(toSign)
      .digest('base64');

    // Split candidate signatures (v1,signature)
    const passedSignatures = svixSignature.split(' ').map((s) => {
      const parts = s.split(',');
      return parts.length === 2 ? parts[1] : parts[0];
    });

    const isMatch = passedSignatures.some((sig) => {
      try {
        return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSignature));
      } catch {
        return false;
      }
    });

    if (isMatch) {
      return { valid: true };
    }
    return { valid: false, reason: 'Svix signature mismatch.' };
  } catch (err: any) {
    return { valid: false, reason: `Signature verification exception: ${err.message}` };
  }
}
