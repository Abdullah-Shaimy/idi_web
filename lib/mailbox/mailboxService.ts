/**
 * Institute of Da'wa Islamiyya (IDI) - Mailbox Core Business Logic & Persistence
 * Manages email threads, messages, attachments, sender identities, templates, and audit logs.
 */

import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendEmailViaResend, getResendClient, isResendConfigured } from './resendService';
import { extractSnippet, sanitizeEmailHtml, plainTextToSafeHtml } from './sanitize';

export function isValidUuid(val?: string | null): boolean {
  if (!val || typeof val !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

export type FolderType = 'inbox' | 'sent' | 'drafts' | 'starred' | 'archived' | 'spam' | 'trash';
export type DeliveryStatus = 'draft' | 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'complained';

export interface MailboxIdentity {
  id: string;
  email: string;
  display_name: string;
  reply_to?: string;
  is_default: boolean;
  is_verified: boolean;
  status: 'active' | 'inactive';
  signature_id?: string;
  created_at?: string;
}

export interface MailboxAttachment {
  id: string;
  email_id: string;
  filename: string;
  file_size: number;
  content_type: string;
  storage_path: string;
  created_at: string;
}

export interface MailboxEmail {
  id: string;
  thread_id?: string;
  identity_id?: string;
  direction: 'inbound' | 'outbound';
  folder: FolderType;
  status: DeliveryStatus;
  from_address: string;
  from_name?: string;
  to_recipients: string[];
  cc_recipients?: string[];
  bcc_recipients?: string[];
  reply_to?: string;
  subject: string;
  snippet?: string;
  body_text?: string;
  body_html?: string;
  message_id?: string;
  in_reply_to?: string;
  references_header?: string;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  provider_message_id?: string;
  provider_status?: string;
  error_message?: string;
  deleted_at?: string;
  sent_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at?: string;
  attachments?: MailboxAttachment[];
}

export interface MailboxTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  created_at: string;
  updated_at?: string;
}

export interface MailboxSignature {
  id: string;
  name: string;
  identity_id?: string;
  full_name?: string;
  title?: string;
  company?: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  html_content: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
}

// -----------------------------------------------------------------------------
// Supabase Backend Client (Service Role for backend actions & webhooks)
// -----------------------------------------------------------------------------
function getAdminSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// -----------------------------------------------------------------------------
// In-Memory Seed / Fallback State
// Ensures immediate operation even before running the SQL migration in Supabase
// -----------------------------------------------------------------------------
let MEMORY_IDENTITIES: MailboxIdentity[] = [];
let MEMORY_SIGNATURES: MailboxSignature[] = [];
let MEMORY_TEMPLATES: MailboxTemplate[] = [];
let MEMORY_EMAILS: MailboxEmail[] = [];
let MEMORY_AUDIT_LOGS: any[] = [];

// -----------------------------------------------------------------------------
// Core Mailbox Functions
// -----------------------------------------------------------------------------

const tableCache = new Map<string, { exists: boolean; expiresAt: number }>();

/**
 * Checks if a table exists in Supabase (cached for 5 minutes)
 */
async function tableExists(tableName: string): Promise<boolean> {
  const cached = tableCache.get(tableName);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.exists;
  }

  const supabase = getAdminSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from(tableName).select('id').limit(1);
    const exists = !error;
    tableCache.set(tableName, { exists, expiresAt: now + 5 * 60 * 1000 });
    return exists;
  } catch {
    return false;
  }
}

/**
 * Verifies if an email is accessible by an admin given their allowed email addresses.
 * Super admins or wildcard '*' can access all emails.
 */
export function isEmailAccessible(
  email: { from_address?: string; to_recipients?: string[] | any; folder?: string },
  allowedEmails?: string[]
): boolean {
  if (!allowedEmails || allowedEmails.length === 0) {
    return false;
  }
  if (allowedEmails.includes('*')) {
    return true;
  }
  const normalizedAllowed = allowedEmails.map((e) => e.toLowerCase().trim());
  const from = (email.from_address || '').toLowerCase().trim();
  if (from && normalizedAllowed.includes(from)) {
    return true;
  }

  let recipients: string[] = [];
  if (Array.isArray(email.to_recipients)) {
    recipients = email.to_recipients;
  } else if (typeof email.to_recipients === 'string') {
    try {
      const parsed = JSON.parse(email.to_recipients);
      if (Array.isArray(parsed)) recipients = parsed;
      else recipients = [email.to_recipients];
    } catch {
      recipients = [email.to_recipients];
    }
  }

  return recipients.some((r) => normalizedAllowed.includes((r || '').toLowerCase().trim()));
}

/**
 * Get folder summary count badges
 */
