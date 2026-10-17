'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './mailbox.css';
import { sanitizeEmailHtml } from '../../../lib/mailbox/sanitize';
import { IDISupabase } from '../../../lib/supabaseClient';

export type FolderType = 'inbox' | 'sent' | 'drafts' | 'starred' | 'archived' | 'spam' | 'trash';

interface MailboxAttachment {
  id?: string;
  filename: string;
  file_size?: number;
  content_type?: string;
  storage_path?: string;
  content?: string;
}

interface MailboxEmail {
  id: string;
  thread_id?: string;
  folder: FolderType;
  status: 'draft' | 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'complained';
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
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  message_id?: string;
  in_reply_to?: string;
  references_header?: string;
  created_at: string;
  sent_at?: string;
  delivered_at?: string;
  attachments?: MailboxAttachment[];
}

interface MailboxIdentity {
  id: string;
  email: string;
  display_name: string;
  reply_to?: string;
  is_default: boolean;
  is_verified: boolean;
  status: 'active' | 'inactive';
  signature_id?: string;
}

interface MailboxTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
}

interface MailboxSignature {
  id: string;
  name: string;
  identity_id?: string;
  full_name?: string;
  title?: string;
  company?: string;
  phone?: string;
  website?: string;
  html_content: string;
  is_default: boolean;
}

export interface MailboxManagerProps {
  adminProfile?: any;
  isSuperAdmin?: boolean;
}

