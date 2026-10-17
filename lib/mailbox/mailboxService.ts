/**
 * Institute of Da'wa Islamiyya (IDI) - Mailbox Core Business Logic & Persistence
 * Manages email threads, messages, attachments, sender identities, templates, and audit logs.
 */

import { createClient } from '@supabase/supabase-js';
import { sendEmailViaResend } from './resendService';
import { extractSnippet, sanitizeEmailHtml, plainTextToSafeHtml } from './sanitize';

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

/**
 * Checks if a table exists in Supabase
 */
async function tableExists(tableName: string): Promise<boolean> {
  const supabase = getAdminSupabase();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from(tableName).select('id', { head: true, count: 'exact' });
    return !error;
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
    let query = supabase!
      .from('mailbox_emails')
      .select('*, mailbox_attachments (*)', { count: 'exact' });

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
    const fallback = MEMORY_EMAILS.filter((e) => isEmailAccessible(e, params.allowedEmails));
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
    const threadId = params.threadId || `thread-${Date.now()}`;

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
      id: params.draftId || `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      thread_id: threadId,
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
      attachments: params.attachments?.map((a, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        email_id: params.draftId || `email-${Date.now()}`,
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
      // Upsert or insert thread
      await supabase!.from('mailbox_threads').upsert(
        {
          id: threadId,
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
          id: newEmail.id,
          thread_id: threadId,
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
          in_reply_to: params.inReplyTo,
          references_header: params.references,
          is_read: true,
          is_starred: false,
          has_attachments: newEmail.has_attachments,
          provider_message_id: providerMessageId,
          sent_at: newEmail.sent_at,
          created_at: newEmail.created_at,
        })
        .select()
        .single();

      if (insertErr) {
        console.error('[Mailbox Service] Database email insert failed:', insertErr);
      }

      // Insert attachments if present
      if (params.attachments && params.attachments.length > 0) {
        const attRows = params.attachments.map((a) => ({
          email_id: newEmail.id,
          filename: a.filename,
          file_size: a.file_size || 0,
          content_type: a.content_type || 'application/octet-stream',
          storage_path: a.storage_path || `attachments/${newEmail.id}/${a.filename}`,
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
    // Extract fields from Resend / standard inbound event
    const fromStr = payload.from || payload.sender || payload.headers?.from || 'unknown@domain.com';
    const toRecipients: string[] = Array.isArray(payload.to)
      ? payload.to
      : typeof payload.to === 'string'
      ? payload.to.split(',').map((s: string) => s.trim())
      : ['info@idi.lk'];

    const subject = payload.subject || '(No Subject)';
    const textBody = payload.text || payload.plain || '';
    const htmlBody = payload.html || plainTextToSafeHtml(textBody);
    const messageId = payload.headers?.['message-id'] || payload.message_id || `<in-${Date.now()}@resend.inbound>`;
    const inReplyTo = payload.headers?.['in-reply-to'] || payload.in_reply_to;
    const references = payload.headers?.['references'] || payload.references;
    const providerMessageId = payload.email_id || payload.id;

    // Check duplicate
    const supabase = getAdminSupabase();
    const hasDb = supabase && (await tableExists('mailbox_emails'));

    if (hasDb && (providerMessageId || messageId)) {
      const { data: existing } = await supabase!
        .from('mailbox_emails')
        .select('id')
        .or(`provider_message_id.eq.${providerMessageId},message_id.eq.${messageId}`)
        .limit(1);

      if (existing && existing.length > 0) {
        console.info('[Mailbox Service] Inbound email already processed (duplicate). Skipping.');
        return { success: true, duplicate: true, id: existing[0].id };
      }
    }

    // Determine thread ID: match by In-Reply-To / References or create new
    let threadId = `thread-${Date.now()}`;
    if (hasDb && inReplyTo) {
      const { data: parent } = await supabase!
        .from('mailbox_emails')
        .select('thread_id')
        .eq('message_id', inReplyTo)
        .limit(1);

      if (parent && parent.length > 0 && parent[0].thread_id) {
        threadId = parent[0].thread_id;
      }
    }

    const snippet = extractSnippet(textBody || htmlBody, 160);
    const emailId = `inbound-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Parse sender display name
    let fromAddress = fromStr;
    let fromName = fromStr;
    const match = fromStr.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      fromName = match[1].replace(/["']/g, '').trim();
      fromAddress = match[2].trim();
    }

    const newEmail: MailboxEmail = {
      id: emailId,
      thread_id: threadId,
      direction: 'inbound',
      folder: 'inbox',
      status: 'delivered',
      from_address: fromAddress,
      from_name: fromName,
      to_recipients: toRecipients,
      cc_recipients: Array.isArray(payload.cc) ? payload.cc : [],
      subject,
      snippet,
      body_text: textBody,
      body_html: sanitizeEmailHtml(htmlBody),
      message_id: messageId,
      in_reply_to: inReplyTo,
      references_header: references,
      is_read: false,
      is_starred: false,
      has_attachments: Boolean(payload.attachments && payload.attachments.length > 0),
      provider_message_id: providerMessageId,
      created_at: new Date().toISOString(),
    };

    if (hasDb) {
      // Upsert thread
      await supabase!.from('mailbox_threads').upsert(
        {
          id: threadId,
          subject,
          snippet,
          last_message_at: new Date().toISOString(),
          is_unread: true,
          has_attachments: newEmail.has_attachments,
        },
        { onConflict: 'id' }
      );

      // Insert email
      await supabase!.from('mailbox_emails').insert(newEmail);
    } else {
      MEMORY_EMAILS.unshift(newEmail);
    }

    await logAudit(null, 'inbound_email_received', 'email', emailId, { from: fromAddress, subject });
    return { success: true, id: emailId };
  } catch (err: any) {
    console.error('[Mailbox Service] Error processing inbound webhook:', err);
    return { success: false };
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
  const item: MailboxSignature = {
    id: sig.id || `sig-${Date.now()}`,
    name: sig.name || 'Madrasa Signature',
    identity_id: sig.identity_id,
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

  const { data } = await supabase!.from('mailbox_signatures').upsert(item).select().single();
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
  const item: MailboxTemplate = {
    id: tmpl.id || `tmpl-${Date.now()}`,
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

  const { data } = await supabase!.from('mailbox_templates').upsert(item).select().single();
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
      user_id: userId,
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