export async function getFolderCounts(allowedEmails?: string[]): Promise<Record<FolderType, number> & { unreadInbox: number }> {
  const emptyCounts = { inbox: 0, sent: 0, drafts: 0, starred: 0, archived: 0, spam: 0, trash: 0, unreadInbox: 0 };
  if (!allowedEmails || allowedEmails.length === 0) {
    return emptyCounts;
  }

  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_emails'));

  if (!hasDb) {
    const accessible = MEMORY_EMAILS.filter((e) => isEmailAccessible(e, allowedEmails));
    const unreadInbox = accessible.filter((e) => e.folder === 'inbox' && !e.is_read).length;
    const inbox = accessible.filter((e) => e.folder === 'inbox').length;
    const sent = accessible.filter((e) => e.folder === 'sent').length;
    const drafts = accessible.filter((e) => e.folder === 'drafts').length;
    const starred = accessible.filter((e) => e.is_starred && e.folder !== 'trash').length;
    const archived = accessible.filter((e) => e.folder === 'archived').length;
    const spam = accessible.filter((e) => e.folder === 'spam').length;
    const trash = accessible.filter((e) => e.folder === 'trash').length;

    return { inbox, sent, drafts, starred, archived, spam, trash, unreadInbox };
  }

  try {
    const { data, error } = await supabase!
      .from('mailbox_emails')
      .select('folder, is_read, is_starred, from_address, to_recipients');

    if (error) throw error;

    let inbox = 0, sent = 0, drafts = 0, starred = 0, archived = 0, spam = 0, trash = 0, unreadInbox = 0;

    for (const row of data || []) {
      if (!isEmailAccessible(row, allowedEmails)) continue;
      if (row.folder === 'inbox') {
        inbox++;
        if (!row.is_read) unreadInbox++;
      } else if (row.folder === 'sent') {
        sent++;
      } else if (row.folder === 'drafts') {
        drafts++;
      } else if (row.folder === 'archived') {
        archived++;
      } else if (row.folder === 'spam') {
        spam++;
      } else if (row.folder === 'trash') {
        trash++;
      }

      if (row.is_starred && row.folder !== 'trash') {
        starred++;
      }
    }

    return { inbox, sent, drafts, starred, archived, spam, trash, unreadInbox };
  } catch (err) {
    console.warn('[Mailbox Service] Falling back to memory counts:', err);
    const accessible = MEMORY_EMAILS.filter((e) => isEmailAccessible(e, allowedEmails));
    return {
      inbox: accessible.filter((e) => e.folder === 'inbox').length,
      sent: accessible.filter((e) => e.folder === 'sent').length,
      drafts: accessible.filter((e) => e.folder === 'drafts').length,
      starred: accessible.filter((e) => e.is_starred && e.folder !== 'trash').length,
      archived: accessible.filter((e) => e.folder === 'archived').length,
      spam: accessible.filter((e) => e.folder === 'spam').length,
      trash: accessible.filter((e) => e.folder === 'trash').length,
      unreadInbox: accessible.filter((e) => e.folder === 'inbox' && !e.is_read).length,
    };
  }
}

/**
 * List emails with server-side pagination, search & filters
 */
export async function getEmails(params: {
  folder?: FolderType;
  isStarred?: boolean;
  isRead?: boolean;
  hasAttachments?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  allowedEmails?: string[];
}): Promise<{ emails: MailboxEmail[]; total: number; page: number; totalPages: number }> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 25));
  const offset = (page - 1) * limit;

  // If no emails are permitted for this admin account, return empty list immediately
  if (!params.allowedEmails || params.allowedEmails.length === 0) {
    return { emails: [], total: 0, page: 1, totalPages: 1 };
  }

  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_emails'));

  if (!hasDb) {
    let filtered = [...MEMORY_EMAILS].filter((e) => isEmailAccessible(e, params.allowedEmails));

    if (params.isStarred) {
      filtered = filtered.filter((e) => e.is_starred && e.folder !== 'trash');
    } else if (params.folder) {
      filtered = filtered.filter((e) => e.folder === params.folder);
    }

    if (typeof params.isRead === 'boolean') {
      filtered = filtered.filter((e) => e.is_read === params.isRead);
    }

    if (typeof params.hasAttachments === 'boolean') {
      filtered = filtered.filter((e) => e.has_attachments === params.hasAttachments);
    }

    if (params.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.from_address.toLowerCase().includes(q) ||
          (e.from_name && e.from_name.toLowerCase().includes(q)) ||
          e.to_recipients.some((r) => r.toLowerCase().includes(q)) ||
          (e.snippet && e.snippet.toLowerCase().includes(q)) ||
          (e.body_text && e.body_text.toLowerCase().includes(q))
      );
    }

    // Sort latest first
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = filtered.slice(offset, offset + limit);

    return { emails: paged, total, page, totalPages };
  }

  try {
    const listFields = 'id, message_id, thread_id, folder, status, from_address, from_name, to_recipients, cc_recipients, bcc_recipients, subject, snippet, is_read, is_starred, has_attachments, created_at, updated_at';
    let query = supabase!
      .from('mailbox_emails')
      .select(listFields, { count: 'exact' });

    if (params.isStarred) {
      query = query.eq('is_starred', true).neq('folder', 'trash');
    } else if (params.folder) {
      query = query.eq('folder', params.folder);
    }

    if (typeof params.isRead === 'boolean') {
      query = query.eq('is_read', params.isRead);
    }

    if (typeof params.hasAttachments === 'boolean') {
      query = query.eq('has_attachments', params.hasAttachments);
    }

    if (params.search?.trim()) {
      const q = `%${params.search.trim()}%`;
      query = query.or(`subject.ilike.${q},from_address.ilike.${q},from_name.ilike.${q},snippet.ilike.${q}`);
    }

    query = query.order('created_at', { ascending: false });

    // If wildcard super admin, database range pagination can be applied directly
    if (params.allowedEmails.includes('*')) {
      query = query.range(offset, offset + limit - 1);
      const { data, count, error } = await query;
      if (error) throw error;

      const formatted: MailboxEmail[] = (data || []).map((row: any) => ({
        ...row,
        to_recipients: Array.isArray(row.to_recipients) ? row.to_recipients : [],
        cc_recipients: Array.isArray(row.cc_recipients) ? row.cc_recipients : [],
        bcc_recipients: Array.isArray(row.bcc_recipients) ? row.bcc_recipients : [],
        attachments: row.mailbox_attachments || [],
      }));

      const total = count || formatted.length;
      const totalPages = Math.ceil(total / limit) || 1;
      return { emails: formatted, total, page, totalPages };
    }

    // For non-super admins with restricted email permissions, fetch matching rows and filter accurately
    const { data, error } = await query;
    if (error) throw error;

    let formatted: MailboxEmail[] = (data || []).map((row: any) => ({
      ...row,
      to_recipients: Array.isArray(row.to_recipients) ? row.to_recipients : [],
      cc_recipients: Array.isArray(row.cc_recipients) ? row.cc_recipients : [],
      bcc_recipients: Array.isArray(row.bcc_recipients) ? row.bcc_recipients : [],
      attachments: row.mailbox_attachments || [],
    }));

    formatted = formatted.filter((e) => isEmailAccessible(e, params.allowedEmails));

    const total = formatted.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = formatted.slice(offset, offset + limit);

    return { emails: paged, total, page, totalPages };
  } catch (err) {
    console.warn('[Mailbox Service] DB error, falling back to memory:', err);
    let fallback = MEMORY_EMAILS.filter((e) => isEmailAccessible(e, params.allowedEmails));
    if (params.isStarred) {
      fallback = fallback.filter((e) => e.is_starred && e.folder !== 'trash');
    } else if (params.folder) {
      fallback = fallback.filter((e) => e.folder === params.folder);
    }
    return { emails: fallback, total: fallback.length, page: 1, totalPages: 1 };
  }
}

