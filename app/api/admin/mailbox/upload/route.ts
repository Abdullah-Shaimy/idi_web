/**
 * API Route: /api/admin/mailbox/upload
 * Handles attachment upload, file validation, and storage in Supabase private bucket.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import { createClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit per file

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 15MB limit.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniquePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeName}`;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    let storagePath = uniquePath;

    if (supabaseUrl && serviceKey) {
      try {
        const client = createClient(supabaseUrl, serviceKey);
        await client.storage.from('mailbox_attachments').upload(uniquePath, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true,
        });
      } catch (uploadErr) {
        console.warn('[Mailbox Upload] Storage bucket upload warning:', uploadErr);
      }
    }

    return NextResponse.json({
      success: true,
      file: {
        filename: file.name,
        file_size: file.size,
        content_type: file.type || 'application/octet-stream',
        storage_path: storagePath,
        content: base64Content,
      },
    });
  } catch (err: any) {
    console.error('[API /api/admin/mailbox/upload] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Upload failed' }, { status: 500 });
  }
}