export default function MailboxManager({ adminProfile: propProfile, isSuperAdmin: propIsSuper }: MailboxManagerProps = {}) {
  const [currentAdminProfile, setCurrentAdminProfile] = useState<any>(propProfile || null);
  const [isSuper, setIsSuper] = useState<boolean>(propIsSuper ?? false);

  useEffect(() => {
    if (propProfile) {
      setCurrentAdminProfile(propProfile);
      setIsSuper(propIsSuper ?? propProfile.role === 'super_admin');
      return;
    }
    async function fetchMyProfile() {
      try {
        const user = await IDISupabase.getUser();
        if (user) {
          const prof = await IDISupabase.getAdminProfile(user.id);
          if (prof) {
            setCurrentAdminProfile(prof);
            setIsSuper(prof.role === 'super_admin');
          }
        }
      } catch {}
    }
    fetchMyProfile();
  }, [propProfile, propIsSuper]);

  const allowedEmailsList: string[] = isSuper
    ? ['*']
    : Array.isArray(currentAdminProfile?.allowed_emails)
    ? currentAdminProfile.allowed_emails
    : [];

  const hasMailboxAccess = isSuper || allowedEmailsList.length > 0;

  // Navigation & Filter State
  const [activeFolder, setActiveFolder] = useState<FolderType>('inbox');
  const [filterStarred, setFilterStarred] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const [filterHasAttachments, setFilterHasAttachments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);

  // Email List & Detail State
  const [emails, setEmails] = useState<MailboxEmail[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<MailboxEmail | null>(null);
  const [threadMessages, setThreadMessages] = useState<MailboxEmail[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedHeaders, setExpandedHeaders] = useState<Record<string, boolean>>({});

  // Counts & Stats
  const [counts, setCounts] = useState({
    inbox: 0,
    sent: 0,
    drafts: 0,
    starred: 0,
    archived: 0,
    spam: 0,
    trash: 0,
    unreadInbox: 0,
  });

  // Sender Identities, Templates, Signatures
  const [identities, setIdentities] = useState<MailboxIdentity[]>([]);
  const [templates, setTemplates] = useState<MailboxTemplate[]>([]);
  const [signatures, setSignatures] = useState<MailboxSignature[]>([]);

  // Modals
  const [composeOpen, setComposeOpen] = useState(false);
  const [dnsModalOpen, setDnsModalOpen] = useState(false);
  const [identitiesModalOpen, setIdentitiesModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [signaturesModalOpen, setSignaturesModalOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  // Compose State
  const [composeFrom, setComposeFrom] = useState('');
  const [composeFromName, setComposeFromName] = useState('');
  const [composeTo, setComposeTo] = useState('');
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeHtml, setComposeHtml] = useState('');
  const [composePlainText, setComposePlainText] = useState('');
  const [isPlainTextMode, setIsPlainTextMode] = useState(false);
  const [composeDraftId, setComposeDraftId] = useState<string | undefined>(undefined);
  const [composeThreadId, setComposeThreadId] = useState<string | undefined>(undefined);
  const [composeInReplyTo, setComposeInReplyTo] = useState<string | undefined>(undefined);
  const [composeReferences, setComposeReferences] = useState<string | undefined>(undefined);
  const [composeAttachments, setComposeAttachments] = useState<MailboxAttachment[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Identity Form State
  const [editIdentityData, setEditIdentityData] = useState<Partial<MailboxIdentity>>({
    email: '',
    display_name: '',
    reply_to: '',
    is_default: false,
  });

  // Template Form State
  const [editTemplateData, setEditTemplateData] = useState<Partial<MailboxTemplate>>({
    name: '',
    subject: '',
    body_html: '',
    body_text: '',
  });

  // Signature Form State
  const [editSignatureData, setEditSignatureData] = useState<Partial<MailboxSignature>>({
    name: '',
    full_name: '',
    title: '',
    company: "Institute of Da'wa Islamiyya",
    phone: '',
    website: 'https://idi.lk',
    html_content: '',
    is_default: true,
  });

  // Toast Notifications
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'warning' | 'danger' }>>([]);
  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'danger' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authenticated fetch helper ensuring session token is forwarded
  const authFetch = useCallback(async (url: string, init?: RequestInit) => {
    let token = '';
    try {
      const session = await IDISupabase.getSession();
      if (session?.access_token) {
        token = session.access_token;
      }
    } catch {}

    const headers = new Headers(init?.headers || {});
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(url, { ...init, headers });
  }, []);

  // 1. Fetch Identities, Templates, Signatures on Load
  useEffect(() => {
    async function loadMeta() {
      try {
        const [idRes, tmplRes, sigRes] = await Promise.all([
          authFetch('/api/admin/mailbox/identities').then((r) => r.json()),
          authFetch('/api/admin/mailbox/templates').then((r) => r.json()),
          authFetch('/api/admin/mailbox/signatures').then((r) => r.json()),
        ]);

        if (idRes.success && idRes.identities) {
          setIdentities(idRes.identities);
          const def = idRes.identities.find((i: MailboxIdentity) => i.is_default) || idRes.identities[0];
          if (def) {
            setComposeFrom(def.email);
            setComposeFromName(def.display_name);
          }
        }
        if (tmplRes.success && tmplRes.templates) setTemplates(tmplRes.templates);
        if (sigRes.success && sigRes.signatures) setSignatures(sigRes.signatures);
      } catch (err) {
        console.error('Failed to load mailbox metadata:', err);
      }
    }
    loadMeta();
  }, [authFetch]);

  // 2. Fetch Emails List
  const loadEmails = useCallback(async () => {
    setLoadingEmails(true);
    try {
      const params = new URLSearchParams();
      if (filterStarred) {
        params.set('starred', 'true');
      } else {
        params.set('folder', activeFolder);
      }
      if (filterUnread) params.set('isRead', 'false');
      if (filterHasAttachments) params.set('hasAttachments', 'true');
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      params.set('page', currentPage.toString());
      params.set('limit', '25');

      const res = await authFetch(`/api/admin/mailbox/emails?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setEmails(data.emails || []);
        setTotalEmails(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.counts) setCounts(data.counts);
      } else {
        showToast(data.error || 'Failed to fetch emails', 'danger');
      }
    } catch (err: any) {
      showToast('Error loading emails: ' + err.message, 'danger');
    } finally {
      setLoadingEmails(false);
    }
  }, [activeFolder, filterStarred, filterUnread, filterHasAttachments, searchTerm, currentPage, showToast, authFetch]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  // 3. Fetch Single Email Detail & Conversation Thread
  const openEmail = async (email: MailboxEmail) => {
    setSelectedEmailId(email.id);
    setSelectedEmail(email);
    setLoadingThread(true);

    try {
      const res = await authFetch(`/api/admin/mailbox/emails/${email.id}`);
      const data = await res.json();

      if (data.success && data.email) {
        setSelectedEmail(data.email);
        setThreadMessages(data.threadEmails || [data.email]);

        // Optimistically mark as read in local list
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, is_read: true } : e))
        );
        setCounts((prev) => ({
          ...prev,
          unreadInbox: Math.max(0, prev.unreadInbox - (email.is_read ? 0 : 1)),
        }));
      }
    } catch (err: any) {
      showToast('Failed to load message thread: ' + err.message, 'danger');
    } finally {
      setLoadingThread(false);
    }
  };

  // 4. Toggle Star Status
  const toggleStar = async (email: MailboxEmail, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStar = !email.is_starred;

    // Optimistic update
    setEmails((prev) =>
      prev.map((item) => (item.id === email.id ? { ...item, is_starred: newStar } : item))
    );
    if (selectedEmail && selectedEmail.id === email.id) {
      setSelectedEmail({ ...selectedEmail, is_starred: newStar });
    }

    try {
      await authFetch(`/api/admin/mailbox/emails/${email.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_starred: newStar }),
      });
      setCounts((prev) => ({
        ...prev,
        starred: prev.starred + (newStar ? 1 : -1),
      }));
    } catch {
      showToast('Failed to update star', 'danger');
    }
  };

  // 5. Bulk Actions Handler
  const handleBulkAction = async (action: 'mark_read' | 'mark_unread' | 'star' | 'unstar' | 'archive' | 'trash' | 'restore' | 'spam' | 'delete_permanently') => {
    const ids = selectedIds.length ? selectedIds : (selectedEmailId ? [selectedEmailId] : []);
    if (!ids.length) {
      showToast('Select at least one email first.', 'warning');
      return;
    }

    if (action === 'delete_permanently') {
      setConfirmDeleteModal(true);
      return;
    }

    try {
      const res = await authFetch('/api/admin/mailbox/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Action applied to ${data.affectedCount || ids.length} email(s).`);
        setSelectedIds([]);
        if (ids.includes(selectedEmailId || '')) {
          setSelectedEmailId(null);
          setSelectedEmail(null);
        }
        loadEmails();
      } else {
        showToast(data.error || 'Bulk action failed', 'danger');
      }
    } catch (err: any) {
      showToast('Action failed: ' + err.message, 'danger');
    }
  };

  const confirmPermanentDelete = async () => {
    const ids = selectedIds.length ? selectedIds : (selectedEmailId ? [selectedEmailId] : []);
    try {
      const res = await authFetch('/api/admin/mailbox/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action: 'delete_permanently' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Emails permanently deleted.');
        setConfirmDeleteModal(false);
        setSelectedIds([]);
        setSelectedEmailId(null);
        setSelectedEmail(null);
        loadEmails();
      }
    } catch (err: any) {
      showToast('Failed to delete permanently: ' + err.message, 'danger');
    }
  };

  // 6. Reply, Reply All, and Forward Actions
  const handleReply = (type: 'reply' | 'reply_all' | 'forward', targetEmail: MailboxEmail) => {
    const defaultIdentity = identities.find((i) => i.is_default) || identities[0];
    const myEmail = defaultIdentity ? defaultIdentity.email : 'info@idi.lk';

    setComposeDraftId(undefined);
    setComposeThreadId(targetEmail.thread_id);
    setComposeInReplyTo(targetEmail.message_id);
    setComposeReferences(
      [targetEmail.references_header, targetEmail.message_id].filter(Boolean).join(' ')
    );

    const quotedDate = new Date(targetEmail.created_at).toLocaleString();
    const quotedHeader = `\n\n<br/><br/><div style="border-left: 2px solid #cbd5e1; padding-left: 12px; margin-top: 16px; color: #475569;"><p style="margin: 0; font-size: 13px;"><strong>On ${quotedDate}, ${targetEmail.from_name || targetEmail.from_address} &lt;${targetEmail.from_address}&gt; wrote:</strong></p>${targetEmail.body_html || targetEmail.body_text}</div>`;

    if (type === 'reply') {
      setComposeTo(targetEmail.from_address);
      setComposeCc('');
      setShowCc(false);
      setComposeSubject(
        targetEmail.subject.startsWith('Re:') ? targetEmail.subject : `Re: ${targetEmail.subject}`
      );
      setComposeHtml(quotedHeader);
      setComposeAttachments([]);
    } else if (type === 'reply_all') {
      const otherRecipients = (targetEmail.to_recipients || []).filter(
        (r) => r.toLowerCase() !== myEmail.toLowerCase()
      );
      setComposeTo([targetEmail.from_address, ...otherRecipients].join(', '));
      const ccs = (targetEmail.cc_recipients || []).filter(
        (r) => r.toLowerCase() !== myEmail.toLowerCase()
      );
      setComposeCc(ccs.join(', '));
      setShowCc(ccs.length > 0);
      setComposeSubject(
        targetEmail.subject.startsWith('Re:') ? targetEmail.subject : `Re: ${targetEmail.subject}`
      );
      setComposeHtml(quotedHeader);
      setComposeAttachments([]);
    } else if (type === 'forward') {
      setComposeTo('');
      setComposeCc('');
      setShowCc(false);
      setComposeSubject(
        targetEmail.subject.startsWith('Fwd:') ? targetEmail.subject : `Fwd: ${targetEmail.subject}`
      );
      const forwardHeader = `\n\n<br/><br/><div style="border-left: 2px solid #006d44; padding-left: 12px; margin-top: 16px;"><p style="margin: 0; font-size: 13px;">---------- Forwarded message ---------<br/><strong>From:</strong> ${targetEmail.from_name || targetEmail.from_address} &lt;${targetEmail.from_address}&gt;<br/><strong>Date:</strong> ${quotedDate}<br/><strong>Subject:</strong> ${targetEmail.subject}<br/><strong>To:</strong> ${(targetEmail.to_recipients || []).join(', ')}</p><br/>${targetEmail.body_html || targetEmail.body_text}</div>`;
      setComposeHtml(forwardHeader);
      setComposeAttachments(targetEmail.attachments || []);
    }

    setComposeOpen(true);
  };

  // 7. Compose & Dispatch
  const openNewCompose = () => {
    setComposeDraftId(undefined);
    setComposeThreadId(undefined);
    setComposeInReplyTo(undefined);
    setComposeReferences(undefined);
    setComposeTo('');
    setComposeCc('');
    setComposeBcc('');
    setShowCc(false);
    setShowBcc(false);
    setComposeSubject('');
    setComposeHtml('');
    setComposePlainText('');
    setComposeAttachments([]);

    // Insert active signature if available
    const activeSig = signatures.find((s) => s.is_default) || signatures[0];
    if (activeSig) {
      setComposeHtml(`<p><br/><br/></p>${activeSig.html_content}`);
    }

    setComposeOpen(true);
  };

  const handleSendOrDraft = async (isDraft: boolean) => {
    if (!composeFrom) {
      showToast('Select a sender address.', 'warning');
      return;
    }
    if (!isDraft && !composeTo.trim()) {
      showToast('Recipient address (To) is required.', 'warning');
      return;
    }

    setSendingEmail(true);

    try {
      const toArray = composeTo
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const ccArray = composeCc
        ? composeCc.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
        : [];

      const bccArray = composeBcc
        ? composeBcc.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
        : [];

      const contentHtml = editorRef.current ? editorRef.current.innerHTML : composeHtml;

      const res = await authFetch('/api/admin/mailbox/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: composeFrom,
          fromName: composeFromName,
          to: toArray,
          cc: ccArray,
          bcc: bccArray,
          subject: composeSubject,
          html: contentHtml,
          text: composePlainText,
          isDraft,
          draftId: composeDraftId,
          threadId: composeThreadId,
          inReplyTo: composeInReplyTo,
          references: composeReferences,
          attachments: composeAttachments,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showToast(
          isDraft ? 'Draft saved successfully.' : 'Email sent successfully!' + (data.isSimulated ? ' (Dev Mode Simulation)' : '')
        );
        setComposeOpen(false);
        loadEmails();

        // If an email thread was open, immediately refresh the thread so the sent message shows in conversation chat
        if (selectedEmailId) {
          authFetch(`/api/admin/mailbox/emails/${selectedEmailId}`)
            .then((r) => r.json())
            .then((threadData) => {
              if (threadData.success && threadData.email) {
                setSelectedEmail(threadData.email);
                setThreadMessages(threadData.threadEmails || [threadData.email]);
              }
            })
            .catch((e) => console.warn('Could not reload thread:', e));
        }
      } else {
        showToast(data.error || 'Failed to dispatch email.', 'danger');
      }
    } catch (err: any) {
      showToast('Error during email dispatch: ' + err.message, 'danger');
    } finally {
      setSendingEmail(false);
    }
  };

  // 8. Attachment Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    setUploadingAttachment(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await authFetch('/api/admin/mailbox/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (data.success && data.file) {
          setComposeAttachments((prev) => [...prev, data.file]);
          showToast(`Attached: ${file.name}`);
        } else {
          showToast(data.error || `Failed to attach ${file.name}`, 'danger');
        }
      }
    } catch (err: any) {
      showToast('Attachment error: ' + err.message, 'danger');
    } finally {
      setUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setComposeAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // 9. Template Insertion
  const insertTemplate = (tmpl: MailboxTemplate) => {
    if (composeHtml.trim().length > 30) {
      if (!confirm(`Insert template "${tmpl.name}"? This will replace your subject and message.`)) {
        return;
      }
    }
    if (tmpl.subject) setComposeSubject(tmpl.subject);
    if (editorRef.current) {
      editorRef.current.innerHTML = tmpl.body_html;
    }
    setComposeHtml(tmpl.body_html);
    showToast(`Template "${tmpl.name}" applied.`);
  };

  // 10. Rich Editor Command
  const execEditorCmd = (cmd: string, val: string = '') => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      setComposeHtml(editorRef.current.innerHTML);
    }
  };

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === emails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map((e) => e.id));
    }
  };

  return (
    <div className="mailbox-wrapper">
      {/* ===================================================================
          1. LEFT SIDEBAR (FOLDERS & SHORTCUTS)
          =================================================================== */}
      <aside className="mailbox-sidebar">
        <button
          className="mailbox-compose-btn"
          onClick={() => {
            if (!hasMailboxAccess || identities.length === 0) {
              showToast('Your administrator account has not been assigned permission to any institutional sender address.', 'warning');
              return;
            }
            openNewCompose();
          }}
          style={!hasMailboxAccess || identities.length === 0 ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
          title={!hasMailboxAccess || identities.length === 0 ? 'No authorized sender addresses available' : 'Compose new email'}
        >
          <i className="fa-solid fa-pen"></i> Compose
        </button>

        {!isSuper && (
          <div style={{ margin: '0.65rem 0.75rem 0.25rem', padding: '0.5rem 0.75rem', background: 'rgba(0,109,68,0.06)', border: '1px solid rgba(0,109,68,0.15)', borderRadius: '6px', fontSize: '0.78rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <i className="fa-solid fa-shield-halved"></i>
              <span>Assigned Mailbox:</span>
            </div>
            {allowedEmailsList.length === 0 ? (
              <span style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600 }}>None (Access Restricted)</span>
            ) : (
              allowedEmailsList.map((em) => (
                <div key={em} style={{ background: 'var(--bg-card)', padding: '2px 6px', borderRadius: '3px', marginTop: '2px', fontFamily: 'monospace', fontSize: '0.74rem', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                  {em}
                </div>
              ))
            )}
          </div>
        )}

        <div className="mailbox-sidebar-scroll">
          <ul className="mailbox-nav-list">
          <li
            className={`mailbox-nav-item ${activeFolder === 'inbox' && !filterStarred ? 'active' : ''}`}
            onClick={() => {
              setActiveFolder('inbox');
              setFilterStarred(false);
              setSelectedEmailId(null);
              setSelectedEmail(null);
            }}
          >
            <div className="mailbox-nav-left">
              <i className="fa-solid fa-inbox"></i>
              <span>Inbox</span>
            </div>
            {counts.unreadInbox > 0 && (
              <span className="mailbox-badge badge-danger">{counts.unreadInbox}</span>
            )}
          </li>

          <li
            className={`mailbox-nav-item ${filterStarred ? 'active' : ''}`}
            onClick={() => {
              setFilterStarred(true);
              setSelectedEmailId(null);
              setSelectedEmail(null);
            }}
          >
            <div className="mailbox-nav-left">
              <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
              <span>Starred</span>
            </div>
            {counts.starred > 0 && <span className="mailbox-badge">{counts.starred}</span>}
          </li>

          <li
            className={`mailbox-nav-item ${activeFolder === 'sent' && !filterStarred ? 'active' : ''}`}
            onClick={() => {
              setActiveFolder('sent');
              setFilterStarred(false);
              setSelectedEmailId(null);
              setSelectedEmail(null);
            }}
          >
            <div className="mailbox-nav-left">
              <i className="fa-solid fa-paper-plane"></i>
              <span>Sent</span>
            </div>
            {counts.sent > 0 && <span className="mailbox-badge">{counts.sent}</span>}
          </li>

          <li
            className={`mailbox-nav-item ${activeFolder === 'drafts' && !filterStarred ? 'active' : ''}`}
            onClick={() => {
              setActiveFolder('drafts');
              setFilterStarred(false);
              setSelectedEmailId(null);
              setSelectedEmail(null);
            }}
          >
            <div className="mailbox-nav-left">
              <i className="fa-solid fa-file-lines"></i>
              <span>Drafts</span>
            </div>
            {counts.drafts > 0 && <span className="mailbox-badge">{counts.drafts}</span>}
          </li>

          <li
            className={`mailbox-nav-item ${activeFolder === 'archived' && !filterStarred ? 'active' : ''}`}
            onClick={() => {
              setActiveFolder('archived');
              setFilterStarred(false);
              setSelectedEmailId(null);
              setSelectedEmail(null);
            }}
          >
            <div className="mailbox-nav-left">
              <i className="fa-solid fa-box-archive"></i>
              <span>Archived</span>
            </div>
            {counts.archived > 0 && <span className="mailbox-badge">{counts.archived}</span>}
          </li>

          <li
            className={`mailbox-nav-item ${activeFolder === 'spam' && !filterStarred ? 'active' : ''}`}
            onClick={() => {
              setActiveFolder('spam');
              setFilterStarred(false);
              setSelectedEmailId(null);
              setSelectedEmail(null);
            }}
          >
            <div className="mailbox-nav-left">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Spam</span>
            </div>
            {counts.spam > 0 && <span className="mailbox-badge">{counts.spam}</span>}
          </li>

          <li
            className={`mailbox-nav-item ${activeFolder === 'trash' && !filterStarred ? 'active' : ''}`}
            onClick={() => {
              setActiveFolder('trash');
              setFilterStarred(false);
              setSelectedEmailId(null);
              setSelectedEmail(null);
            }}
          >
            <div className="mailbox-nav-left">
              <i className="fa-solid fa-trash-can"></i>
              <span>Trash</span>
            </div>
            {counts.trash > 0 && <span className="mailbox-badge">{counts.trash}</span>}
          </li>
        </ul>

          {/* Quick Filter Checkboxes */}
          <div className="mailbox-filter-box">
            <label>
              <input
                type="checkbox"
                checked={filterUnread}
                onChange={(e) => setFilterUnread(e.target.checked)}
              />
              <span>Unread Only</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={filterHasAttachments}
                onChange={(e) => setFilterHasAttachments(e.target.checked)}
              />
              <span>Has Attachments</span>
            </label>
          </div>
        </div>

        {/* Sidebar Management Shortcuts */}
        <div className="mailbox-sidebar-footer">
          {isSuper && (
            <button className="mailbox-subnav-btn" onClick={() => setIdentitiesModalOpen(true)}>
              <i className="fa-solid fa-id-badge" style={{ color: 'var(--accent-emerald)' }}></i> Sender Identities
            </button>
          )}
          <button className="mailbox-subnav-btn" onClick={() => setTemplatesModalOpen(true)}>
            <i className="fa-solid fa-file-invoice" style={{ color: 'var(--accent-gold)' }}></i> Templates
          </button>
          <button className="mailbox-subnav-btn" onClick={() => setSignaturesModalOpen(true)}>
            <i className="fa-solid fa-signature" style={{ color: '#6366f1' }}></i> Signatures
          </button>
          {isSuper && (
            <button className="mailbox-subnav-btn" onClick={() => setDnsModalOpen(true)}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#0284c7' }}></i> Cloudflare DNS &amp; Resend
            </button>
          )}
        </div>
      </aside>

      {/* ===================================================================
          2. MAIN EMAIL LIST PANEL
          =================================================================== */}
      <section className="mailbox-list-pane">
        {/* Top Toolbar */}
        <div className="mailbox-toolbar">
          <div className="mailbox-toolbar-left">
            <input
              type="checkbox"
              checked={emails.length > 0 && selectedIds.length === emails.length}
              onChange={toggleSelectAll}
              title="Select all on this page"
            />

            <button className="mailbox-action-btn" onClick={loadEmails} title="Refresh emails">
              <i className="fa-solid fa-rotate-right"></i>
            </button>

            {/* Bulk Action Buttons (Visible when items selected) */}
            {selectedIds.length > 0 && (
              <div className="mailbox-toolbar-actions">
                <button
                  className="mailbox-action-btn"
                  onClick={() => handleBulkAction('mark_read')}
                  title="Mark as read"
                >
                  <i className="fa-solid fa-envelope-open"></i>
                </button>
                <button
                  className="mailbox-action-btn"
                  onClick={() => handleBulkAction('mark_unread')}
                  title="Mark as unread"
                >
                  <i className="fa-solid fa-envelope"></i>
                </button>
                <button
                  className="mailbox-action-btn"
                  onClick={() => handleBulkAction('archive')}
                  title="Archive"
                >
                  <i className="fa-solid fa-box-archive"></i>
                </button>
                <button
                  className="mailbox-action-btn"
                  onClick={() => handleBulkAction('spam')}
                  title="Report Spam"
                >
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </button>
                <button
                  className="mailbox-action-btn"
                  onClick={() => handleBulkAction('trash')}
                  title="Move to Trash"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
                {activeFolder === 'trash' && (
                  <button
                    className="mailbox-action-btn"
                    onClick={() => handleBulkAction('restore')}
                    title="Restore to Inbox"
                  >
                    <i className="fa-solid fa-arrow-rotate-left"></i> Restore
                  </button>
                )}
                {(activeFolder === 'trash' || activeFolder === 'spam') && (
                  <button
                    className="mailbox-action-btn"
                    onClick={() => handleBulkAction('delete_permanently')}
                    title="Permanently Delete"
                    style={{ color: 'var(--danger)' }}
                  >
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="mailbox-search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              className="mailbox-search-input"
              placeholder="Search sender, subject, body..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Email Rows List */}
        <div className="mailbox-list-scroll">
          {loadingEmails ? (
            <div style={{ textAlign: 'center', padding: '3.5rem' }}>
              <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-emerald)' }}></i>
              <p style={{ marginTop: '0.85rem', color: 'var(--text-muted)' }}>Loading mailbox messages...</p>
            </div>
          ) : !hasMailboxAccess ? (
            <div className="mailbox-empty-state" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.1)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>
                <i className="fa-solid fa-lock"></i>
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>No Email Access Assigned</h4>
              <p style={{ maxWidth: '380px', margin: '0 auto', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Your administrator account has not been assigned permissions to any official mailbox address (info@idi.lk, support@idi.lk, etc.). Please contact a Super Administrator.
              </p>
            </div>
          ) : emails.length === 0 ? (
            <div className="mailbox-empty-state">
              <i className="fa-solid fa-folder-open"></i>
              <h4>No emails in {activeFolder}</h4>
              <p>Your inbox is peaceful and up to date.</p>
            </div>
          ) : (
            emails.map((email) => {
              const isSelected = selectedIds.includes(email.id);
              const isActive = selectedEmailId === email.id;
              const formattedDate = new Date(email.created_at).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={email.id}
                  className={`mailbox-item-row ${!email.is_read ? 'unread' : ''} ${
                    isActive ? 'selected' : ''
                  }`}
                  onClick={() => openEmail(email)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedIds((prev) =>
                        prev.includes(email.id)
                          ? prev.filter((id) => id !== email.id)
                          : [...prev, email.id]
                      );
                    }}
                  />

                  <i
                    className={`fa-solid fa-star mailbox-item-star ${email.is_starred ? 'active' : ''}`}
                    onClick={(e) => toggleStar(email, e)}
                  ></i>

                  <div className="mailbox-item-sender" title={email.from_address}>
                    {activeFolder === 'sent' || activeFolder === 'drafts'
                      ? `To: ${(email.to_recipients || []).join(', ')}`
                      : email.from_name || email.from_address}
                  </div>

                  <div className="mailbox-item-content">
                    <span className="mailbox-item-subject">{email.subject || '(No Subject)'}</span>
                    <span className="mailbox-item-snippet">— {email.snippet}</span>
                  </div>

                  <div className="mailbox-item-meta">
                    {email.has_attachments && (
                      <i className="fa-solid fa-paperclip" title="Has attachments"></i>
                    )}
                    {email.status && (activeFolder === 'sent' || activeFolder === 'drafts') && (
                      <span className={`mailbox-status-pill status-${email.status}`}>
                        {email.status}
                      </span>
                    )}
                    <span>{formattedDate}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        <div className="mailbox-pagination-footer">
          <span>
            Showing {emails.length} of {totalEmails} messages
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <i className="fa-solid fa-chevron-left"></i> Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. EMAIL READING & THREAD PANE (PANE 3)
          =================================================================== */}
      {selectedEmail && (
        <section className="mailbox-reading-pane">
          {/* Top Actions Bar */}
          <div className="mailbox-reading-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedEmail(null);
                  setSelectedEmailId(null);
                }}
                title="Back to list"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                className="mailbox-action-btn"
                onClick={() => handleBulkAction('archive')}
                title="Archive"
              >
                <i className="fa-solid fa-box-archive"></i>
              </button>
              <button
                className="mailbox-action-btn"
                onClick={() => handleBulkAction('spam')}
                title="Report Spam"
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
              </button>
              <button
                className="mailbox-action-btn"
                onClick={() => handleBulkAction('trash')}
                title="Delete"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
              <button
                className="mailbox-action-btn"
                onClick={() => handleBulkAction('mark_unread')}
                title="Mark unread"
              >
                <i className="fa-solid fa-envelope"></i>
              </button>
              <i
                className={`fa-solid fa-star mailbox-item-star ${selectedEmail.is_starred ? 'active' : ''}`}
                onClick={(e) => toggleStar(selectedEmail, e)}
                style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
              ></i>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleReply('reply', selectedEmail)}
              >
                <i className="fa-solid fa-reply"></i> Reply
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleReply('forward', selectedEmail)}
              >
                <i className="fa-solid fa-share"></i> Forward
              </button>
            </div>
          </div>

          {/* Email Reading Body */}
          <div className="mailbox-reading-body">
            <h2 className="mailbox-reading-title">{selectedEmail.subject || '(No Subject)'}</h2>

            {loadingThread ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-emerald)' }}></i>
              </div>
            ) : (
              threadMessages.map((msg, index) => {
                const isExpanded = expandedHeaders[msg.id] ?? true;
                const senderInitial = (msg.from_name || msg.from_address || 'A')[0].toUpperCase();

                return (
                  <div key={msg.id || index} className="mailbox-message-card">
                    {/* Message Header */}
                    <div
                      className="mailbox-message-header"
                      onClick={() =>
                        setExpandedHeaders((prev) => ({
                          ...prev,
                          [msg.id]: !prev[msg.id],
                        }))
                      }
                    >
                      <div className="mailbox-message-sender-info">
                        <div className="mailbox-avatar">{senderInitial}</div>
                        <div>
                          <div className="mailbox-sender-name">
                            {msg.from_name || msg.from_address}{' '}
                            <span className="mailbox-sender-email">&lt;{msg.from_address}&gt;</span>
                          </div>
                          <div className="mailbox-recipient-line">
                            To: {(msg.to_recipients || []).join(', ')}
                            {msg.cc_recipients && msg.cc_recipients.length > 0 && (
                              <span> | CC: {msg.cc_recipients.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {msg.status && (
                          <span className={`mailbox-status-pill status-${msg.status}`}>
                            {msg.status}
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Message Content (Sanitized HTML or Plain Text) */}
                    {isExpanded && (
                      <>
                        <div
                          className="mailbox-message-content"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeEmailHtml(msg.body_html || msg.body_text || ''),
                          }}
                        />

                        {/* Attachments Section */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mailbox-attachments-container">
                            <div className="mailbox-attachments-title">
                              <i className="fa-solid fa-paperclip"></i> Attachments ({msg.attachments.length})
                            </div>
                            <div className="mailbox-attachment-chips">
                              {msg.attachments.map((att, attIdx) => (
                                <a
                                  key={att.id || attIdx}
                                  href={`/api/admin/mailbox/upload?file=${encodeURIComponent(
                                    att.storage_path || att.filename
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mailbox-attachment-chip"
                                  download={att.filename}
                                >
                                  <i className="fa-solid fa-file-lines" style={{ color: 'var(--accent-emerald)' }}></i>
                                  <span>{att.filename}</span>
                                  {att.file_size ? (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                      ({Math.round(att.file_size / 1024)} KB)
                                    </span>
                                  ) : null}
                                  <i className="fa-solid fa-download" style={{ fontSize: '0.75rem', marginLeft: '4px' }}></i>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Quick Reply Bar */}
          <div className="mailbox-reading-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleReply('reply', selectedEmail)}
            >
              <i className="fa-solid fa-reply"></i> Reply
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleReply('reply_all', selectedEmail)}
            >
              <i className="fa-solid fa-reply-all"></i> Reply All
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleReply('forward', selectedEmail)}
            >
              <i className="fa-solid fa-share"></i> Forward
            </button>
          </div>
        </section>
      )}

      {/* ===================================================================
          4. COMPOSE MODAL (FLOATING RICH TEXT EDITOR)
          =================================================================== */}
      {composeOpen && (
        <div className="modal-overlay active">
          <div className="compose-modal-card">
            <div className="compose-header">
              <h3>
                <i className="fa-solid fa-pen-to-square"></i> New Message
              </h3>
              <div className="compose-header-actions">
                <button onClick={() => setComposeOpen(false)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Warning if no identities are authorized */}
            {identities.length === 0 && (
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', padding: '0.65rem 0.85rem', margin: '0.75rem 1rem 0.25rem', color: '#b91c1c', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>Access Denied: You do not have permission to send emails from any institutional address.</span>
              </div>
            )}

            {/* Recipient & Identity Fields */}
            <div className="compose-fields">
              <div className="compose-field-row">
                <span className="compose-field-label">From:</span>
                <select
                  className="compose-field-select"
                  value={composeFrom}
                  disabled={identities.length === 0}
                  onChange={(e) => {
                    setComposeFrom(e.target.value);
                    const idObj = identities.find((i) => i.email === e.target.value);
                    if (idObj) setComposeFromName(idObj.display_name);
                  }}
                >
                  {identities.length === 0 ? (
                    <option value="">No authorized sender addresses available</option>
                  ) : (
                    identities.map((id) => (
                      <option key={id.id} value={id.email}>
                        {id.display_name} &lt;{id.email}&gt;
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="compose-field-row">
                <span className="compose-field-label">To:</span>
                <input
                  type="text"
                  className="compose-field-input"
                  placeholder="recipient@example.com (comma separated)"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {!showCc && (
                    <button
                      type="button"
                      className="btn-light btn-sm"
                      onClick={() => setShowCc(true)}
                    >
                      Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      type="button"
                      className="btn-light btn-sm"
                      onClick={() => setShowBcc(true)}
                    >
                      Bcc
                    </button>
                  )}
                </div>
              </div>

              {showCc && (
                <div className="compose-field-row">
                  <span className="compose-field-label">Cc:</span>
                  <input
                    type="text"
                    className="compose-field-input"
                    placeholder="cc@example.com"
                    value={composeCc}
                    onChange={(e) => setComposeCc(e.target.value)}
                  />
                </div>
              )}

              {showBcc && (
                <div className="compose-field-row">
                  <span className="compose-field-label">Bcc:</span>
                  <input
                    type="text"
                    className="compose-field-input"
                    placeholder="bcc@example.com"
                    value={composeBcc}
                    onChange={(e) => setComposeBcc(e.target.value)}
                  />
                </div>
              )}

              <div className="compose-field-row">
                <span className="compose-field-label">Subject:</span>
                <input
                  type="text"
                  className="compose-field-input"
                  placeholder="Email Subject"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                />
              </div>

              {/* Template Selection Dropdown */}
              {templates.length > 0 && (
                <div className="compose-field-row">
                  <span className="compose-field-label">Template:</span>
                  <select
                    className="compose-field-select"
                    onChange={(e) => {
                      const tmpl = templates.find((t) => t.id === e.target.value);
                      if (tmpl) insertTemplate(tmpl);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Insert reusable template...
                    </option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Rich Editor Toolbar */}
            <div className="compose-toolbar">
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('bold')}
                title="Bold"
              >
                <i className="fa-solid fa-bold"></i>
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('italic')}
                title="Italic"
              >
                <i className="fa-solid fa-italic"></i>
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('underline')}
                title="Underline"
              >
                <i className="fa-solid fa-underline"></i>
              </button>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('insertUnorderedList')}
                title="Bullet List"
              >
                <i className="fa-solid fa-list-ul"></i>
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('insertOrderedList')}
                title="Numbered List"
              >
                <i className="fa-solid fa-list-ol"></i>
              </button>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('justifyLeft')}
                title="Align Left"
              >
                <i className="fa-solid fa-align-left"></i>
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('justifyCenter')}
                title="Align Center"
              >
                <i className="fa-solid fa-align-center"></i>
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => execEditorCmd('justifyRight')}
                title="Align Right"
              >
                <i className="fa-solid fa-align-right"></i>
              </button>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <button
                type="button"
                className="editor-btn"
                onClick={() => {
                  const url = prompt('Enter link URL:');
                  if (url) execEditorCmd('createLink', url);
                }}
                title="Insert Link"
              >
                <i className="fa-solid fa-link"></i>
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => {
                  const sig = signatures.find((s) => s.is_default) || signatures[0];
                  if (sig && editorRef.current) {
                    editorRef.current.innerHTML += `<br/><br/>${sig.html_content}`;
                  }
                }}
                title="Insert Signature"
              >
                <i className="fa-solid fa-signature"></i>
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => setIsPlainTextMode(!isPlainTextMode)}
                title="Toggle Plain Text / HTML"
                style={{ marginLeft: 'auto' }}
              >
                <i className="fa-solid fa-code"></i> {isPlainTextMode ? 'Rich Editor' : 'Plain Text'}
              </button>
            </div>

            {/* Editable Area */}
            {isPlainTextMode ? (
              <textarea
                className="compose-editor-area form-textarea"
                value={composePlainText}
                onChange={(e) => setComposePlainText(e.target.value)}
                placeholder="Type your plain text email message here..."
              />
            ) : (
              <div
                ref={editorRef}
                className="compose-editor-area"
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: composeHtml }}
                onInput={() => {
                  if (editorRef.current) {
                    setComposeHtml(editorRef.current.innerHTML);
                  }
                }}
                data-placeholder="Compose your email here..."
              />
            )}

            {/* Attached Files List */}
            {composeAttachments.length > 0 && (
              <div className="compose-attachments-list">
                {composeAttachments.map((att, i) => (
                  <div key={i} className="compose-attachment-item">
                    <i className="fa-solid fa-paperclip" style={{ color: 'var(--accent-emerald)' }}></i>
                    <span>{att.filename}</span>
                    <i
                      className="fa-solid fa-xmark remove-att"
                      onClick={() => removeAttachment(i)}
                      title="Remove file"
                    ></i>
                  </div>
                ))}
              </div>
            )}

            {/* Compose Footer Controls */}
            <div className="compose-footer">
              <div className="compose-footer-left">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSendOrDraft(false)}
                  disabled={sendingEmail || identities.length === 0 || !composeFrom}
                >
                  {sendingEmail ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i> Send
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSendOrDraft(true)}
                  disabled={sendingEmail || identities.length === 0 || !composeFrom}
                >
                  <i className="fa-solid fa-floppy-disk"></i> Save Draft
                </button>

                {/* File Attachment Trigger */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  className="mailbox-action-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach files"
                  disabled={uploadingAttachment}
                >
                  <i className="fa-solid fa-paperclip"></i>
                  {uploadingAttachment && ' Uploading...'}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="mailbox-action-btn"
                  onClick={() => {
                    if (confirm('Discard this draft?')) {
                      setComposeOpen(false);
                    }
                  }}
                  title="Discard draft"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          5. CLOUDFLARE DNS & RESEND CONFIGURATION HELPER MODAL
          =================================================================== */}
      {dnsModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-card modal-lg">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#0284c7' }}></i> Cloudflare DNS &amp; Resend Configuration
              </h3>
              <button className="modal-close-btn" onClick={() => setDnsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="alert alert-success">
                <i className="fa-solid fa-circle-check"></i>
                <span>
                  Resend integration is active. Configure the records below in your Cloudflare DNS zone for full domain verification.
                </span>
              </div>

              <h4 style={{ margin: '1rem 0 0.5rem', color: 'var(--text-primary)' }}>1. Sending Domain Verification (Cloudflare DNS)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Add these records in your Cloudflare dashboard under <strong>DNS &gt; Records</strong>:
              </p>

              <table className="admin-table" style={{ fontSize: '0.85rem', width: '100%', marginBottom: '1.5rem' }}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Value / Content</th>
                    <th>TTL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>TXT</strong> (SPF)</td>
                    <td><code>@</code></td>
                    <td><code>v=spf1 include:resend.com ~all</code></td>
                    <td>Auto / DNS only</td>
                  </tr>
                  <tr>
                    <td><strong>CNAME</strong> (DKIM)</td>
                    <td><code>resend._domainkey</code></td>
                    <td><code>dkim.resend.com</code></td>
                    <td>DNS only (Grey Cloud)</td>
                  </tr>
                  <tr>
                    <td><strong>TXT</strong> (DMARC)</td>
                    <td><code>_dmarc</code></td>
                    <td><code>v=DMARC1; p=none;</code></td>
                    <td>Auto</td>
                  </tr>
                  <tr>
                    <td><strong>MX</strong> (Inbound)</td>
                    <td><code>@</code></td>
                    <td><code>feedback-smtp.resend.com</code> (Priority: 10)</td>
                    <td>DNS only</td>
                  </tr>
                </tbody>
              </table>

              <h4 style={{ margin: '1rem 0 0.5rem', color: 'var(--text-primary)' }}>2. Resend Webhook Integration Endpoints</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Configure these webhook URLs in your Resend Dashboard (<strong>Webhooks &gt; Add Webhook</strong>):
              </p>

              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <strong>Inbound Receiving Webhook:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <code style={{ flex: 1, padding: '0.35rem 0.65rem', background: 'white', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      https://idi.lk/api/webhooks/resend/inbound
                    </code>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        navigator.clipboard.writeText('https://idi.lk/api/webhooks/resend/inbound');
                        showToast('Copied Inbound URL');
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Delivery Status Webhook (Sent, Delivered, Bounced, Failed):</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <code style={{ flex: 1, padding: '0.35rem 0.65rem', background: 'white', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      https://idi.lk/api/webhooks/resend/delivery
                    </code>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        navigator.clipboard.writeText('https://idi.lk/api/webhooks/resend/delivery');
                        showToast('Copied Delivery URL');
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setDnsModalOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          6. SENDER IDENTITIES MODAL
          =================================================================== */}
      {identitiesModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-id-badge" style={{ color: 'var(--accent-emerald)' }}></i> Sender Identities
              </h3>
              <button className="modal-close-btn" onClick={() => setIdentitiesModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Sender addresses authorized to compose and dispatch emails on your custom domain.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                {identities.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.display_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.is_default ? (
                        <span className="role-pill role-admin">Default</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
                          title="Set as Default Identity"
                          onClick={async () => {
                            const res = await authFetch('/api/admin/mailbox/identities', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...item, is_default: true }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              showToast(`Set ${item.email} as default`);
                              setIdentities((prev) =>
                                prev.map((i) => ({ ...i, is_default: i.id === item.id }))
                              );
                            }
                          }}
                        >
                          Make Default
                        </button>
                      )}
                      <span className="mailbox-status-pill status-delivered">Verified</span>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.55rem', marginLeft: '0.25rem' }}
                        title="Delete Identity"
                        onClick={async () => {
                          if (!confirm(`Are you sure you want to remove identity "${item.email}"?`)) return;
                          const res = await authFetch(`/api/admin/mailbox/identities?id=${item.id}`, { method: 'DELETE' });
                          const data = await res.json();
                          if (data.success) {
                            showToast(`Identity "${item.email}" removed`);
                            setIdentities((prev) => prev.filter((i) => i.id !== item.id));
                          }
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}

                {identities.length === 0 && (
                  <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-id-badge" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'block', opacity: 0.5 }}></i>
                    No sender identities configured yet. Add your domain sender address below.
                  </div>
                )}
              </div>

              {/* Add New Identity */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editIdentityData.email || !editIdentityData.display_name) return;
                  const res = await authFetch('/api/admin/mailbox/identities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editIdentityData),
                  });
                  const data = await res.json();
                  if (data.success) {
                    showToast('Sender identity saved!');
                    setIdentities((prev) => [...prev, data.identity]);
                    setEditIdentityData({ email: '', display_name: '', reply_to: '', is_default: false });
                  }
                }}
              >
                <div className="form-group">
                  <label className="form-label">Email Address:</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. contact@idi.lk"
                    value={editIdentityData.email}
                    onChange={(e) => setEditIdentityData({ ...editIdentityData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Display Name:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. IDI Admissions Desk"
                    value={editIdentityData.display_name}
                    onChange={(e) => setEditIdentityData({ ...editIdentityData, display_name: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-plus"></i> Add Identity
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIdentitiesModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          7. TEMPLATES MODAL
          =================================================================== */}
      {templatesModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-card modal-lg">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-file-invoice" style={{ color: 'var(--accent-gold)' }}></i> Email Templates
              </h3>
              <button className="modal-close-btn" onClick={() => setTemplatesModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    style={{
                      padding: '0.85rem 1rem',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{tmpl.name}</strong>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          await authFetch(`/api/admin/mailbox/templates?id=${tmpl.id}`, { method: 'DELETE' });
                          setTemplates((prev) => prev.filter((t) => t.id !== tmpl.id));
                          showToast('Template removed');
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                      Subject: {tmpl.subject}
                    </p>
                  </div>
                ))}

                {templates.length === 0 && (
                  <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-file-invoice" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'block', opacity: 0.5 }}></i>
                    No email templates configured yet. Create a reusable template below.
                  </div>
                )}
              </div>

              {/* Add New Template Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editTemplateData.name) return;
                  const res = await authFetch('/api/admin/mailbox/templates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editTemplateData),
                  });
                  const data = await res.json();
                  if (data.success) {
                    showToast('Template created!');
                    setTemplates((prev) => [...prev, data.template]);
                    setEditTemplateData({ name: '', subject: '', body_html: '', body_text: '' });
                  }
                }}
              >
                <div className="form-group">
                  <label className="form-label">Template Name:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Official Meeting Confirmation"
                    value={editTemplateData.name}
                    onChange={(e) => setEditTemplateData({ ...editTemplateData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Default Subject:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Subject line"
                    value={editTemplateData.subject}
                    onChange={(e) => setEditTemplateData({ ...editTemplateData, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Body Content (HTML or Plain Text):</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Type template message content..."
                    value={editTemplateData.body_html}
                    onChange={(e) => setEditTemplateData({ ...editTemplateData, body_html: e.target.value, body_text: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-plus"></i> Save Template
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setTemplatesModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          8. SIGNATURES MODAL
          =================================================================== */}
      {signaturesModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-signature" style={{ color: '#6366f1' }}></i> Email Signatures
              </h3>
              <button className="modal-close-btn" onClick={() => setSignaturesModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {signatures.map((sig) => (
                  <div
                    key={sig.id}
                    style={{
                      padding: '0.85rem 1rem',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{sig.name}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {sig.is_default && <span className="role-pill role-admin">Default</span>}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.55rem' }}
                          title="Delete Signature"
                          onClick={async () => {
                            if (!confirm(`Are you sure you want to remove signature "${sig.name}"?`)) return;
                            await authFetch(`/api/admin/mailbox/signatures?id=${sig.id}`, { method: 'DELETE' });
                            setSignatures((prev) => prev.filter((s) => s.id !== sig.id));
                            showToast('Signature removed');
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                    <div
                      style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}
                      dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(sig.html_content) }}
                    />
                  </div>
                ))}

                {signatures.length === 0 && (
                  <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-signature" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'block', opacity: 0.5 }}></i>
                    No custom signatures configured. Add a signature below.
                  </div>
                )}
              </div>

              {/* Add New Signature Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editSignatureData.name || !editSignatureData.full_name) return;
                  const generatedHtml = `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; border-left: 3px solid #006d44; padding-left: 12px; margin-top: 16px;"><p style="margin: 0; font-weight: bold; color: #006d44;">${editSignatureData.full_name}</p><p style="margin: 2px 0; font-size: 13px; color: #666;">${editSignatureData.title || ''} | ${editSignatureData.company}</p><p style="margin: 4px 0 0; font-size: 12px; color: #888;">Phone: ${editSignatureData.phone || ''} | Web: <a href="${editSignatureData.website}" style="color: #006d44; text-decoration: none;">${editSignatureData.website}</a></p></div>`;

                  const res = await authFetch('/api/admin/mailbox/signatures', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...editSignatureData,
                      html_content: generatedHtml,
                    }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    showToast('Signature created!');
                    setSignatures((prev) => [...prev, data.signature]);
                    setEditSignatureData({
                      name: '',
                      full_name: '',
                      title: '',
                      company: "Institute of Da'wa Islamiyya",
                      phone: '',
                      website: 'https://idi.lk',
                      html_content: '',
                      is_default: false,
                    });
                  }
                }}
              >
                <div className="form-group">
                  <label className="form-label">Signature Label:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Principal Signature"
                    value={editSignatureData.name}
                    onChange={(e) => setEditSignatureData({ ...editSignatureData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sheikh M. Abdullah"
                    value={editSignatureData.full_name}
                    onChange={(e) => setEditSignatureData({ ...editSignatureData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Head of Academic Affairs"
                    value={editSignatureData.title}
                    onChange={(e) => setEditSignatureData({ ...editSignatureData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+94 11 234 5678"
                    value={editSignatureData.phone}
                    onChange={(e) => setEditSignatureData({ ...editSignatureData, phone: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-plus"></i> Save Signature
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSignaturesModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          9. CONFIRM DELETION MODAL
          =================================================================== */}
      {confirmDeleteModal && (
        <div className="modal-overlay active">
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--danger)' }}></i> Permanently Delete?
              </h3>
              <button className="modal-close-btn" onClick={() => setConfirmDeleteModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Are you sure you want to permanently delete the selected email(s)? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger-solid" onClick={confirmPermanentDelete}>
                <i className="fa-solid fa-trash"></i> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`alert alert-${t.type === 'warning' ? 'warning' : t.type === 'danger' ? 'danger' : 'success'}`}
            style={{ minWidth: '260px', boxShadow: 'var(--shadow-md)', margin: 0 }}
          >
            <i
              className={`fa-solid ${
                t.type === 'danger'
                  ? 'fa-circle-xmark'
                  : t.type === 'warning'
                  ? 'fa-triangle-exclamation'
                  : 'fa-circle-check'
              }`}
            ></i>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