/**
 * Get a single email and all messages in its conversation thread
 */
export async function getEmailById(
  id: string,
  allowedEmails?: string[]
): Promise<{
  email: MailboxEmail | null;
  threadEmails: MailboxEmail[];
}> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_emails'));

  if (!hasDb) {
    const email = MEMORY_EMAILS.find((e) => e.id === id) || null;
    if (!email || !isEmailAccessible(email, allowedEmails)) return { email: null, threadEmails: [] };

    const threadEmails = (email.thread_id
      ? MEMORY_EMAILS.filter((e) => e.thread_id === email.thread_id).sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      : [email]
    ).filter((e) => isEmailAccessible(e, allowedEmails));

    // Automatically mark read if unread
    if (!email.is_read) {
      email.is_read = true;
    }

    return { email, threadEmails };
  }

  try {
    const { data: emailData, error } = await supabase!
      .from('mailbox_emails')
      .select('*, mailbox_attachments (*)')
      .eq('id', id)
      .single();

    if (error || !emailData) return { email: null, threadEmails: [] };

    const email: MailboxEmail = {
      ...emailData,
      to_recipients: Array.isArray(emailData.to_recipients) ? emailData.to_recipients : [],
      cc_recipients: Array.isArray(emailData.cc_recipients) ? emailData.cc_recipients : [],
      bcc_recipients: Array.isArray(emailData.bcc_recipients) ? emailData.bcc_recipients : [],
      attachments: emailData.mailbox_attachments || [],
    };

    if (!isEmailAccessible(email, allowedEmails)) {
      return { email: null, threadEmails: [] };
    }

    // Mark as read in DB if currently unread
    if (!email.is_read) {
      await supabase!.from('mailbox_emails').update({ is_read: true }).eq('id', id);
      email.is_read = true;
    }

    // Fetch related thread messages
    let threadEmails = [email];
    if (email.thread_id) {
      const { data: threadData } = await supabase!
        .from('mailbox_emails')
        .select('*, mailbox_attachments (*)')
        .eq('thread_id', email.thread_id)
        .order('created_at', { ascending: true });

      if (threadData && threadData.length > 0) {
        threadEmails = threadData
          .map((row: any) => ({
            ...row,
            to_recipients: Array.isArray(row.to_recipients) ? row.to_recipients : [],
            cc_recipients: Array.isArray(row.cc_recipients) ? row.cc_recipients : [],
            bcc_recipients: Array.isArray(row.bcc_recipients) ? row.bcc_recipients : [],
            attachments: row.mailbox_attachments || [],
          }))
          .filter((e: MailboxEmail) => isEmailAccessible(e, allowedEmails));
      }
    }

    return { email, threadEmails };
  } catch (err) {
    console.error('[Mailbox Service] Error fetching email by ID:', err);
    return { email: null, threadEmails: [] };
  }
}

/**
 * Compose, Save as Draft, or Send an email
 */
