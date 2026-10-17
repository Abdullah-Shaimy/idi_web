/**
 * API Route: /api/admin/mailbox/emails/[id]
 * Retrieves single email with thread conversation, updates status/folder, or deletes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import {
  getEmailById,
  updateEmailStatus,
  bulkUpdateEmails,
  FolderType,
} from '@/lib/mailbox/mailboxService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await getEmailById(id, auth.allowedEmails);

    if (!result.email) {
      return NextResponse.json({ success: false, error: 'Email not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      email: result.email,
      threadEmails: result.threadEmails,
    });
  } catch (err: any) {
    console.error('[API /api/admin/mailbox/emails/[id] GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updates: { is_read?: boolean; is_starred?: boolean; folder?: FolderType } = {};
    if (typeof body.is_read === 'boolean') updates.is_read = body.is_read;
    if (typeof body.is_starred === 'boolean') updates.is_starred = body.is_starred;
    if (body.folder) updates.folder = body.folder;

    const result = await updateEmailStatus(id, updates);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/admin/mailbox/emails/[id] PATCH] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const permanent = request.nextUrl.searchParams.get('permanent') === 'true';

    const action = permanent ? 'delete_permanently' : 'trash';
    const result = await bulkUpdateEmails([id], action, auth.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/admin/mailbox/emails/[id] DELETE] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
