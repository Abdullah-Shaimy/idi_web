/**
 * API Route: /api/webhooks/resend/inbound
 * Receives incoming inbound emails from Resend or email routing providers.
 * Verifies webhook signature, extracts details, groups threads, and stores email safely.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/mailbox/resendService';
import { processInboundEmailWebhook } from '@/lib/mailbox/mailboxService';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const headersList: Record<string, string | undefined> = {};

    request.headers.forEach((value, key) => {
      headersList[key.toLowerCase()] = value;
    });

    // 1. Authenticate webhook signature
    const verification = verifyWebhookSignature({
      rawBody,
      headers: headersList,
      secret: process.env.RESEND_INBOUND_WEBHOOK_SECRET,
    });

    if (!verification.valid) {
      console.warn('[Webhook /resend/inbound] Signature check failed:', verification.reason);
      return NextResponse.json(
        { success: false, error: 'Unauthorized webhook signature' },
        { status: 401 }
      );
    }

    // 2. Parse payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    // 3. Process email
    const result = await processInboundEmailWebhook(payload);

    return NextResponse.json({
      success: true,
      processed: true,
      duplicate: result.duplicate,
      id: result.id,
    });
  } catch (error: any) {
    console.error('[Webhook /resend/inbound] Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failure' },
      { status: 500 }
    );
  }
}