export async function composeAndSendEmail(params: {
  from: string;
  fromName?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  inReplyTo?: string;
  references?: string;
  threadId?: string;
  isDraft?: boolean;
  draftId?: string;
  attachments?: Array<{
    filename: string;
    content?: string;
    file_size?: number;
    content_type?: string;
    storage_path?: string;
  }>;
  adminUserId?: string;
  allowedEmails?: string[];
}): Promise<{ success: boolean; email?: MailboxEmail; error?: string; isSimulated?: boolean }> {
  try {
    // Authorization Check: sender email address must be in allowedEmails
    if (!params.allowedEmails || params.allowedEmails.length === 0) {
      return {
        success: false,
        error: 'Permission Denied: Your administrator account has not been granted permission for any institutional email address.',
      };
    }
    if (!params.allowedEmails.includes('*')) {
      const normalizedAllowed = params.allowedEmails.map((e) => e.toLowerCase().trim());
      const cleanFrom = (params.from || '').toLowerCase().trim();
      if (!normalizedAllowed.includes(cleanFrom)) {
        return {
          success: false,
          error: `Permission Denied: You do not have permission to send emails from "${params.from}". Authorized addresses: ${params.allowedEmails.join(', ')}`,
        };
      }
    }

    const isDraft = Boolean(params.isDraft);
    const folder: FolderType = isDraft ? 'drafts' : 'sent';
    let status: DeliveryStatus = isDraft ? 'draft' : 'queued';

    const plainText = params.text || (params.html ? extractSnippet(params.html, 5000) : '');
    const safeHtml = params.html ? sanitizeEmailHtml(params.html) : plainTextToSafeHtml(plainText);
    const snippet = extractSnippet(params.text || params.html || '', 160);

    const messageId = `<out-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@idi.lk>`;
    const finalThreadId = isValidUuid(params.threadId) ? params.threadId! : randomUUID();
    const finalEmailId = isValidUuid(params.draftId) ? params.draftId! : randomUUID();

    let providerMessageId: string | undefined = undefined;
    let isSimulated = false;

    // If sending (not draft), dispatch through Resend
    if (!isDraft) {
      const fromFormatted = params.fromName
        ? `"${params.fromName.replace(/"/g, '')}" <${params.from}>`
        : params.from;

      const resendRes = await sendEmailViaResend({
        from: fromFormatted,
        to: params.to,
        cc: params.cc,
        bcc: params.bcc,
        subject: params.subject,
        html: safeHtml,
        text: plainText,
        replyTo: params.replyTo || params.from,
        headers: {
          'Message-ID': messageId,
          ...(params.inReplyTo ? { 'In-Reply-To': params.inReplyTo } : {}),
          ...(params.references ? { References: params.references } : {}),
        },
        attachments: params.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
        })),
      });

      if (!resendRes.success) {
        return { success: false, error: resendRes.error || 'Failed to deliver email.' };
      }

      providerMessageId = resendRes.providerMessageId;
      isSimulated = Boolean(resendRes.isSimulated);
      status = 'sent';
    }

    const newEmail: MailboxEmail = {
      id: finalEmailId,
      thread_id: finalThreadId,
      direction: 'outbound',
      folder,
      status,
      from_address: params.from,
      from_name: params.fromName || 'Institute of Da\'wa Islamiyya',
      to_recipients: params.to,
      cc_recipients: params.cc || [],
      bcc_recipients: params.bcc || [],
      reply_to: params.replyTo || params.from,
      subject: params.subject || '(No Subject)',
      snippet,
      body_text: plainText,
      body_html: safeHtml,
      message_id: messageId,
      in_reply_to: params.inReplyTo,
      references_header: params.references,
      is_read: true,
      is_starred: false,
      has_attachments: Boolean(params.attachments && params.attachments.length > 0),
      provider_message_id: providerMessageId,
      sent_at: !isDraft ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
      attachments: params.attachments?.map((a) => ({
        id: randomUUID(),
        email_id: finalEmailId,
        filename: a.filename,
        file_size: a.file_size || 0,
        content_type: a.content_type || 'application/octet-stream',
        storage_path: a.storage_path || '',
        created_at: new Date().toISOString(),
      })),
    };

    // Database persistence
    const supabase = getAdminSupabase();
    const hasDb = supabase && (await tableExists('mailbox_emails'));

    if (hasDb) {
      // If transitioning from draft to sent, clean up draft record
      if (params.draftId && isValidUuid(params.draftId) && !isDraft) {
        await supabase!.from('mailbox_emails').delete().eq('id', params.draftId);
      }

      // Upsert or insert thread
      await supabase!.from('mailbox_threads').upsert(
        {
          id: finalThreadId,
          subject: params.subject || '(No Subject)',
          snippet,
          last_message_at: new Date().toISOString(),
          has_attachments: newEmail.has_attachments,
          is_unread: false,
        },
        { onConflict: 'id' }
      );

      // Insert email record
      const { data: inserted, error: insertErr } = await supabase!
        .from('mailbox_emails')
        .insert({
          id: finalEmailId,
          thread_id: finalThreadId,
          direction: 'outbound',
          folder,
          status,
          from_address: params.from,
          from_name: newEmail.from_name,
          to_recipients: params.to,
          cc_recipients: params.cc || [],
          bcc_recipients: params.bcc || [],
          reply_to: newEmail.reply_to,
          subject: newEmail.subject,
          snippet,
          body_text: plainText,
          body_html: safeHtml,
          message_id: messageId,
          in_reply_to: params.inReplyTo || null,
          references_header: params.references || null,
          is_read: true,
          is_starred: false,
          has_attachments: newEmail.has_attachments,
          provider_message_id: providerMessageId || null,
          sent_at: newEmail.sent_at || null,
          created_at: newEmail.created_at,
        })
        .select()
        .single();

      if (insertErr) {
        console.error('[Mailbox Service] Database email insert failed:', insertErr);
        throw new Error('Database insert failed: ' + insertErr.message);
      }

      // Insert attachments if present
      if (params.attachments && params.attachments.length > 0) {
        const attRows = params.attachments.map((a) => ({
          id: randomUUID(),
          email_id: finalEmailId,
          filename: a.filename,
          file_size: a.file_size || 0,
          content_type: a.content_type || 'application/octet-stream',
          storage_path: a.storage_path || `attachments/${finalEmailId}/${a.filename}`,
        }));
        await supabase!.from('mailbox_attachments').insert(attRows);
      }
    } else {
      // Store in memory
      if (params.draftId) {
        MEMORY_EMAILS = MEMORY_EMAILS.filter((e) => e.id !== params.draftId);
      }
      MEMORY_EMAILS.unshift(newEmail);
    }

    // Audit log
    await logAudit(
      params.adminUserId || null,
      isDraft ? 'save_draft' : 'send_email',
      'email',
      newEmail.id,
      { to: params.to, subject: params.subject, providerMessageId }
    );

    return {
      success: true,
      email: newEmail,
      isSimulated,
    };
  } catch (error: any) {
    console.error('[Mailbox Service] Compose / send failed:', error);
    return { success: false, error: error.message || 'Error executing email operation.' };
  }
}

