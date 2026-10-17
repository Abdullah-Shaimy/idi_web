/**
 * Institute of Da'wa Islamiyya (IDI) - Admin User Management API
 * Endpoint: /api/admin/users
 *
 * Secure server-side administrative user creation, listing, updating, and revocation.
 * Utilizes Supabase Service Role API to bypass client signup constraints and guarantee
 * referential integrity with auth.users(id).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';

function getAdminSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase environment credentials are not configured on the server.');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/admin/users
 * List all registered administrators with permissions.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  if (auth.role !== 'super_admin' && !auth.allowedTabs?.includes('admins')) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Super Administrator privileges required.' },
      { status: 403 }
    );
  }

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Also fetch auth users to retrieve user_metadata if columns are pending migration
    let authUsers: any[] = [];
    try {
      const { data: authUsersData } = await supabase.auth.admin.listUsers();
      authUsers = (authUsersData?.users as any[]) || [];
    } catch (e) {
      console.warn('[Admin API] Could not list auth users for metadata:', e);
    }

    const normalized = (data || []).map((admin) => {
      const emailLower = (admin.email || '').toLowerCase();
      const authUser = authUsers.find(
        (u) => u.id === admin.user_id || u.email?.toLowerCase() === emailLower
      );
      const userMeta = authUser?.user_metadata || {};

      // Respect explicit role in admin_users or user_metadata, only defaulting to super_admin if dev@idi.lk
      const effectiveRole =
        admin.role || userMeta.role || (emailLower === 'dev@idi.lk' ? 'super_admin' : 'admin');
      const isSuper = effectiveRole === 'super_admin';

      return {
        ...admin,
        role: isSuper ? 'super_admin' : 'admin',
        status: admin.status || 'active',
        full_name: admin.full_name || userMeta.full_name || emailLower.split('@')[0],
        allowed_tabs:
          admin.allowed_tabs ||
          userMeta.allowed_tabs ||
          (isSuper
            ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins']
            : ['overview', 'gallery', 'inquiries', 'mailbox']),
        allowed_emails:
          admin.allowed_emails ||
          userMeta.allowed_emails ||
          (isSuper ? ['*'] : ['info@idi.lk']),
        must_change_password: Boolean(admin.must_change_password),
      };
    });

    return NextResponse.json({ success: true, users: normalized });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Create a new administrator account directly in auth.users and admin_users.
 */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  if (auth.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Only Super Administrators can create admin accounts.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const cleanRole = body.role === 'super_admin' ? 'super_admin' : 'admin';
    const cleanName = (body.full_name || '').trim();
    const cleanPassword = (body.password || '').trim();
    const cleanTabs =
      body.allowed_tabs ||
      (cleanRole === 'super_admin'
        ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins']
        : ['overview', 'gallery', 'inquiries', 'mailbox']);
    const cleanEmails =
      body.allowed_emails || (cleanRole === 'super_admin' ? ['*'] : ['info@idi.lk']);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    // 1. Search existing user in auth.users
    const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.warn('[Admin API] Could not list auth users:', listErr.message);
    }

    const allUsers: any[] = usersList?.users || [];
    let authUser: any = allUsers.find((u: any) => u.email?.toLowerCase() === cleanEmail);
    const passwordToUse =
      cleanPassword || `idi-${Math.random().toString(36).substring(2, 10)}`;

    const metaPayload = {
      full_name: cleanName || cleanEmail.split('@')[0],
      role: cleanRole,
      allowed_tabs: cleanTabs,
      allowed_emails: cleanEmails,
    };

    if (!authUser) {
      // Create user directly in auth.users with auto-confirmed email
      const { data: created, error: createAuthErr } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password: passwordToUse,
        email_confirm: true,
        user_metadata: metaPayload,
      });

      if (createAuthErr || !created?.user) {
        return NextResponse.json(
          {
            success: false,
            error:
              createAuthErr?.message ||
              'Failed to create user credentials in authentication system.',
          },
          { status: 400 }
        );
      }

      authUser = created.user;
    } else {
      // Always sync metadata to auth.users, and password if provided
      const updateAuthPayload: any = {
        email_confirm: true,
        user_metadata: {
          ...(authUser.user_metadata || {}),
          ...metaPayload,
        },
      };
      if (cleanPassword) {
        updateAuthPayload.password = cleanPassword;
      }
      await supabase.auth.admin.updateUserById(authUser.id, updateAuthPayload);
    }

    // 2. Insert or upsert into public.admin_users
    const rowPayload: Record<string, any> = {
      user_id: authUser.id,
      email: cleanEmail,
      role: cleanRole,
      full_name: cleanName || cleanEmail.split('@')[0],
      status: 'active',
      allowed_tabs: cleanTabs,
      allowed_emails: cleanEmails,
      must_change_password: true,
      updated_at: new Date().toISOString(),
    };

    let { data: adminRecord, error: insertErr } = await supabase
      .from('admin_users')
      .upsert(rowPayload, { onConflict: 'user_id' })
      .select()
      .single();

    // Graceful fallback if database schema does not have the newer columns yet
    if (insertErr && insertErr.code === 'PGRST204') {
      console.warn(
        '[Admin API] Schema cache missing columns, retrying with basic fields:',
        insertErr.message
      );
      delete rowPayload.allowed_tabs;
      delete rowPayload.allowed_emails;
      delete rowPayload.must_change_password;

      const retry = await supabase
        .from('admin_users')
        .upsert(rowPayload, { onConflict: 'user_id' })
        .select()
        .single();

      if (retry.error) {
        return NextResponse.json({ success: false, error: retry.error.message }, { status: 500 });
      }

      adminRecord = {
        ...retry.data,
        allowed_tabs: cleanTabs,
        allowed_emails: cleanEmails,
        must_change_password: true,
      };
    } else if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: adminRecord,
      generatedPassword: cleanPassword ? undefined : passwordToUse,
    });
  } catch (err: any) {
    console.error('[Admin API] Error creating admin user:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Update admin role, status, name, allowed tabs, or reset password.
 */
export async function PATCH(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  if (auth.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Super Administrator access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, role, status, full_name, allowed_tabs, allowed_emails, password } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    // Fetch existing admin to get user_id
    const { data: currentAdmin, error: fetchErr } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !currentAdmin) {
      return NextResponse.json({ success: false, error: 'Admin record not found' }, { status: 404 });
    }

    // Update auth.users metadata and password if user_id exists
    if (currentAdmin.user_id) {
      const updateAuthPayload: any = {};
      if (password && password.length >= 6) {
        updateAuthPayload.password = password.trim();
      }
      const newMeta: any = {};
      if (role !== undefined) newMeta.role = role;
      if (full_name !== undefined) newMeta.full_name = full_name;
      if (allowed_tabs !== undefined) newMeta.allowed_tabs = allowed_tabs;
      if (allowed_emails !== undefined) newMeta.allowed_emails = allowed_emails;

      if (Object.keys(newMeta).length > 0) {
        try {
          const { data: userAuthData } = await supabase.auth.admin.getUserById(currentAdmin.user_id);
          updateAuthPayload.user_metadata = {
            ...(userAuthData?.user?.user_metadata || {}),
            ...newMeta,
          };
        } catch {
          updateAuthPayload.user_metadata = newMeta;
        }
      }

      if (Object.keys(updateAuthPayload).length > 0) {
        await supabase.auth.admin.updateUserById(currentAdmin.user_id, updateAuthPayload);
      }
    }

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (role !== undefined) payload.role = role;
    if (status !== undefined) payload.status = status;
    if (full_name !== undefined) payload.full_name = full_name ? full_name.trim() : null;
    if (allowed_tabs !== undefined) payload.allowed_tabs = allowed_tabs;
    if (allowed_emails !== undefined) payload.allowed_emails = allowed_emails;

    let { data: updated, error: updateErr } = await supabase
      .from('admin_users')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (updateErr && updateErr.code === 'PGRST204') {
      delete payload.allowed_tabs;
      delete payload.allowed_emails;
      const retry = await supabase.from('admin_users').update(payload).eq('id', id).select().single();
      if (retry.error) {
        return NextResponse.json({ success: false, error: retry.error.message }, { status: 500 });
      }
      updated = { ...retry.data, allowed_tabs, allowed_emails };
    } else if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users?id=...
 * Revoke administrator access and delete records.
 */
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  if (auth.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Super Administrator access required.' },
      { status: 403 }
    );
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 });
  }

  try {
    const supabase = getAdminSupabase();

    // Prevent self-deletion
    const { data: targetAdmin, error: findErr } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (findErr || !targetAdmin) {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    if (
      targetAdmin.user_id === auth.userId ||
      targetAdmin.email?.toLowerCase() === auth.email?.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: 'Cannot revoke your own active super admin account.' },
        { status: 400 }
      );
    }

    // Delete from public.admin_users
    const { error: deleteErr } = await supabase.from('admin_users').delete().eq('id', id);
    if (deleteErr) {
      return NextResponse.json({ success: false, error: deleteErr.message }, { status: 500 });
    }

    // Delete from auth.users if user_id exists
    if (targetAdmin.user_id) {
      try {
        await supabase.auth.admin.deleteUser(targetAdmin.user_id);
      } catch (authDelErr) {
        console.warn('[Admin API] Could not delete auth.users record:', authDelErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
