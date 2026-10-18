/**
 * API Route: /api/admin/mailbox/emails
 * Lists emails, handles compose & dispatch, and executes bulk folder actions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import {
  getEmails,
  getFolderCounts,
  composeAndSendEmail,
  bulkUpdateEmails,
  syncInboundEmailsFromResend,
  FolderType,
} from '@/lib/mailbox/mailboxService';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const folder = (searchParams.get('folder') as FolderType) || undefined;
    const isStarred = searchParams.get('starred') === 'true' ? true : undefined;
    const isRead = searchParams.has('isRead') ? searchParams.get('isRead') === 'true' : undefined;
    const hasAttachments = searchParams.has('hasAttachments') ? searchParams.get('hasAttachments') === 'true' : undefined;
    const search = searchParams.get('q') || searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    // Sync incoming emails: if explicit sync (user clicked refresh), await it.
    // Otherwise, run in background non-blocking so the inbox returns immediately in <100ms!
    const isExplicitSync = searchParams.get('sync') === 'true';
    if (isExplicitSync) {
      try {
        await syncInboundEmailsFromResend();
      } catch (syncErr) {
        console.warn('[API /api/admin/mailbox/emails GET] Inbound sync warning:', syncErr);
      }
    } else if (!folder || folder === 'inbox') {
      syncInboundEmailsFromResend().catch((syncErr) => {
        console.warn('[API Inbound background sync]', syncErr);
      });
    }

    const [emailsResult, counts] = await Promise.all([
      getEmails({
        folder,
        isStarred,
        isRead,
        hasAttachments,
        search,
        page,
        limit,
        allowedEmails: auth.allowedEmails,
      }),
      getFolderCounts(auth.allowedEmails),
    ]);

    return NextResponse.json({
      success: true,
      emails: emailsResult.emails,
      total: emailsResult.total,
      page: emailsResult.page,
      totalPages: emailsResult.totalPages,
      counts,
    });
  } catch (err: any) {
    console.error('[API /api/admin/mailbox/emails GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.from || !body.to || (!body.subject && !body.isDraft)) {
      return NextResponse.json(
        { success: false, error: 'From, To recipient, and Subject are required.' },
        { status: 400 }
      );
    }

    const result = await composeAndSendEmail({
      from: body.from,
      fromName: body.fromName,
      to: Array.isArray(body.to) ? body.to : [body.to],
      cc: body.cc,
      bcc: body.bcc,
      subject: body.subject,
      html: body.html,
      text: body.text,
      replyTo: body.replyTo,
      inReplyTo: body.inReplyTo,
      references: body.references,
      threadId: body.threadId,
      isDraft: body.isDraft,
      draftId: body.draftId,
      attachments: body.attachments,
      adminUserId: auth.userId,
      allowedEmails: auth.allowedEmails,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      email: result.email,
      isSimulated: result.isSimulated,
      message: body.isDraft ? 'Draft saved successfully.' : 'Email dispatched successfully.',
    });
  } catch (err: any) {
    console.error('[API /api/admin/mailbox/emails POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ids: string[] = body.ids || (body.id ? [body.id] : []);
    const action = body.action;

    if (!ids.length || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: ids and action.' },
        { status: 400 }
      );
    }

    const result = await bulkUpdateEmails(ids, action, auth.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/admin/mailbox/emails PATCH] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