/**
 * Update single email status or folder
 */
export async function updateEmailStatus(
  id: string,
  updates: { is_read?: boolean; is_starred?: boolean; folder?: FolderType }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_emails'));

  if (!hasDb) {
    const item = MEMORY_EMAILS.find((e) => e.id === id);
    if (!item) return { success: false, error: 'Email not found.' };
    if (typeof updates.is_read === 'boolean') item.is_read = updates.is_read;
    if (typeof updates.is_starred === 'boolean') item.is_starred = updates.is_starred;
    if (updates.folder) item.folder = updates.folder;
    return { success: true };
  }

  try {
    const payload: any = {};
    if (typeof updates.is_read === 'boolean') payload.is_read = updates.is_read;
    if (typeof updates.is_starred === 'boolean') payload.is_starred = updates.is_starred;
    if (updates.folder) {
      payload.folder = updates.folder;
      if (updates.folder === 'trash') {
        payload.deleted_at = new Date().toISOString();
      }
    }

    const { error } = await supabase!.from('mailbox_emails').update(payload).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Bulk email operations (archive, star, trash, read, unread, etc.)
 */
export async function bulkUpdateEmails(
  ids: string[],
  action: 'mark_read' | 'mark_unread' | 'star' | 'unstar' | 'archive' | 'trash' | 'restore' | 'spam' | 'delete_permanently',
  adminUserId?: string
): Promise<{ success: boolean; affectedCount: number; error?: string }> {
  if (!ids.length) return { success: true, affectedCount: 0 };

  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_emails'));

  if (!hasDb) {
    let count = 0;
    if (action === 'delete_permanently') {
      MEMORY_EMAILS = MEMORY_EMAILS.filter((e) => !ids.includes(e.id));
      count = ids.length;
    } else {
      for (const email of MEMORY_EMAILS) {
        if (ids.includes(email.id)) {
          count++;
          if (action === 'mark_read') email.is_read = true;
          if (action === 'mark_unread') email.is_read = false;
          if (action === 'star') email.is_starred = true;
          if (action === 'unstar') email.is_starred = false;
          if (action === 'archive') email.folder = 'archived';
          if (action === 'trash') email.folder = 'trash';
          if (action === 'restore') email.folder = 'inbox';
          if (action === 'spam') email.folder = 'spam';
        }
      }
    }
    return { success: true, affectedCount: count };
  }

  try {
    if (action === 'delete_permanently') {
      const { error } = await supabase!.from('mailbox_emails').delete().in('id', ids);
      if (error) throw error;
      await logAudit(adminUserId || null, 'bulk_delete_permanent', 'email', ids.join(','), { count: ids.length });
      return { success: true, affectedCount: ids.length };
    }

    const payload: any = {};
    if (action === 'mark_read') payload.is_read = true;
    if (action === 'mark_unread') payload.is_read = false;
    if (action === 'star') payload.is_starred = true;
    if (action === 'unstar') payload.is_starred = false;
    if (action === 'archive') payload.folder = 'archived';
    if (action === 'trash') {
      payload.folder = 'trash';
      payload.deleted_at = new Date().toISOString();
    }
    if (action === 'restore') payload.folder = 'inbox';
    if (action === 'spam') payload.folder = 'spam';

    const { error } = await supabase!.from('mailbox_emails').update(payload).in('id', ids);
    if (error) throw error;

    await logAudit(adminUserId || null, `bulk_${action}`, 'email', ids.join(','), { count: ids.length });
    return { success: true, affectedCount: ids.length };
  } catch (err: any) {
    return { success: false, affectedCount: 0, error: err.message };
  }
}

/**
 * Handle incoming inbound webhook payload from Resend or email routing
 */
export async function processInboundEmailWebhook(payload: any): Promise<{ success: boolean; duplicate?: boolean; id?: string }> {
  try {
    const event = payload;
    const data = event?.data || event || {};

    // Extract fields from Resend / standard inbound event
    const fromStr = data.from || data.sender || data.headers?.from || 'unknown@domain.com';
    const toRecipients: string[] = Array.isArray(data.to)
      ? data.to
      : typeof data.to === 'string'
      ? data.to.split(',').map((s: string) => s.trim())
      : ['info@idi.lk'];

    const subject = data.subject || '(No Subject)';
    let textBody = data.text || data.plain || '';
    let htmlBody = data.html || '';
    const providerMessageId = data.email_id || data.id;

    // If body text/html is missing but email_id is present, fetch full email via Resend receiving API
    if (!textBody && !htmlBody && providerMessageId) {
      const resend = getResendClient();
      if (resend && (resend as any).emails?.receiving?.get) {
        try {
          const recRes = await (resend as any).emails.receiving.get(providerMessageId);
          if (recRes?.data) {
            if (recRes.data.html) htmlBody = recRes.data.html;
            if (recRes.data.text) textBody = recRes.data.text;
          }
        } catch (fetchErr) {
          console.warn('[Mailbox Service] Could not fetch email body from Resend receiving API:', fetchErr);
        }
      }
    }

    if (!htmlBody && textBody) htmlBody = plainTextToSafeHtml(textBody);
    if (!textBody && htmlBody) textBody = extractSnippet(htmlBody, 5000);

    const messageId = data.headers?.['message-id'] || data.message_id || `<in-${Date.now()}@resend.inbound>`;
    const inReplyTo = data.headers?.['in-reply-to'] || data.in_reply_to;
    const references = data.headers?.['references'] || data.references;

    // Check duplicate
    const supabase = getAdminSupabase();
    const hasDb = supabase && (await tableExists('mailbox_emails'));

    if (hasDb && (providerMessageId || messageId)) {
      let dupQuery = supabase!.from('mailbox_emails').select('id');
      if (providerMessageId) {
        dupQuery = dupQuery.eq('provider_message_id', providerMessageId);
      } else {
        dupQuery = dupQuery.eq('message_id', messageId);
      }
      const { data: existing } = await dupQuery.limit(1);

      if (existing && existing.length > 0) {
        console.info('[Mailbox Service] Inbound email already processed (duplicate). Skipping.');
        return { success: true, duplicate: true, id: existing[0].id };
      }
    }

    // Determine thread ID: match by In-Reply-To / References or Subject
    let threadId: string | null = null;
    if (hasDb && inReplyTo) {
      const { data: parent } = await supabase!
        .from('mailbox_emails')
        .select('thread_id')
        .eq('message_id', inReplyTo)
        .limit(1);

      if (parent && parent.length > 0 && isValidUuid(parent[0].thread_id)) {
        threadId = parent[0].thread_id;
      }
    }

    if (hasDb && !threadId && subject) {
      const cleanSubject = subject.replace(/^(re|fwd|fw):\s*/i, '').trim();
      if (cleanSubject.length > 3) {
        const { data: parentBySub } = await supabase!
          .from('mailbox_threads')
          .select('id')
          .ilike('subject', `%${cleanSubject}%`)
          .order('last_message_at', { ascending: false })
          .limit(1);

        if (parentBySub && parentBySub.length > 0 && isValidUuid(parentBySub[0].id)) {
          threadId = parentBySub[0].id;
        }
      }
    }

    const finalThreadId = threadId || randomUUID();
    const finalEmailId = randomUUID();
    const snippet = extractSnippet(textBody || htmlBody, 160);

    // Parse sender display name
    let fromAddress = fromStr;
    let fromName = fromStr;
    const match = fromStr.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      fromName = match[1].replace(/["']/g, '').trim();
      fromAddress = match[2].trim();
    }

    const newEmail: MailboxEmail = {
      id: finalEmailId,
      thread_id: finalThreadId,
      direction: 'inbound',
      folder: 'inbox',
      status: 'delivered',
      from_address: fromAddress,
      from_name: fromName,
      to_recipients: toRecipients,
      cc_recipients: Array.isArray(data.cc) ? data.cc : [],
      bcc_recipients: Array.isArray(data.bcc) ? data.bcc : [],
      subject,
      snippet,
      body_text: textBody,
      body_html: sanitizeEmailHtml(htmlBody),
      message_id: messageId,
      in_reply_to: inReplyTo,
      references_header: references,
      is_read: false,
      is_starred: false,
      has_attachments: Boolean(data.attachments && data.attachments.length > 0),
      provider_message_id: providerMessageId,
      created_at: new Date().toISOString(),
    };

    if (hasDb) {
      // Upsert thread
      await supabase!.from('mailbox_threads').upsert(
        {
          id: finalThreadId,
          subject,
          snippet,
          last_message_at: new Date().toISOString(),
          is_unread: true,
          has_attachments: newEmail.has_attachments,
        },
        { onConflict: 'id' }
      );

      // Insert email
      const { error: insertErr } = await supabase!.from('mailbox_emails').insert({
        id: finalEmailId,
        thread_id: finalThreadId,
        direction: 'inbound',
        folder: 'inbox',
        status: 'delivered',
        from_address: fromAddress,
        from_name: fromName,
        to_recipients: toRecipients,
        cc_recipients: Array.isArray(data.cc) ? data.cc : [],
        bcc_recipients: Array.isArray(data.bcc) ? data.bcc : [],
        subject,
        snippet,
        body_text: textBody,
        body_html: sanitizeEmailHtml(htmlBody),
        message_id: messageId,
        in_reply_to: inReplyTo || null,
        references_header: references || null,
        is_read: false,
        is_starred: false,
        has_attachments: Boolean(data.attachments && data.attachments.length > 0),
        provider_message_id: providerMessageId || null,
        created_at: new Date().toISOString(),
      });

      if (insertErr) {
        console.error('[Mailbox Service] Error inserting inbound email to database:', insertErr);
        throw insertErr;
      }
    } else {
      MEMORY_EMAILS.unshift(newEmail);
    }

    await logAudit(null, 'inbound_email_received', 'email', finalEmailId, { from: fromAddress, subject });
    return { success: true, id: finalEmailId };
  } catch (err: any) {
    console.error('[Mailbox Service] Error processing inbound webhook:', err);
    return { success: false };
  }
}

/**
 * Polls & Synchronizes received emails from Resend Receiving API
 * Ensures received domain emails are automatically imported into Inbox
 */
export async function syncInboundEmailsFromResend(): Promise<{ count: number }> {
  const resend = getResendClient();
  if (!resend || !(resend as any).emails?.receiving?.list) {
    return { count: 0 };
  }

  try {
    const listRes = await (resend as any).emails.receiving.list();
    const items = listRes?.data?.data || listRes?.data || [];
    if (!Array.isArray(items) || items.length === 0) {
      return { count: 0 };
    }

    let importedCount = 0;
    const supabase = getAdminSupabase();
    const hasDb = supabase && (await tableExists('mailbox_emails'));

    for (const item of items) {
      const emailId = item.id;
      if (!emailId) continue;

      if (hasDb) {
        const { data: existing } = await supabase!
          .from('mailbox_emails')
          .select('id')
          .eq('provider_message_id', emailId)
          .limit(1);

        if (existing && existing.length > 0) continue;
      }

      try {
        let fullData = item;
        try {
          const full = await (resend as any).emails.receiving.get(emailId);
          if (full?.data) fullData = full.data;
        } catch {
          // Use item directly if get fails
        }

        await processInboundEmailWebhook({
          type: 'email.received',
          data: {
            ...fullData,
            email_id: emailId,
          },
        });
        importedCount++;
      } catch (err) {
        console.warn(`[Mailbox Sync] Failed to process receiving email ${emailId}:`, err);
      }
    }

    return { count: importedCount };
  } catch (err) {
    console.warn('[Mailbox Sync] Error listing receiving emails from Resend:', err);
    return { count: 0 };
  }
}

/**
 * Handle delivery status event webhooks from Resend
 */
export async function processDeliveryWebhook(event: {
  type: string;
  data: {
    email_id?: string;
    created_at?: string;
    to?: string[];
    bounce?: any;
    error?: string;
  };
}): Promise<{ success: boolean }> {
  try {
    const emailId = event.data?.email_id;
    if (!emailId) return { success: true };

    let status: DeliveryStatus | null = null;
    let deliveredAt: string | undefined = undefined;

    switch (event.type) {
      case 'email.delivered':
        status = 'delivered';
        deliveredAt = new Date().toISOString();
        break;
      case 'email.bounced':
        status = 'bounced';
        break;
      case 'email.complained':
        status = 'complained';
        break;
      case 'email.failed':
        status = 'failed';
        break;
      case 'email.sent':
        status = 'sent';
        break;
    }

    if (!status) return { success: true };

    const supabase = getAdminSupabase();
    const hasDb = supabase && (await tableExists('mailbox_emails'));

    if (hasDb) {
      const updatePayload: any = { status, provider_status: event.type };
      if (deliveredAt) updatePayload.delivered_at = deliveredAt;
      if (event.data.error || event.data.bounce) {
        updatePayload.error_message = JSON.stringify(event.data.bounce || event.data.error);
      }

      await supabase!
        .from('mailbox_emails')
        .update(updatePayload)
        .eq('provider_message_id', emailId);
    } else {
      const item = MEMORY_EMAILS.find((e) => e.provider_message_id === emailId);
      if (item) {
        item.status = status;
        if (deliveredAt) item.delivered_at = deliveredAt;
      }
    }

    return { success: true };
  } catch (err) {
    console.error('[Mailbox Service] Error processing delivery webhook:', err);
    return { success: false };
  }
}

// -----------------------------------------------------------------------------
// SENDER IDENTITIES MANAGEMENT
// -----------------------------------------------------------------------------
export async function getIdentities(allowedEmails?: string[]): Promise<MailboxIdentity[]> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_identities'));
  let identities = MEMORY_IDENTITIES;

  if (hasDb) {
    try {
      const { data, error } = await supabase!.from('mailbox_identities').select('*').order('created_at', { ascending: true });
      if (!error && data) identities = data;
    } catch {
      identities = MEMORY_IDENTITIES;
    }
  }

  // Super Admin wildcard allows all sender identities
  if (allowedEmails && allowedEmails.includes('*')) {
    return identities;
  }

  // If no allowed emails granted to this admin, return empty list (no identities accessible)
  if (!allowedEmails || allowedEmails.length === 0) {
    return [];
  }

  const normalized = allowedEmails.map((e) => e.toLowerCase().trim());
  return identities.filter((i) => normalized.includes(i.email.toLowerCase().trim()));
}

export async function upsertIdentity(identity: Partial<MailboxIdentity>): Promise<MailboxIdentity> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_identities'));

  const email = identity.email?.toLowerCase().trim() || 'info@idi.lk';
  const displayName = identity.display_name?.trim() || email.split('@')[0];

  if (!hasDb) {
    const item: MailboxIdentity = {
      id: identity.id || `identity-${Date.now()}`,
      email,
      display_name: displayName,
      reply_to: identity.reply_to || email,
      is_default: Boolean(identity.is_default),
      is_verified: true,
      status: identity.status || 'active',
      signature_id: identity.signature_id,
    };
    if (item.is_default) {
      MEMORY_IDENTITIES.forEach((i) => (i.is_default = false));
    }
    const idx = MEMORY_IDENTITIES.findIndex((i) => i.id === item.id || i.email === item.email);
    if (idx >= 0) {
      MEMORY_IDENTITIES[idx] = { ...MEMORY_IDENTITIES[idx], ...item };
      return MEMORY_IDENTITIES[idx];
    } else {
      MEMORY_IDENTITIES.push(item);
      return item;
    }
  }

  // Check if identity already exists by id or email
  let existingQuery = supabase!.from('mailbox_identities').select('*');
  if (identity.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identity.id)) {
    existingQuery = existingQuery.eq('id', identity.id);
  } else {
    existingQuery = existingQuery.eq('email', email);
  }
  const { data: existing } = await existingQuery.maybeSingle();

  const payload: any = {
    email,
    display_name: displayName,
    reply_to: identity.reply_to || email,
    is_default: Boolean(identity.is_default),
    is_verified: true,
    status: identity.status || 'active',
    signature_id: identity.signature_id || null,
  };

  if (existing?.id) {
    payload.id = existing.id;
  } else if (identity.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identity.id)) {
    payload.id = identity.id;
  }

  if (payload.is_default && payload.id) {
    await supabase!.from('mailbox_identities').update({ is_default: false }).neq('id', payload.id);
  }

  const { data, error } = await supabase!
    .from('mailbox_identities')
    .upsert(payload, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting mailbox identity:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteIdentity(idOrEmail: string): Promise<boolean> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_identities'));
  if (!hasDb) {
    MEMORY_IDENTITIES = MEMORY_IDENTITIES.filter((i) => i.id !== idOrEmail && i.email !== idOrEmail);
    return true;
  }
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrEmail);
  const query = supabase!.from('mailbox_identities').delete();
  const { error } = isUuid ? await query.eq('id', idOrEmail) : await query.eq('email', idOrEmail);
  return !error;
}

