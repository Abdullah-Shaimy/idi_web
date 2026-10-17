/**
 * API Route: /api/admin/mailbox/stats
 * Returns folder email counts and unread counter for navigation badges.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import { getFolderCounts } from '@/lib/mailbox/mailboxService';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const counts = await getFolderCounts(auth.allowedEmails);
    return NextResponse.json({ success: true, counts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
