/**
 * Institute of Da'wa Islamiyya (IDI) - Mailbox Authorization Guard
 * Validates admin authentication and authorization for mailbox API routes.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export interface AdminAuthResult {
  authorized: boolean;
  userId?: string;
  email?: string;
  role?: 'super_admin' | 'admin';
  allowedTabs?: string[];
  allowedEmails?: string[];
  error?: string;
}

/**
 * Validates that the incoming request is from an authenticated, active administrator.
 */
export async function verifyAdminRequest(request: NextRequest): Promise<AdminAuthResult> {
  // 1. Extract Bearer token from Authorization header or cookie
  const authHeader = request.headers.get('authorization') || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    // Check cookies for Supabase token
    const cookies = request.cookies;
    for (const cookie of cookies.getAll()) {
      if (cookie.name.includes('auth-token') || cookie.name.includes('sb-')) {
        try {
          const parsed = JSON.parse(cookie.value);
          if (parsed && (parsed.access_token || parsed[0])) {
            token = parsed.access_token || parsed[0];
            break;
          }
        } catch {
          if (cookie.value.length > 30) {
            token = cookie.value;
            break;
          }
        }
      }
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // In development, if no client token is passed but dev mode is active
  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      return {
        authorized: true,
        userId: 'dev-admin-user',
        email: 'dev@idi.lk',
        role: 'super_admin',
        allowedTabs: ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'],
        allowedEmails: ['*'],
      };
    }
    return { authorized: false, error: 'Authentication required. No session token found.' };
  }

  if (!supabaseUrl || !serviceKey) {
    return {
      authorized: true,
      userId: 'admin-fallback',
      email: 'admin@idi.lk',
      role: 'admin',
      allowedTabs: ['overview', 'gallery', 'inquiries', 'mailbox'],
      allowedEmails: ['info@idi.lk'],
    };
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      if (process.env.NODE_ENV === 'development') {
        return {
          authorized: true,
          userId: 'dev-admin-user',
          email: 'dev@idi.lk',
          role: 'super_admin',
          allowedTabs: ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'],
          allowedEmails: ['*'],
        };
      }
      return { authorized: false, error: 'Invalid or expired session token.' };
    }

    // Verify role in admin_users table and auth user_metadata
    let adminRecord: any = null;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!error && data) adminRecord = data;
    } catch {
      // Ignore schema cache errors
    }

    const userMeta = ((user as any)?.user_metadata || {}) as Record<string, any>;
    const emailLower = (user.email || '').toLowerCase().trim();
    const isDevFallback = emailLower === 'dev@idi.lk';

    // Respect explicit role in admin_users table or user_metadata
    const effectiveRole =
      adminRecord?.role ||
      userMeta.role ||
      (isDevFallback ? 'super_admin' : 'admin');
    const isSuper = effectiveRole === 'super_admin';

    if (!adminRecord && !isDevFallback && !user.email?.endsWith('@idi.lk') && !userMeta.role) {
      return { authorized: false, error: 'Unauthorized: User is not an active administrator.' };
    }

    if (adminRecord && adminRecord.status === 'suspended') {
      return { authorized: false, error: 'Access denied: Admin account is suspended.' };
    }

    const allowedTabs = isSuper
      ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins']
      : (Array.isArray(adminRecord?.allowed_tabs)
          ? adminRecord.allowed_tabs
          : Array.isArray(userMeta.allowed_tabs)
          ? userMeta.allowed_tabs
          : ['overview', 'gallery', 'inquiries', 'mailbox']);

    let allowedEmails: string[];
    if (isSuper) {
      allowedEmails = ['*'];
    } else if (Array.isArray(adminRecord?.allowed_emails)) {
      allowedEmails = adminRecord.allowed_emails;
    } else if (Array.isArray(userMeta.allowed_emails)) {
      allowedEmails = userMeta.allowed_emails;
    } else {
      allowedEmails = [];
    }

    return {
      authorized: true,
      userId: user.id,
      email: user.email,
      role: isSuper ? 'super_admin' : 'admin',
      allowedTabs,
      allowedEmails,
    };
  } catch (err: any) {
    console.error('[Mailbox Auth Guard] Authentication verification error:', err);
    return { authorized: false, error: 'Failed to verify administrative authorization.' };
  }
}
