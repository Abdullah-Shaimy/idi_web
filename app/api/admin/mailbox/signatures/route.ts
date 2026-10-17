/**
 * API Route: /api/admin/mailbox/signatures
 * Manages email signatures.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import {
  getSignatures,
  upsertSignature,
  deleteSignature,
} from '@/lib/mailbox/mailboxService';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const signatures = await getSignatures();
  return NextResponse.json({ success: true, signatures });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Signature name is required.' }, { status: 400 });
    }

    const saved = await upsertSignature(body);
    return NextResponse.json({ success: true, signature: saved });
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
    return NextResponse.json({ success: false, error: 'Signature ID is required.' }, { status: 400 });
  }

  const ok = await deleteSignature(id);
  return NextResponse.json({ success: ok });
}
