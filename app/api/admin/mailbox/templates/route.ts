/**
 * API Route: /api/admin/mailbox/templates
 * Manages reusable email templates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import {
  getTemplates,
  upsertTemplate,
  deleteTemplate,
} from '@/lib/mailbox/mailboxService';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const templates = await getTemplates();
  return NextResponse.json({ success: true, templates });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Template name is required.' }, { status: 400 });
    }

    const saved = await upsertTemplate(body);
    return NextResponse.json({ success: true, template: saved });
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
    return NextResponse.json({ success: false, error: 'Template ID is required.' }, { status: 400 });
  }

  const ok = await deleteTemplate(id);
  return NextResponse.json({ success: ok });
}
