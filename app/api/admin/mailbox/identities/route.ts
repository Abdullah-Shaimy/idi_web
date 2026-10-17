/**
 * API Route: /api/admin/mailbox/identities
 * Manages sender identities (info@idi.lk, support@idi.lk, admin@idi.lk).
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import {
  getIdentities,
  upsertIdentity,
  deleteIdentity,
} from '@/lib/mailbox/mailboxService';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const identities = await getIdentities(auth.allowedEmails);
  return NextResponse.json({ success: true, identities });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.email || !body.display_name) {
      return NextResponse.json(
        { success: false, error: 'Email address and Display Name are required.' },
        { status: 400 }
      );
    }

    const saved = await upsertIdentity(body);
    return NextResponse.json({ success: true, identity: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Identity ID is required' }, { status: 400 });
  }

  const ok = await deleteIdentity(id);
  return NextResponse.json({ success: ok });
}
