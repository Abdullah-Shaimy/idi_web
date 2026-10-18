/**
 * Institute of Da'wa Islamiyya (IDI) - Admin Audit Logs API
 * Endpoint: /api/admin/logs
 *
 * Provides Super Administrators with an auditable activity feed across all administrators,
 * including authentication, gallery curation, inquiries, user privileges, and mailbox dispatches.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '@/lib/mailbox/authCheck';
import { recordAuditLog, AuditLogEntry } from '@/lib/auditLogger';

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
 * GET /api/admin/logs
 * Retrieve system activity logs. Super Admin access required.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  if (auth.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Super Administrator privileges required.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(200, parseInt(searchParams.get('limit') || '30', 10)));
  const adminFilter = (searchParams.get('admin_id') || '').trim();
  const actionFilter = (searchParams.get('action') || '').trim();
  const entityFilter = (searchParams.get('entity_type') || '').trim();
  const search = (searchParams.get('search') || '').trim().toLowerCase();
  const isExport = searchParams.get('export_csv') === 'true';

  try {
    const supabase = getAdminSupabase();

    // 1. Fetch raw audit logs
    const { data: logsData, error: logsError } = await supabase
      .from('mailbox_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(isExport ? 1000 : 500);

    if (logsError) {
      console.error('[Admin Logs API] Error querying logs:', logsError);
      return NextResponse.json({ success: false, error: logsError.message }, { status: 500 });
    }

    // 2. Fetch admin user profiles to map user_id -> name, email, role
    const { data: adminsData } = await supabase.from('admin_users').select('id, user_id, email, full_name, role');
    
    // Also fetch auth users for complete metadata
    let authUsers: any[] = [];
    try {
      const { data: authUsersData } = await supabase.auth.admin.listUsers();
      authUsers = (authUsersData?.users as any[]) || [];
    } catch (e) {
      console.warn('[Admin Logs API] Could not list auth users:', e);
    }

    const adminMap = new Map<string, { full_name: string; email: string; role: string }>();

    (adminsData || []).forEach((adm) => {
      const emailLower = (adm.email || '').toLowerCase();
      const authU = authUsers.find(
        (u) => u.id === adm.user_id || u.email?.toLowerCase() === emailLower
      );
      const meta = authU?.user_metadata || {};
      const profile = {
        full_name: adm.full_name || meta.full_name || emailLower.split('@')[0],
        email: adm.email || authU?.email || 'admin@idi.lk',
        role: adm.role || meta.role || (emailLower === 'dev@idi.lk' ? 'super_admin' : 'admin'),
      };
      if (adm.user_id) adminMap.set(adm.user_id, profile);
      if (adm.id) adminMap.set(adm.id, profile);
      if (adm.email) adminMap.set(adm.email.toLowerCase(), profile);
    });

    // Also index auth users by ID
    authUsers.forEach((u) => {
      if (!adminMap.has(u.id)) {
        const meta = u.user_metadata || {};
        const emailLower = (u.email || '').toLowerCase();
        adminMap.set(u.id, {
          full_name: meta.full_name || emailLower.split('@')[0] || 'Administrator',
          email: u.email || '',
          role: meta.role || (emailLower === 'dev@idi.lk' ? 'super_admin' : 'admin'),
        });
      }
    });

    // 3. Correlate and format logs
    const correlated: AuditLogEntry[] = (logsData || []).map((row: any) => {
      let adminInfo = row.user_id ? adminMap.get(row.user_id) : null;
      if (!adminInfo && row.details?.admin_email) {
        adminInfo = adminMap.get(row.details.admin_email.toLowerCase());
      }

      const isSystem = !row.user_id && (row.action.includes('inbound') || row.action.includes('system'));

      return {
        id: row.id,
        user_id: row.user_id,
        action: row.action,
        entity_type: row.entity_type,
        entity_id: row.entity_id,
        details: row.details,
        created_at: row.created_at,
        admin_name: adminInfo ? adminInfo.full_name : isSystem ? 'System / Inbound' : (row.details?.admin_name || 'Admin'),
        admin_email: adminInfo ? adminInfo.email : isSystem ? 'system@idi.lk' : (row.details?.admin_email || '—'),
        admin_role: (adminInfo ? adminInfo.role : isSystem ? 'system' : (row.details?.admin_role || 'admin')) as any,
      };
    });

    // 4. Apply Filters
    let filtered = correlated;

    if (adminFilter && adminFilter !== 'all') {
      const lowerAdminFilter = adminFilter.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.user_id === adminFilter ||
          log.admin_email?.toLowerCase() === lowerAdminFilter ||
          (adminFilter === 'system' && !log.user_id)
      );
    }

    if (actionFilter && actionFilter !== 'all') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    if (entityFilter && entityFilter !== 'all') {
      filtered = filtered.filter((log) => log.entity_type === entityFilter);
    }

    if (search) {
      filtered = filtered.filter((log) => {
        const strDetails = log.details ? JSON.stringify(log.details).toLowerCase() : '';
        const adminName = (log.admin_name || '').toLowerCase();
        const adminEmail = (log.admin_email || '').toLowerCase();
        const action = (log.action || '').toLowerCase();
        const entityType = (log.entity_type || '').toLowerCase();
        const entityId = (log.entity_id || '').toLowerCase();
        return (
          adminName.includes(search) ||
          adminEmail.includes(search) ||
          action.includes(search) ||
          entityType.includes(search) ||
          entityId.includes(search) ||
          strDetails.includes(search)
        );
      });
    }

    // 5. Compute Statistics for Super Admin Header
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const todayLogsCount = correlated.filter(
      (l) => new Date(l.created_at).getTime() >= todayStart
    ).length;

    const uniqueAdmins = new Set(
      correlated.filter((l) => l.user_id).map((l) => l.user_id)
    );

    const emailActionsCount = correlated.filter(
      (l) => l.entity_type === 'email' || l.action.includes('email')
    ).length;
    const inquiryActionsCount = correlated.filter(
      (l) => l.entity_type === 'inquiry' || l.action.includes('inquiry')
    ).length;
    const galleryActionsCount = correlated.filter(
      (l) => l.entity_type === 'gallery' || l.entity_type === 'photo' || l.entity_type === 'album' || l.action.includes('album') || l.action.includes('photo')
    ).length;
    const securityActionsCount = correlated.filter(
      (l) => l.entity_type === 'auth' || l.entity_type === 'admin_user' || l.action.includes('admin') || l.action.includes('login')
    ).length;

    // 6. Handle CSV Export
    if (isExport) {
      const headers = ['Timestamp', 'Administrator Name', 'Email', 'Role', 'Action', 'Category', 'Target ID', 'Details'];
      const csvRows = [headers.join(',')];

      filtered.forEach((log) => {
        const detailsStr = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
        const row = [
          `"${new Date(log.created_at).toISOString()}"`,
          `"${log.admin_name || ''}"`,
          `"${log.admin_email || ''}"`,
          `"${log.admin_role || ''}"`,
          `"${log.action || ''}"`,
          `"${log.entity_type || ''}"`,
          `"${log.entity_id || ''}"`,
          `"${detailsStr}"`,
        ];
        csvRows.push(row.join(','));
      });

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="admin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // 7. Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    // Deduplicate unique admins by email for filter dropdown
    const uniqueAdminEmails = new Map<string, { email: string; name: string; role: string }>();
    Array.from(adminMap.values()).forEach((adm) => {
      const em = (adm.email || '').toLowerCase().trim();
      if (em && !uniqueAdminEmails.has(em)) {
        uniqueAdminEmails.set(em, {
          email: adm.email,
          name: adm.full_name,
          role: adm.role,
        });
      }
    });
    const adminsList = Array.from(uniqueAdminEmails.values());

    return NextResponse.json({
      success: true,
      logs: paginated,
      total,
      page,
      totalPages,
      admins: adminsList,
      stats: {
        totalLogs: correlated.length,
        todayLogs: todayLogsCount,
        activeAdminsCount: uniqueAdmins.size,
        emailActionsCount,
        inquiryActionsCount,
        galleryActionsCount,
        securityActionsCount,
      },
    });
  } catch (err: any) {
    console.error('[Admin Logs API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while fetching logs.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/logs
 * Record an administrative activity log from verified client actions.
 */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, entity_type, entity_id, details } = body;

    if (!action || !entity_type) {
      return NextResponse.json(
        { success: false, error: 'Action and entity_type are required.' },
        { status: 400 }
      );
    }

    const logDetails = {
      ...(details || {}),
      admin_email: auth.email,
      admin_role: auth.role,
    };

    const saved = await recordAuditLog({
      userId: auth.userId,
      action: String(action),
      entityType: String(entity_type),
      entityId: entity_id ? String(entity_id) : null,
      details: logDetails,
    });

    return NextResponse.json({ success: saved });
  } catch (err: any) {
    console.error('[Admin Logs API] Error recording log:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to record audit log' },
      { status: 500 }
    );
  }
}