// -----------------------------------------------------------------------------
// SIGNATURES MANAGEMENT
// -----------------------------------------------------------------------------
export async function getSignatures(): Promise<MailboxSignature[]> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_signatures'));
  if (!hasDb) return MEMORY_SIGNATURES;
  try {
    const { data } = await supabase!.from('mailbox_signatures').select('*').order('created_at', { ascending: false });
    return data || MEMORY_SIGNATURES;
  } catch {
    return MEMORY_SIGNATURES;
  }
}

export async function upsertSignature(sig: Partial<MailboxSignature>): Promise<MailboxSignature> {
  const finalId = isValidUuid(sig.id) ? sig.id! : randomUUID();
  const identityId = isValidUuid(sig.identity_id) ? sig.identity_id! : undefined;

  const item: MailboxSignature = {
    id: finalId,
    name: sig.name || 'Madrasa Signature',
    identity_id: identityId,
    full_name: sig.full_name,
    title: sig.title,
    company: sig.company || 'Institute of Da\'wa Islamiyya',
    phone: sig.phone,
    website: sig.website || 'https://idi.lk',
    logo_url: sig.logo_url || '/assets/images/idi_logo.webp',
    html_content: sig.html_content || '',
    is_default: Boolean(sig.is_default),
    created_at: new Date().toISOString(),
  };

  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_signatures'));
  if (!hasDb) {
    const idx = MEMORY_SIGNATURES.findIndex((s) => s.id === item.id);
    if (idx >= 0) MEMORY_SIGNATURES[idx] = item;
    else MEMORY_SIGNATURES.push(item);
    return item;
  }

  const payload: any = { ...item };
  if (!isValidUuid(sig.id)) delete payload.id;
  if (!isValidUuid(payload.identity_id)) payload.identity_id = null;

  const { data, error } = await supabase!.from('mailbox_signatures').upsert(payload).select().single();
  if (error) {
    console.error('Error upserting signature:', error);
    throw error;
  }
  return data || item;
}

