/**
 * API Route: /api/webhooks/resend/delivery
 * Receives delivery status webhooks from Resend (email.sent, email.delivered, email.bounced, etc.).
 * Verifies webhook signature and updates message status in database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/mailbox/resendService';
import { processDeliveryWebhook } from '@/lib/mailbox/mailboxService';

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
      secret: process.env.RESEND_DELIVERY_WEBHOOK_SECRET,
    });

    if (!verification.valid) {
      console.warn('[Webhook /resend/delivery] Signature check failed:', verification.reason);
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

    // 3. Update status
    await processDeliveryWebhook(payload);

    return NextResponse.json({ success: true, processed: true });
  } catch (error: any) {
    console.error('[Webhook /resend/delivery] Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failure' },
      { status: 500 }
    );
  }
}
