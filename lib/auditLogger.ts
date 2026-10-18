/**
 * Institute of Da'wa Islamiyya (IDI) - Unified Admin Audit & Activity Logger
 * Records administrative events (logins, user management, inquiries, gallery, mailbox).
 */

import { createClient } from '@supabase/supabase-js';

export interface AuditLogEntry {
  id?: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, any> | null;
  created_at: string;
  // Correlated fields for UI
  admin_name?: string;
  admin_email?: string;
  admin_role?: 'super_admin' | 'admin' | 'system';
}

function isValidUuid(val?: string | null): boolean {
  if (!val || typeof val !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function getAdminSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// In-memory fallback
let MEMORY_AUDIT_LOGS: AuditLogEntry[] = [];

/**
 * Record an audit log event
 */
export async function recordAuditLog(params: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any>;
}): Promise<boolean> {
  const { userId, action, entityType, entityId, details } = params;

  const logItem: AuditLogEntry = {
    user_id: isValidUuid(userId) ? userId! : null,
    action: action.trim(),
    entity_type: entityType.trim(),
    entity_id: entityId ? String(entityId) : null,
    details: details || null,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = getAdminSupabase();
    if (supabase) {
      const { error } = await supabase.from('mailbox_audit_logs').insert(logItem);
      if (!error) return true;
      console.warn('[AuditLogger] DB insert failed, using memory:', error.message);
    }
    MEMORY_AUDIT_LOGS.unshift(logItem);
    if (MEMORY_AUDIT_LOGS.length > 500) MEMORY_AUDIT_LOGS.pop();
    return true;
  } catch (err: any) {
    console.error('[AuditLogger] Error writing audit log:', err?.message || err);
    MEMORY_AUDIT_LOGS.unshift(logItem);
    return false;
  }
}

/**
 * Get memory logs (used if DB connection fails)
 */
export function getMemoryAuditLogs(): AuditLogEntry[] {
  return [...MEMORY_AUDIT_LOGS];
}