export async function deleteSignature(id: string): Promise<boolean> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_signatures'));
  if (!hasDb) {
    MEMORY_SIGNATURES = MEMORY_SIGNATURES.filter((s) => s.id !== id);
    return true;
  }
  const { error } = await supabase!.from('mailbox_signatures').delete().eq('id', id);
  return !error;
}

// -----------------------------------------------------------------------------
// TEMPLATES MANAGEMENT
// -----------------------------------------------------------------------------
export async function getTemplates(): Promise<MailboxTemplate[]> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_templates'));
  if (!hasDb) return MEMORY_TEMPLATES;
  try {
    const { data } = await supabase!.from('mailbox_templates').select('*').order('created_at', { ascending: false });
    return data || MEMORY_TEMPLATES;
  } catch {
    return MEMORY_TEMPLATES;
  }
}

export async function upsertTemplate(tmpl: Partial<MailboxTemplate>): Promise<MailboxTemplate> {
  const finalId = isValidUuid(tmpl.id) ? tmpl.id! : randomUUID();

  const item: MailboxTemplate = {
    id: finalId,
    name: tmpl.name || 'New Template',
    subject: tmpl.subject || '',
    body_html: tmpl.body_html || '',
    body_text: tmpl.body_text || '',
    created_at: new Date().toISOString(),
  };

  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_templates'));
  if (!hasDb) {
    const idx = MEMORY_TEMPLATES.findIndex((t) => t.id === item.id);
    if (idx >= 0) MEMORY_TEMPLATES[idx] = item;
    else MEMORY_TEMPLATES.push(item);
    return item;
  }

  const payload: any = { ...item };
  if (!isValidUuid(tmpl.id)) delete payload.id;

  const { data, error } = await supabase!.from('mailbox_templates').upsert(payload).select().single();
  if (error) {
    console.error('Error upserting template:', error);
    throw error;
  }
  return data || item;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  const supabase = getAdminSupabase();
  const hasDb = supabase && (await tableExists('mailbox_templates'));
  if (!hasDb) {
    MEMORY_TEMPLATES = MEMORY_TEMPLATES.filter((t) => t.id !== id);
    return true;
  }
  const { error } = await supabase!.from('mailbox_templates').delete().eq('id', id);
  return !error;
}

// -----------------------------------------------------------------------------
// AUDIT LOGGING
// -----------------------------------------------------------------------------
export async function logAudit(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  details?: any
) {
  try {
    const logItem = {
      user_id: isValidUuid(userId) ? userId : null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString(),
    };

    const supabase = getAdminSupabase();
    const hasDb = supabase && (await tableExists('mailbox_audit_logs'));

    if (hasDb) {
      await supabase!.from('mailbox_audit_logs').insert(logItem);
    } else {
      MEMORY_AUDIT_LOGS.push(logItem);
    }
  } catch (err) {
    console.error('[Mailbox Service] Failed to write audit log:', err);
  }
}
