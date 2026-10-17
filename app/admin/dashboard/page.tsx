'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IDISupabase } from '../../../lib/supabaseClient';
import MailboxManager from '../../../components/admin/mailbox/MailboxManager';

// Dashboard Navigation Tabs definition
const SYSTEM_TABS = [
  { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
  { id: 'gallery', label: 'Gallery Albums', icon: 'fa-images' },
  { id: 'inquiries', label: 'Contact Inquiries', icon: 'fa-envelope-open-text' },
  { id: 'mailbox', label: 'Mailbox', icon: 'fa-inbox' },
];


export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'gallery' | 'inquiries' | 'mailbox' | 'admins'
  const [unreadMailboxCount, setUnreadMailboxCount] = useState(0);

  // Data States
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderPhotos, setFolderPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Modals state
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newFolderCoverFile, setNewFolderCoverFile] = useState(null);
  const [newFolderCoverPreview, setNewFolderCoverPreview] = useState('');

  const [editFolderModal, setEditFolderModal] = useState(false);
  const [editFolderData, setEditFolderData] = useState({ id: '', name: '', description: '', cover_image_url: '' });
  const [editFolderCoverFile, setEditFolderCoverFile] = useState(null);
  const [editFolderCoverPreview, setEditFolderCoverPreview] = useState('');

  const [editPhotoModal, setEditPhotoModal] = useState(false);
  const [editPhotoData, setEditPhotoData] = useState({ id: '', title: '', description: '' });

  const [inquiryDetailModal, setInquiryDetailModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryStatusVal, setInquiryStatusVal] = useState('new');
  const [inquiryNotesVal, setInquiryNotesVal] = useState('');

  const [addAdminModal, setAddAdminModal] = useState(false);
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminAllowedTabs, setNewAdminAllowedTabs] = useState<string[]>([
    'overview',
    'gallery',
    'inquiries',
    'mailbox',
  ]);
  const [newAdminAllowedEmails, setNewAdminAllowedEmails] = useState<string[]>([]);
  const [availableMailboxEmails, setAvailableMailboxEmails] = useState<Array<{ id?: string; email: string; label: string }>>([]);
  const [loadingMailboxEmails, setLoadingMailboxEmails] = useState(false);
  const [customNewEmailInput, setCustomNewEmailInput] = useState('');
  const [customEditEmailInput, setCustomEditEmailInput] = useState('');

  const [editAdminModal, setEditAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editAdminRole, setEditAdminRole] = useState('admin');
  const [editAdminStatus, setEditAdminStatus] = useState('active');
  const [editAdminAllowedTabs, setEditAdminAllowedTabs] = useState<string[]>([]);
  const [editAdminAllowedEmails, setEditAdminAllowedEmails] = useState<string[]>([]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ message: '', action: null });

  const [configModal, setConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');

  // Password Management
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [isForcedPasswordChange, setIsForcedPasswordChange] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Upload Progress
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');

  const fileInputRef = useRef(null);
  const createCoverInputRef = useRef(null);
  const editCoverInputRef = useRef(null);

  // Authorization helper: Check if active admin is permitted to access a given tab
  const isTabPermitted = useCallback(
    (tabKey: string) => {
      if (isSuperAdmin) return true;
      if (tabKey === 'admins') return false; // Non-super admins never access admins management
      const allowed = (adminProfile as any)?.allowed_tabs || ['overview', 'gallery', 'inquiries', 'mailbox'];
      return allowed.includes(tabKey);
    },
    [isSuperAdmin, adminProfile]
  );

  // 1. Initial Authentication & Authorization Check
  useEffect(() => {
    async function initAuth() {
      try {
        const user = await IDISupabase.getUser();
        if (!user) {
          router.replace('/admin/login');
          return;
        }

        const profile = await IDISupabase.getAdminProfile(user.id);
        if (!profile) {
          await IDISupabase.signOut();
          router.replace('/admin/login');
          return;
        }

        setCurrentUser(user);
        setAdminProfile(profile);
        setIsSuperAdmin(profile.role === 'super_admin');
        if ((profile as any)?.must_change_password) {
          setPasswordModalOpen(true);
          setIsForcedPasswordChange(true);
        }
        setAuthLoading(false);
      } catch (err) {
        console.error('Admin Auth Check Failed:', err);
        router.replace('/admin/login');
      }
    }
    initAuth();
  }, [router]);

  // Ensure active tab is allowed, otherwise redirect to first allowed tab
  useEffect(() => {
    if (!authLoading && adminProfile) {
      if (!isTabPermitted(activeTab)) {
        const firstAllowed = SYSTEM_TABS.find((t) => isTabPermitted(t.id))?.id || 'overview';
        setActiveTab(firstAllowed);
      }
    }
  }, [authLoading, adminProfile, isTabPermitted, activeTab]);

  // 2. Fetch Data
  const loadFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const res: any = await IDISupabase.fetchFolders();
      setFolders(res?.data || []);
    } catch (err) {
      showToast('Error loading albums: ' + err.message, 'danger');
    } finally {
      setLoadingFolders(false);
    }
  }, [showToast]);

  const loadInquiries = useCallback(async () => {
    setLoadingInquiries(true);
    try {
      const res: any = await IDISupabase.fetchContactInquiries();
      setInquiries(res?.data || []);
    } catch (err) {
      showToast('Error loading inquiries: ' + err.message, 'danger');
    } finally {
      setLoadingInquiries(false);
    }
  }, [showToast]);

  const loadAdmins = useCallback(async () => {
    if (!isSuperAdmin) return;
    setLoadingAdmins(true);
    try {
      const res: any = await IDISupabase.fetchAdminUsers();
      setAdminUsers(res?.data || []);
    } catch (err) {
      showToast('Error loading admin accounts: ' + err.message, 'danger');
    } finally {
      setLoadingAdmins(false);
    }
  }, [isSuperAdmin, showToast]);

  const loadMailboxStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/mailbox/stats');
      const data = await res.json();
      if (data.success && data.counts) {
        setUnreadMailboxCount(data.counts.unreadInbox || 0);
      }
    } catch (err) {
      console.warn('Failed to load mailbox stats:', err);
    }
  }, []);

  const loadAvailableMailboxEmails = useCallback(async () => {
    setLoadingMailboxEmails(true);
    try {
      let token = '';
      const session = await IDISupabase.getSession();
      if (session?.access_token) token = session.access_token;

      const res = await fetch('/api/admin/mailbox/identities', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.identities)) {
        const items = data.identities.map((id: any) => ({
          id: id.id,
          email: id.email.toLowerCase().trim(),
          label: `${id.email}${id.display_name && id.display_name !== id.email ? ` (${id.display_name})` : ''}`,
        }));
        setAvailableMailboxEmails(items);
      }
    } catch (err) {
      console.warn('Failed to load mailbox identities:', err);
    } finally {
      setLoadingMailboxEmails(false);
    }
  }, []);

  const handleAddCustomEmail = async (mode: 'new' | 'edit') => {
    const raw = mode === 'new' ? customNewEmailInput : customEditEmailInput;
    const email = raw.trim().toLowerCase();

    if (!email || !email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid email address (e.g. principal@idi.lk)', 'warning');
      return;
    }

    // 1. Add to availableMailboxEmails list immediately
    setAvailableMailboxEmails((prev) => {
      if (prev.some((item) => item.email === email)) return prev;
      return [...prev, { email, label: email }];
    });

    // 2. Automatically select/check for current modal
    if (mode === 'new') {
      setNewAdminAllowedEmails((prev) => Array.from(new Set([...prev, email])));
      setCustomNewEmailInput('');
    } else {
      setEditAdminAllowedEmails((prev) => Array.from(new Set([...prev, email])));
      setCustomEditEmailInput('');
    }

    // 3. Persist to mailbox_identities table in database via API
    try {
      let token = '';
      const session = await IDISupabase.getSession();
      if (session?.access_token) token = session.access_token;

      const res = await fetch('/api/admin/mailbox/identities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email,
          display_name: email.split('@')[0],
          is_default: false,
        }),
      });
      const data = await res.json();
      if (data.success && data.identity?.id) {
        setAvailableMailboxEmails((prev) =>
          prev.map((item) => (item.email === email ? { ...item, id: data.identity.id } : item))
        );
      }
      showToast(`Added ${email} to authorized domain addresses.`);
    } catch {
      showToast(`Added ${email} to permission list.`);
    }
  };

  const handleRemoveCustomEmail = async (emailToRemove: string) => {
    const item = availableMailboxEmails.find((i) => i.email === emailToRemove);

    setNewAdminAllowedEmails((prev) => prev.filter((e) => e !== emailToRemove));
    setEditAdminAllowedEmails((prev) => prev.filter((e) => e !== emailToRemove));
    setAvailableMailboxEmails((prev) => prev.filter((e) => e.email !== emailToRemove));

    const param = item?.id ? `id=${encodeURIComponent(item.id)}` : `email=${encodeURIComponent(emailToRemove)}`;
    try {
      let token = '';
      const session = await IDISupabase.getSession();
      if (session?.access_token) token = session.access_token;
      await fetch(`/api/admin/mailbox/identities?${param}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.warn('Failed to delete identity from backend:', err);
    }
    showToast(`Removed ${emailToRemove} from list.`);
  };

  useEffect(() => {
    if (!authLoading && currentUser) {
      loadFolders();
      loadInquiries();
      loadMailboxStats();
      if (isSuperAdmin) {
        loadAdmins();
        loadAvailableMailboxEmails();
      }
    }
  }, [authLoading, currentUser, isSuperAdmin, loadFolders, loadInquiries, loadAdmins, loadMailboxStats, loadAvailableMailboxEmails]);

  // Load photos when a folder is selected
  const openFolderDetail = async (folder) => {
    setSelectedFolder(folder);
    setLoadingPhotos(true);
    try {
      const res: any = await IDISupabase.fetchPhotosByFolder(folder.id);
      setFolderPhotos(res?.data || []);
    } catch (err) {
      showToast('Error loading photos: ' + err.message, 'danger');
    } finally {
      setLoadingPhotos(false);
    }
  };

  const backToFolders = () => {
    setSelectedFolder(null);
    setFolderPhotos([]);
    loadFolders();
  };

  // 3. Folder Actions
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      let coverUrl = null;
      if (newFolderCoverFile) {
        const uploadRes = await IDISupabase.uploadImageFile(newFolderCoverFile, 'covers');
        coverUrl = uploadRes?.publicUrl || null;
      }

      await IDISupabase.createFolder({ name: newFolderName.trim(), description: newFolderDesc.trim(), cover_image_url: coverUrl });
      showToast('Album created successfully!');
      setCreateFolderModal(false);
      setNewFolderName('');
      setNewFolderDesc('');
      setNewFolderCoverFile(null);
      setNewFolderCoverPreview('');
      loadFolders();
    } catch (err) {
      showToast('Failed to create album: ' + err.message, 'danger');
    }
  };

  const handleEditFolderSubmit = async (e) => {
    e.preventDefault();
    try {
      let coverUrl = editFolderData.cover_image_url;
      if (editFolderCoverFile) {
        const uploadRes = await IDISupabase.uploadImageFile(editFolderCoverFile, 'covers');
        coverUrl = uploadRes?.publicUrl || coverUrl;
      }

      await IDISupabase.updateFolder(editFolderData.id, {
        name: editFolderData.name.trim(),
        description: editFolderData.description.trim(),
        cover_image_url: coverUrl,
      });

      showToast('Album updated successfully!');
      setEditFolderModal(false);
      if (selectedFolder && selectedFolder.id === editFolderData.id) {
        setSelectedFolder({
          ...selectedFolder,
          name: editFolderData.name.trim(),
          description: editFolderData.description.trim(),
          cover_image_url: coverUrl,
        });
      }
      loadFolders();
    } catch (err) {
      showToast('Failed to update album: ' + err.message, 'danger');
    }
  };

  const confirmDeleteFolder = (folder) => {
    setDeleteConfig({
      message: `Are you sure you want to delete the album "${folder.name}" and all its photos? This action cannot be undone.`,
      action: async () => {
        try {
          await IDISupabase.deleteFolder(folder.id);
          showToast(`Album "${folder.name}" deleted.`);
          setDeleteModal(false);
          if (selectedFolder && selectedFolder.id === folder.id) {
            backToFolders();
          } else {
            loadFolders();
          }
        } catch (err) {
          showToast('Failed to delete album: ' + err.message, 'danger');
        }
      },
    });
    setDeleteModal(true);
  };

  // 4. Photo Upload Actions
  const handlePhotoUpload = async (e) => {
    const files: File[] = Array.from((e.target as HTMLInputElement).files || []);
    if (!files.length || !selectedFolder) return;

    const invalidFiles = files.filter(
      (f) => !f.type.includes('webp') && !f.name.toLowerCase().endsWith('.webp')
    );
    if (invalidFiles.length > 0) {
      showToast('All photos must be in WEBP format (.webp)', 'warning');
      return;
    }

    setUploading(true);
    setUploadPercent(0);
    setUploadStatusText(`Uploading 1 of ${files.length} photos...`);

    let completed = 0;
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadStatusText(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
        await IDISupabase.uploadPhoto(file, selectedFolder.id, selectedFolder.name, file.name.replace(/\.[^/.]+$/, ''), '');
        completed++;
        setUploadPercent(Math.round((completed / files.length) * 100));
      } catch (err) {
        console.error('Upload error for file', file.name, err);
        errors.push(file.name);
      }
    }

    setUploading(false);
    if (errors.length > 0) {
      showToast(`Uploaded ${completed} photos. Errors with: ${errors.join(', ')}`, 'warning');
    } else {
      showToast(`Successfully uploaded ${completed} photo(s)!`);
    }

    // Refresh photos
    const res: any = await IDISupabase.fetchPhotosByFolder(selectedFolder.id);
    setFolderPhotos(res?.data || []);
    e.target.value = '';
  };

  const handleEditPhotoSubmit = async (e) => {
    e.preventDefault();
    try {
      await IDISupabase.updatePhoto(editPhotoData.id, { title: editPhotoData.title, description: editPhotoData.description });
      showToast('Photo details updated.');
      setEditPhotoModal(false);
      setFolderPhotos((prev) =>
        prev.map((p) =>
          p.id === editPhotoData.id
            ? { ...p, title: editPhotoData.title, description: editPhotoData.description }
            : p
        )
      );
    } catch (err) {
      showToast('Failed to update photo: ' + err.message, 'danger');
    }
  };

  const confirmDeletePhoto = (photo) => {
    setDeleteConfig({
      message: `Delete photo "${photo.title || 'Untitled'}"?`,
      action: async () => {
        try {
          await IDISupabase.deletePhoto(photo.id, photo.storage_path);
          showToast('Photo deleted.');
          setDeleteModal(false);
          setFolderPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        } catch (err) {
          showToast('Failed to delete photo: ' + err.message, 'danger');
        }
      },
    });
    setDeleteModal(true);
  };

  // 5. Inquiries Actions
  const handleOpenInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryStatusVal(inquiry.status || 'new');
    setInquiryNotesVal(inquiry.admin_notes || '');
    setInquiryDetailModal(true);
  };

  const handleSaveInquiryUpdates = async () => {
    if (!selectedInquiry) return;
    try {
      await IDISupabase.updateInquiryStatus(selectedInquiry.id, inquiryStatusVal, inquiryNotesVal);
      showToast('Inquiry status and notes saved.');
      setInquiryDetailModal(false);
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id
            ? { ...item, status: inquiryStatusVal, admin_notes: inquiryNotesVal }
            : item
        )
      );
    } catch (err) {
      showToast('Failed to update inquiry: ' + err.message, 'danger');
    }
  };

  const confirmDeleteInquiry = (inquiry) => {
    setDeleteConfig({
      message: `Are you sure you want to permanently delete the inquiry from ${inquiry.full_name}?`,
      action: async () => {
        try {
          await IDISupabase.deleteInquiry(inquiry.id);
          showToast('Inquiry deleted.');
          setDeleteModal(false);
          setInquiryDetailModal(false);
          setInquiries((prev) => prev.filter((item) => item.id !== inquiry.id));
        } catch (err) {
          showToast('Failed to delete inquiry: ' + err.message, 'danger');
        }
      },
    });
    setDeleteModal(true);
  };

  const handleExportCSV = () => {
    if (!inquiries.length) {
      showToast('No inquiries to export.', 'warning');
      return;
    }
    const headers = ['Full Name', 'Email', 'Phone', 'City', 'Subject', 'Status', 'Date Received', 'Message', 'Admin Notes'];
    const rows = inquiries.map((i) => [
      `"${(i.full_name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.city || '').replace(/"/g, '""')}"`,
      `"${(i.subject || '').replace(/"/g, '""')}"`,
      `"${i.status || 'new'}"`,
      `"${new Date(i.created_at).toLocaleString()}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${(i.admin_notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IDI_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inquiries CSV exported.');
  };

  // 6. Admin Management Actions
  const openAddAdminModal = () => {
    setNewAdminFullName('');
    setNewAdminEmail('');
    setNewAdminRole('admin');
    setNewAdminPassword('');
    setNewAdminAllowedTabs(['overview', 'gallery', 'inquiries', 'mailbox']);
    setNewAdminAllowedEmails([]);
    setCustomNewEmailInput('');
    loadAvailableMailboxEmails();
    setAddAdminModal(true);
  };

  const openEditAdmin = (admin: any) => {
    setEditingAdmin(admin);
    setEditAdminRole(admin.role || 'admin');
    setEditAdminStatus(admin.status || 'active');
    setEditAdminAllowedTabs(
      Array.isArray(admin.allowed_tabs) && admin.allowed_tabs.length > 0
        ? admin.allowed_tabs
        : ['overview', 'gallery', 'inquiries', 'mailbox']
    );
    const existingEmails = Array.isArray(admin.allowed_emails) ? admin.allowed_emails : [];
    setEditAdminAllowedEmails(existingEmails);
    setCustomEditEmailInput('');
    loadAvailableMailboxEmails();
    // Ensure any previously assigned emails are included in the available options
    setAvailableMailboxEmails((prev) => {
      const merged = [...prev];
      existingEmails.forEach((em: string) => {
        if (em && em !== '*' && !merged.some((m) => m.email === em)) {
          merged.push({ email: em, label: em });
        }
      });
      return merged;
    });
    setEditAdminModal(true);
  };

  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    try {
      const isSuper = newAdminRole === 'super_admin';
      const created: any = await IDISupabase.createAdminUser({
        email: newAdminEmail.trim(),
        full_name: newAdminFullName.trim(),
        role: newAdminRole,
        password: newAdminPassword || undefined,
        allowed_tabs: isSuper ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'] : newAdminAllowedTabs,
        allowed_emails: isSuper ? ['*'] : newAdminAllowedEmails,
      });
      if (created?.generatedPassword) {
        showToast(`Admin account created! Initial password: ${created.generatedPassword}`, 'success');
      } else {
        showToast(`Admin account created for ${newAdminEmail}.`);
      }
      setAddAdminModal(false);
      setNewAdminEmail('');
      setNewAdminFullName('');
      setNewAdminRole('admin');
      setNewAdminPassword('');
      setNewAdminAllowedTabs(['overview', 'gallery', 'inquiries', 'mailbox']);
      setNewAdminAllowedEmails([]);
      setCustomNewEmailInput('');
      loadAdmins();
    } catch (err: any) {
      showToast('Failed to create admin: ' + err.message, 'danger');
    }
  };

  const handleEditAdminSubmit = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;

    try {
      const isSuper = editAdminRole === 'super_admin';
      await IDISupabase.updateAdminUser(editingAdmin.id, {
        full_name: editingAdmin.full_name,
        role: editAdminRole,
        status: editAdminStatus,
        allowed_tabs: isSuper ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'] : editAdminAllowedTabs,
        allowed_emails: isSuper ? ['*'] : editAdminAllowedEmails,
      });
      showToast('Admin account and permissions updated.');
      setEditAdminModal(false);
      loadAdmins();
    } catch (err: any) {
      showToast('Failed to update admin: ' + err.message, 'danger');
    }
  };

  const confirmDeleteAdmin = (admin) => {
    setDeleteConfig({
      message: `Are you sure you want to revoke admin permissions for ${admin.full_name || admin.email}?`,
      action: async () => {
        try {
          await IDISupabase.deleteAdminUser(admin.id);
          showToast(`Admin ${admin.email} removed.`);
          setDeleteModal(false);
          loadAdmins();
        } catch (err) {
          showToast('Failed to remove admin: ' + err.message, 'danger');
        }
      },
    });
    setDeleteModal(true);
  };

  // 7. Supabase Config
  const openConfigModal = () => {
    const cfg = IDISupabase.getConfig();
    setConfigUrl(cfg.url || '');
    setConfigKey(cfg.anonKey || '');
    setConfigModal(true);
  };

  const handleSaveConfig = () => {
    IDISupabase.setConfig(configUrl.trim(), configKey.trim());
    showToast('Supabase settings saved! Reloading data...');
    setConfigModal(false);
    loadFolders();
    loadInquiries();
    if (isSuperAdmin) loadAdmins();
  };

  // 8. Sign Out
  const handleLogout = async () => {
    await IDISupabase.signOut();
    router.replace('/admin/login');
  };

  // 9. Update Password
  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordVal.length < 6) {
      showToast('Password must be at least 6 characters long.', 'danger');
      return;
    }
    if (newPasswordVal !== confirmPasswordVal) {
      showToast('New passwords do not match.', 'danger');
      return;
    }
    setUpdatingPassword(true);
    try {
      const res: any = await IDISupabase.updatePassword(newPasswordVal);
      if (res?.error) {
        showToast('Error updating password: ' + res.error, 'danger');
      } else {
        showToast('Password updated successfully!');
        setPasswordModalOpen(false);
        setIsForcedPasswordChange(false);
        setNewPasswordVal('');
        setConfirmPasswordVal('');
        if (adminProfile) {
          setAdminProfile({ ...adminProfile, must_change_password: false });
        }
      }
    } catch (err: any) {
      showToast('Failed to update password: ' + err.message, 'danger');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Computed / Filtered Lists
  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
    if (!matchStatus) return false;
    if (!inquirySearch.trim()) return true;
    const q = inquirySearch.toLowerCase();
    return (
      (inq.full_name && inq.full_name.toLowerCase().includes(q)) ||
      (inq.email && inq.email.toLowerCase().includes(q)) ||
      (inq.phone && inq.phone.toLowerCase().includes(q)) ||
      (inq.city && inq.city.toLowerCase().includes(q)) ||
      (inq.subject && inq.subject.toLowerCase().includes(q)) ||
      (inq.message && inq.message.toLowerCase().includes(q))
    );
  });

  const totalPhotosCount = folders.reduce((sum, f) => sum + (f.photo_count || 0), 0);
  const newInquiriesCount = inquiries.filter((i) => !i.status || i.status === 'new').length;

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-spinner fa-spin fa-3x" style={{ color: 'var(--accent-emerald)' }}></i>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-portal-wrapper ${activeTab === 'mailbox' ? 'admin-mailbox-view' : ''}`}>
      {/* Top Navbar */}
      <header className="admin-navbar">
        <Link href="/admin/dashboard" className="admin-brand">
          <Image
            src="/assets/images/idi_logo.webp"
            alt="IDI Logo"
            width={40}
            height={40}
            priority
          />
          <div className="admin-brand-text">
            <h2>Institute of Da&apos;wa Islamiyya</h2>
            <span id="nav-portal-title">Admin Management Portal</span>
          </div>
        </Link>

        <div className="admin-nav-actions">
          <Link
            href="/"
            target="_blank"
            className="btn btn-secondary btn-sm"
            title="View Public Website"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Public Website
          </Link>

          <div className="admin-user-badge">
            <div className="admin-user-avatar">
              {(adminProfile?.full_name || currentUser?.email || 'A')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {currentUser?.email}
              </span>
              <span className={`role-pill ${isSuperAdmin ? 'role-super' : 'role-admin'}`}>
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setIsForcedPasswordChange(false);
              setNewPasswordVal('');
              setConfirmPasswordVal('');
              setPasswordModalOpen(true);
            }}
            title="Change Account Password"
            style={{ gap: '0.45rem', fontSize: '0.82rem' }}
          >
            <i className="fa-solid fa-key" style={{ color: 'var(--accent-emerald)' }}></i> Password
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={openConfigModal}
            title="Supabase Database Settings"
          >
            <i className="fa-solid fa-gear"></i>
          </button>

          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      {/* Admin Body Layout: Left Sidebar Navigation + Main Content Area */}
      <div className={`admin-body-layout ${activeTab === 'mailbox' ? 'admin-mailbox-mode' : ''}`}>
        {/* Left Admin Navigation Sidebar */}
        <aside className="admin-sidebar-nav">
          <div className="admin-sidebar-nav-header">
            <span>Navigation</span>
          </div>
          <nav className="admin-sidebar-nav-menu">
            {isTabPermitted('overview') && (
              <button
                className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fa-solid fa-chart-pie"></i>
                <span>Overview</span>
              </button>
            )}
            {isTabPermitted('gallery') && (
              <button
                className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('gallery');
                  if (selectedFolder) setSelectedFolder(null);
                }}
              >
                <i className="fa-solid fa-images"></i>
                <span>Gallery Albums</span>
              </button>
            )}
            {isTabPermitted('inquiries') && (
              <button
                className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setActiveTab('inquiries')}
              >
                <i className="fa-solid fa-envelope-open-text"></i>
                <span>Contact Inquiries</span>
                {newInquiriesCount > 0 && (
                  <span className="tab-badge">{newInquiriesCount}</span>
                )}
              </button>
            )}
            {isTabPermitted('mailbox') && (
              <button
                className={`admin-nav-item ${activeTab === 'mailbox' ? 'active' : ''}`}
                onClick={() => setActiveTab('mailbox')}
              >
                <i className="fa-solid fa-inbox"></i>
                <span>Mailbox</span>
                {unreadMailboxCount > 0 && (
                  <span className="tab-badge">{unreadMailboxCount}</span>
                )}
              </button>
            )}
            {isSuperAdmin && (
              <button
                className={`admin-nav-item super-admin-nav ${activeTab === 'admins' ? 'active' : ''}`}
                onClick={() => setActiveTab('admins')}
              >
                <i className="fa-solid fa-user-shield"></i>
                <span>Admins</span>
                <span className="super-tag">Super</span>
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className={`admin-container ${activeTab === 'mailbox' ? 'admin-container-mailbox' : ''}`}>
        {/* ===================================================================
            SECTION 1: OVERVIEW TAB
            =================================================================== */}
        {activeTab === 'overview' && (
          <section id="tab-section-overview" className="tab-section active">
            {/* Stats Overview Grid */}
            <div className="stats-grid">
              {isTabPermitted('gallery') && (
                <div
                  className="stat-card"
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedFolder(null);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon emerald">
                    <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <div className="stat-details">
                    <h4>Total Albums</h4>
                    <div className="stat-number">{folders.length}</div>
                  </div>
                </div>
              )}

              {isTabPermitted('gallery') && (
                <div
                  className="stat-card"
                  onClick={() => {
                    setActiveTab('gallery');
                    setSelectedFolder(null);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon gold">
                    <i className="fa-solid fa-images"></i>
                  </div>
                  <div className="stat-details">
                    <h4>Total Photos</h4>
                    <div className="stat-number">{totalPhotosCount}</div>
                  </div>
                </div>
              )}

              {isTabPermitted('inquiries') && (
                <div
                  className="stat-card"
                  onClick={() => setActiveTab('inquiries')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon purple">
                    <i className="fa-solid fa-envelope-open-text"></i>
                  </div>
                  <div className="stat-details">
                    <h4>Total Inquiries</h4>
                    <div className="stat-number">{inquiries.length}</div>
                  </div>
                </div>
              )}

              {isTabPermitted('inquiries') && (
                <div
                  className="stat-card"
                  onClick={() => {
                    setInquiryStatusFilter('new');
                    setActiveTab('inquiries');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon orange">
                    <i className="fa-solid fa-bell"></i>
                  </div>
                  <div className="stat-details">
                    <h4>New / Unread</h4>
                    <div className="stat-number">{newInquiriesCount}</div>
                  </div>
                </div>
              )}

              {isTabPermitted('mailbox') && (
                <div
                  className="stat-card"
                  onClick={() => setActiveTab('mailbox')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon emerald">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="stat-details">
                    <h4>Admin Mailbox</h4>
                    <div className="stat-number">{unreadMailboxCount > 0 ? `${unreadMailboxCount} New` : 'Inbox'}</div>
                  </div>
                </div>
              )}

              {isSuperAdmin && (
                <div
                  className="stat-card"
                  onClick={() => setActiveTab('admins')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon navy">
                    <i className="fa-solid fa-users-gear"></i>
                  </div>
                  <div className="stat-details">
                    <h4>Admin Team</h4>
                    <div className="stat-number">{adminUsers.length || '1+'}</div>
                  </div>
                </div>
              )}

              <div className="stat-card" onClick={openConfigModal} style={{ cursor: 'pointer' }}>
                <div className="stat-icon blue">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div className="stat-details">
                  <h4>Database Status</h4>
                  <div className="stat-number" style={{ fontSize: '1.15rem' }}>
                    {IDISupabase.isConfigured() ? 'Connected' : 'Mock Mode'}
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Two Column Layout */}
            <div className="overview-grid">
              {/* Recent Inquiries Panel */}
              <div className="overview-panel">
                <div className="panel-header">
                  <div>
                    <h3>
                      <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-emerald)' }}></i>{' '}
                      Recent Inquiries
                    </h3>
                    <p>Latest submissions from the website contact form</p>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveTab('inquiries')}
                  >
                    View All <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                <div className="panel-body">
                  <div className="overview-list">
                    {inquiries.slice(0, 5).map((inq) => (
                      <div
                        key={inq.id}
                        className="overview-item"
                        onClick={() => handleOpenInquiry(inq)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600 }}>{inq.full_name}</span>
                          <span className={`status-pill status-${inq.status || 'new'}`}>
                            {inq.status || 'new'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                          {inq.subject || 'No subject'}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(inq.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {inquiries.length === 0 && (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No inquiries submitted yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Albums Panel */}
              <div className="overview-panel">
                <div className="panel-header">
                  <div>
                    <h3>
                      <i className="fa-solid fa-images" style={{ color: 'var(--accent-gold)' }}></i>{' '}
                      Gallery Highlights
                    </h3>
                    <p>Recent photo albums and collections</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setCreateFolderModal(true)}
                  >
                    <i className="fa-solid fa-plus"></i> New Album
                  </button>
                </div>
                <div className="panel-body">
                  <div className="overview-list">
                    {folders.slice(0, 5).map((folder) => (
                      <div
                        key={folder.id}
                        className="overview-item"
                        onClick={() => {
                          setActiveTab('gallery');
                          openFolderDetail(folder);
                        }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                      >
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#eee',
                            position: 'relative',
                          }}
                        >
                          <Image
                            src={folder.cover_image_url || '/assets/images/idi_logo.webp'}
                            alt={folder.name}
                            fill
                            sizes="50px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{folder.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {folder.photo_count || 0} Photos
                          </span>
                        </div>
                        <i className="fa-solid fa-chevron-right" style={{ color: 'var(--text-muted)' }}></i>
                      </div>
                    ))}
                    {folders.length === 0 && (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No gallery albums created yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================================
            SECTION 2: GALLERY MANAGEMENT TAB
            =================================================================== */}
        {activeTab === 'gallery' && (
          <section id="tab-section-gallery" className="tab-section active">
            {!selectedFolder ? (
              /* VIEW 1: ALBUM FOLDERS MANAGEMENT */
              <div>
                <div className="admin-section-header">
                  <div>
                    <h2>Gallery Albums</h2>
                    <p>Organize photographs into structured event folders and public galleries</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCreateFolderModal(true)}
                  >
                    <i className="fa-solid fa-plus"></i> Create Folder
                  </button>
                </div>

                {loadingFolders ? (
                  <div className="admin-folders-grid">
                    <div className="skeleton-card"><div className="skeleton-box skeleton-cover"></div></div>
                    <div className="skeleton-card"><div className="skeleton-box skeleton-cover"></div></div>
                  </div>
                ) : (
                  <div className="admin-folders-grid">
                    {folders.map((folder) => (
                      <div key={folder.id} className="admin-folder-card">
                        <div
                          className="folder-cover-wrap"
                          onClick={() => openFolderDetail(folder)}
                          style={{ cursor: 'pointer', position: 'relative', height: '180px' }}
                        >
                          <Image
                            src={folder.cover_image_url || '/assets/images/idi_logo.webp'}
                            alt={folder.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            style={{ objectFit: 'cover' }}
                          />
                          <span className="folder-badge">
                            <i className="fa-solid fa-image"></i> {folder.photo_count || 0}
                          </span>
                        </div>
                        <div className="folder-content">
                          <h3
                            onClick={() => openFolderDetail(folder)}
                            style={{ cursor: 'pointer' }}
                          >
                            {folder.name}
                          </h3>
                          <p>{folder.description || 'No description provided.'}</p>
                          <div className="folder-actions">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => openFolderDetail(folder)}
                            >
                              <i className="fa-solid fa-images"></i> Manage Photos
                            </button>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                  setEditFolderData(folder);
                                  setEditFolderCoverPreview(folder.cover_image_url || '');
                                  setEditFolderModal(true);
                                }}
                                title="Edit Album Details"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => confirmDeleteFolder(folder)}
                                title="Delete Album"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {folders.length === 0 && (
                      <div className="empty-state-box" style={{ gridColumn: '1 / -1' }}>
                        <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', color: 'var(--text-muted)' }}></i>
                        <h3>No Albums Found</h3>
                        <p>Click &quot;Create Folder&quot; above to add your first photo album.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* VIEW 2: ALBUM DETAIL & PHOTOS MANAGEMENT */
              <div>
                <div className="admin-section-header">
                  <div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={backToFolders}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      <i className="fa-solid fa-arrow-left"></i> Back to Albums
                    </button>
                    <h2>{selectedFolder.name}</h2>
                    <p>{selectedFolder.description || 'No description'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditFolderData(selectedFolder);
                        setEditFolderCoverPreview(selectedFolder.cover_image_url || '');
                        setEditFolderModal(true);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit Info
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => confirmDeleteFolder(selectedFolder)}
                    >
                      <i className="fa-solid fa-trash-can"></i> Delete Album
                    </button>
                  </div>
                </div>

                {/* Upload Photos Dropzone */}
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/webp,.webp"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <h3>Click or Drag &amp; Drop Photos Here</h3>
                  <p>Upload multiple photographs in <strong>WEBP format (.webp)</strong> only</p>
                </div>

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="upload-progress-wrap" style={{ display: 'block', margin: '1.5rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span>
                        <i className="fa-solid fa-spinner fa-spin"></i> {uploadStatusText}
                      </span>
                      <span>{uploadPercent}%</span>
                    </div>
                    <div className="progress-bar-outer" style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
                      <div
                        className="progress-bar-inner"
                        style={{
                          width: `${uploadPercent}%`,
                          background: 'var(--accent-emerald)',
                          height: '100%',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Photos Section Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.5rem 0 1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: 0 }}>
                    Photos in this Album
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {folderPhotos.length} Photos
                  </span>
                </div>

                {/* Photos Grid */}
                {loadingPhotos ? (
                  <p style={{ textAlign: 'center', padding: '2rem' }}>
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading photos...
                  </p>
                ) : (
                  <div className="admin-photos-grid">
                    {folderPhotos.map((photo) => (
                      <div key={photo.id} className="admin-photo-card">
                        <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                          <Image
                            src={photo.image_url}
                            alt={photo.title || 'Photo'}
                            fill
                            sizes="(max-width: 768px) 100vw, 250px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="photo-info" style={{ padding: '0.75rem' }}>
                          <h4 style={{ fontSize: '0.85rem', margin: '0 0 0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {photo.title || 'Untitled'}
                          </h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditPhotoData({
                                  id: photo.id,
                                  title: photo.title || '',
                                  description: photo.description || '',
                                });
                                setEditPhotoModal(true);
                              }}
                            >
                              <i className="fa-solid fa-pen"></i> Caption
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => confirmDeletePhoto(photo)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {folderPhotos.length === 0 && (
                      <div className="empty-state-box" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
                        <i className="fa-regular fa-image" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}></i>
                        <h3>No Photos Yet</h3>
                        <p>Drag and drop WEBP files or click the upload area above to populate this album.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ===================================================================
            SECTION 3: CONTACT FORM INQUIRIES TAB
            =================================================================== */}
        {activeTab === 'inquiries' && (
          <section id="tab-section-inquiries" className="tab-section active">
            <div className="admin-section-header">
              <div>
                <h2>Contact Form Inquiries</h2>
                <p>Review, respond to, and manage inquiries submitted by prospective students and visitors</p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleExportCSV}
                  title="Export inquiries as CSV"
                >
                  <i className="fa-solid fa-file-csv"></i> Export CSV
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={loadInquiries}
                  title="Refresh Inquiries"
                >
                  <i className="fa-solid fa-arrows-rotate"></i> Refresh
                </button>
              </div>
            </div>

            {/* Inquiries Toolbar */}
            <div className="inquiries-toolbar">
              <div className="search-box-wrap" style={{ position: 'relative', flex: 1 }}>
                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                  placeholder="Search by name, email, phone, city, or message..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                />
                {inquirySearch && (
                  <button
                    className="search-clear-btn"
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                    onClick={() => setInquirySearch('')}
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="filter-pills-wrap">
                {['all', 'new', 'in_progress', 'resolved', 'archived'].map((status) => {
                  const count = status === 'all'
                    ? inquiries.length
                    : inquiries.filter((i) => (i.status || 'new') === status).length;
                  return (
                    <button
                      key={status}
                      className={`filter-pill ${inquiryStatusFilter === status ? 'active' : ''}`}
                      onClick={() => setInquiryStatusFilter(status)}
                    >
                      {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}{' '}
                      ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="inquiries-container">
              {loadingInquiries ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--accent-emerald)' }}></i>
                  <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Loading inquiries...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Sender</th>
                        <th>Contact Info</th>
                        <th>City</th>
                        <th>Subject &amp; Message</th>
                        <th>Status</th>
                        <th>Received</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map((inq) => (
                        <tr key={inq.id}>
                          <td>
                            <strong>{inq.full_name}</strong>
                          </td>
                          <td>
                            <div>{inq.email}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{inq.phone || 'No phone'}</small>
                          </td>
                          <td>{inq.city || '—'}</td>
                          <td style={{ maxWidth: '280px' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{inq.subject}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {inq.message}
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill status-${inq.status || 'new'}`}>
                              {inq.status || 'new'}
                            </span>
                          </td>
                          <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleOpenInquiry(inq)}
                            >
                              <i className="fa-solid fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredInquiries.length === 0 && !loadingInquiries && (
                <div className="empty-state-box">
                  <i className="fa-regular fa-envelope-open" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}></i>
                  <h3>No inquiries found</h3>
                  <p>There are no inquiries matching your current filter criteria.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ===================================================================
            SECTION 3.5: MAILBOX TAB
            =================================================================== */}
        {activeTab === 'mailbox' && (
          <section id="tab-section-mailbox" className="tab-section active">
            <div className="admin-section-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h2>
                  <i className="fa-solid fa-inbox" style={{ color: 'var(--accent-emerald)' }}></i> Official Admin Mailbox
                </h2>
                <p>Send, receive, compose, and organize custom domain emails with Resend</p>
              </div>
            </div>
            <MailboxManager adminProfile={adminProfile} isSuperAdmin={isSuperAdmin} />
          </section>
        )}

        {/* ===================================================================
            SECTION 4: ADMIN USERS TAB (Super Admin)
            =================================================================== */}
        {activeTab === 'admins' && (
          <section id="tab-section-admins" className="tab-section active">
            {!isSuperAdmin ? (
              <div className="empty-state-box" style={{ padding: '4rem 2rem' }}>
                <div className="lock-icon-wrap" style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(184, 134, 11, 0.1)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem' }}>
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h2>Super Admin Access Required</h2>
                <p style={{ maxWidth: '500px', margin: '0.5rem auto 1.5rem', color: 'var(--text-muted)' }}>
                  Only Super Administrators have permissions to view, create, edit, or remove administrator accounts.
                </p>
                <button className="btn btn-primary" onClick={() => setActiveTab('overview')}>
                  <i className="fa-solid fa-chart-pie"></i> Return to Overview
                </button>
              </div>
            ) : (
              <div>
                <div className="admin-section-header">
                  <div>
                    <h2>Administrator Accounts</h2>
                    <p>Manage system administrators, assign roles, and control administrative access</p>
                  </div>
                  <button className="btn btn-primary" onClick={openAddAdminModal}>
                    <i className="fa-solid fa-user-plus"></i> Add New Admin
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Administrator</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Allowed Tabs</th>
                        <th>Email Access</th>
                        <th>Status</th>
                        <th>Added Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((admin) => (
                        <tr key={admin.id}>
                          <td><strong>{admin.full_name || '—'}</strong></td>
                          <td>{admin.email}</td>
                          <td>
                            <span className={`role-pill ${admin.role === 'super_admin' ? 'role-super' : 'role-admin'}`}>
                              {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </span>
                          </td>
                          <td>
                            {admin.role === 'super_admin' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: 'rgba(0,109,68,0.1)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                                <i className="fa-solid fa-shield-halved"></i> All Tabs
                              </span>
                            ) : (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '220px' }}>
                                {(admin.allowed_tabs && admin.allowed_tabs.length > 0
                                  ? admin.allowed_tabs
                                  : ['overview', 'gallery', 'inquiries', 'mailbox']
                                ).map((t) => (
                                  <span
                                    key={t}
                                    style={{
                                      fontSize: '0.72rem',
                                      padding: '2px 7px',
                                      borderRadius: '4px',
                                      background: 'var(--bg-main)',
                                      border: '1px solid var(--border-color)',
                                      color: 'var(--text-secondary)',
                                      textTransform: 'capitalize',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                    }}
                                  >
                                    <i
                                      className={`fa-solid ${
                                        t === 'overview'
                                          ? 'fa-chart-pie'
                                          : t === 'gallery'
                                          ? 'fa-images'
                                          : t === 'inquiries'
                                          ? 'fa-envelope-open-text'
                                          : t === 'mailbox'
                                          ? 'fa-inbox'
                                          : 'fa-table-columns'
                                      }`}
                                      style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)' }}
                                    ></i>
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>
                            {admin.role === 'super_admin' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: 'rgba(217,119,6,0.1)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                                <i className="fa-solid fa-at"></i> All Emails (*)
                              </span>
                            ) : admin.allowed_emails && admin.allowed_emails.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                                {admin.allowed_emails.map((em) => (
                                  <span
                                    key={em}
                                    style={{
                                      fontSize: '0.72rem',
                                      padding: '2px 7px',
                                      borderRadius: '4px',
                                      background: 'rgba(59, 130, 246, 0.08)',
                                      border: '1px solid rgba(59, 130, 246, 0.25)',
                                      color: '#1d4ed8',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                    }}
                                  >
                                    <i className="fa-solid fa-envelope" style={{ fontSize: '0.65rem' }}></i>
                                    {em}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                No Email Access
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`status-pill status-${admin.status === 'suspended' ? 'archived' : 'resolved'}`}>
                              {admin.status || 'active'}
                            </span>
                          </td>
                          <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => openEditAdmin(admin)}
                                title="Edit Admin & Permissions"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              {admin.id !== currentUser?.id && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => confirmDeleteAdmin(admin)}
                                  title="Revoke Admin Access"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {adminUsers.length === 0 && !loadingAdmins && (
                  <div className="empty-state-box">
                    <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}></i>
                    <h3>No administrators listed</h3>
                    <p>Click &quot;Add New Admin&quot; to authorize an administrator account.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
      </div> {/* end admin-body-layout */}

      {/* =======================================================================
          MODALS
          ======================================================================= */}

      {/* 1. CREATE FOLDER MODAL */}
      {createFolderModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-folder-plus" style={{ color: 'var(--accent-emerald)' }}></i>{' '}
                Create New Album
              </h3>
              <button className="modal-close-btn" onClick={() => setCreateFolderModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="create-folder-name" className="form-label">Album Name *</label>
                  <input
                    type="text"
                    id="create-folder-name"
                    className="form-input"
                    placeholder="e.g. Annual Day 2026"
                    required
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="create-folder-desc" className="form-label">Description (Optional)</label>
                  <textarea
                    id="create-folder-desc"
                    className="form-textarea"
                    placeholder="Brief description of the event or photo collection..."
                    value={newFolderDesc}
                    onChange={(e) => setNewFolderDesc(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Image (Optional)</label>
                  <input
                    type="file"
                    ref={createCoverInputRef}
                    accept="image/webp,.webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewFolderCoverFile(file);
                        setNewFolderCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {!newFolderCoverPreview ? (
                    <div
                      className="upload-dropzone"
                      style={{ padding: '1.5rem', cursor: 'pointer' }}
                      onClick={() => createCoverInputRef.current?.click()}
                    >
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <p style={{ margin: 0 }}>Click to select a WEBP cover image</p>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', height: '150px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <Image
                        src={newFolderCoverPreview}
                        alt="Preview"
                        fill
                        sizes="400px"
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                        onClick={() => {
                          setNewFolderCoverFile(null);
                          setNewFolderCoverPreview('');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCreateFolderModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Create Album</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT FOLDER MODAL */}
      {editFolderModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--accent-emerald)' }}></i>{' '}
                Edit Album Details
              </h3>
              <button className="modal-close-btn" onClick={() => setEditFolderModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditFolderSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="edit-folder-name" className="form-label">Album Name *</label>
                  <input
                    type="text"
                    id="edit-folder-name"
                    className="form-input"
                    required
                    value={editFolderData.name}
                    onChange={(e) => setEditFolderData({ ...editFolderData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-folder-desc" className="form-label">Description</label>
                  <textarea
                    id="edit-folder-desc"
                    className="form-textarea"
                    value={editFolderData.description}
                    onChange={(e) => setEditFolderData({ ...editFolderData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Image</label>
                  <input
                    type="file"
                    ref={editCoverInputRef}
                    accept="image/webp,.webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditFolderCoverFile(file);
                        setEditFolderCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {editFolderCoverPreview ? (
                    <div style={{ position: 'relative', height: '150px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <Image
                        src={editFolderCoverPreview}
                        alt="Cover"
                        fill
                        sizes="400px"
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                        onClick={() => editCoverInputRef.current?.click()}
                      >
                        Change Cover
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-dropzone"
                      style={{ padding: '1.5rem', cursor: 'pointer' }}
                      onClick={() => editCoverInputRef.current?.click()}
                    >
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <p style={{ margin: 0 }}>Click to upload a WEBP cover image</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditFolderModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT PHOTO MODAL */}
      {editPhotoModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-image" style={{ color: 'var(--accent-emerald)' }}></i> Edit Photo Information
              </h3>
              <button className="modal-close-btn" onClick={() => setEditPhotoModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditPhotoSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="edit-photo-title" className="form-label">Photo Title / Caption</label>
                  <input
                    type="text"
                    id="edit-photo-title"
                    className="form-input"
                    required
                    value={editPhotoData.title}
                    onChange={(e) => setEditPhotoData({ ...editPhotoData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-photo-desc" className="form-label">Description (Optional)</label>
                  <textarea
                    id="edit-photo-desc"
                    className="form-textarea"
                    value={editPhotoData.description}
                    onChange={(e) => setEditPhotoData({ ...editPhotoData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditPhotoModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. INQUIRY DETAIL MODAL */}
      {inquiryDetailModal && selectedInquiry && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card modal-lg">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-envelope-open-text" style={{ color: 'var(--accent-emerald)' }}></i> Inquiry Details
              </h3>
              <button className="modal-close-btn" onClick={() => setInquiryDetailModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="inquiry-modal-sender-box">
                <div className="sender-avatar">
                  {(selectedInquiry.full_name || 'U')[0].toUpperCase()}
                </div>
                <div className="sender-details">
                  <h4>{selectedInquiry.full_name}</h4>
                  <div className="sender-meta">
                    <span>
                      <i className="fa-solid fa-location-dot"></i> {selectedInquiry.city || 'No city provided'}
                    </span>
                    <span>
                      <i className="fa-regular fa-clock"></i> {new Date(selectedInquiry.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="sender-actions">
                  {selectedInquiry.phone && (
                    <a href={`tel:${selectedInquiry.phone}`} className="btn btn-sm btn-secondary">
                      <i className="fa-solid fa-phone" style={{ color: 'var(--accent-emerald)' }}></i> Call
                    </a>
                  )}
                  {selectedInquiry.email && (
                    <a href={`mailto:${selectedInquiry.email}`} className="btn btn-sm btn-secondary">
                      <i className="fa-solid fa-envelope" style={{ color: '#2563eb' }}></i> Email
                    </a>
                  )}
                  {selectedInquiry.phone && (
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-secondary"
                    >
                      <i className="fa-brands fa-whatsapp" style={{ color: '#16a34a' }}></i> WhatsApp
                    </a>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Subject</label>
                <div className="inquiry-detail-text subject-highlight">{selectedInquiry.subject}</div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Message</label>
                <div className="inquiry-detail-text message-box">{selectedInquiry.message}</div>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label htmlFor="inquiry-status-sel" className="form-label">Inquiry Status</label>
                  <select
                    id="inquiry-status-sel"
                    className="form-input"
                    value={inquiryStatusVal}
                    onChange={(e) => setInquiryStatusVal(e.target.value)}
                  >
                    <option value="new">🟢 New</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="resolved">🔵 Resolved</option>
                    <option value="archived">⚪ Archived</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="inquiry-notes-input" className="form-label">Internal Admin Notes</label>
                  <textarea
                    id="inquiry-notes-input"
                    className="form-textarea"
                    placeholder="Add private notes, follow-up history, or staff assignments..."
                    value={inquiryNotesVal}
                    onChange={(e) => setInquiryNotesVal(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div>
                {isSuperAdmin && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmDeleteInquiry(selectedInquiry)}
                  >
                    <i className="fa-solid fa-trash-can"></i> Delete Inquiry
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setInquiryDetailModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveInquiryUpdates}>
                  Save Status &amp; Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD ADMIN MODAL */}
      {addAdminModal && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-user-plus" style={{ color: 'var(--accent-emerald)' }}></i> Add New Administrator
              </h3>
              <button className="modal-close-btn" onClick={() => setAddAdminModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateAdminSubmit} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
              <div className="modal-body" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
                <div className="form-group">
                  <label htmlFor="new-admin-name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="new-admin-name"
                    className="form-input"
                    placeholder="e.g. Usthadh Abdullah"
                    value={newAdminFullName}
                    onChange={(e) => setNewAdminFullName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-admin-email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="new-admin-email"
                    className="form-input"
                    placeholder="staff@idi.lk"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Administrative Role *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <div
                      onClick={() => setNewAdminRole('admin')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: newAdminRole === 'admin' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                        background: newAdminRole === 'admin' ? 'rgba(0,109,68,0.06)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="new-admin-role-radio"
                        id="new-role-admin"
                        checked={newAdminRole === 'admin'}
                        onChange={() => setNewAdminRole('admin')}
                        style={{ marginTop: '0.2rem', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-user-gear" style={{ color: 'var(--accent-emerald)' }}></i> Standard Admin
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.35 }}>
                          Configurable dashboard tabs &amp; assigned mailbox access.
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setNewAdminRole('super_admin')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: newAdminRole === 'super_admin' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        background: newAdminRole === 'super_admin' ? 'rgba(184,134,11,0.08)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="new-admin-role-radio"
                        id="new-role-super"
                        checked={newAdminRole === 'super_admin'}
                        onChange={() => setNewAdminRole('super_admin')}
                        style={{ marginTop: '0.2rem', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-gold)' }}></i> Super Admin
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.35 }}>
                          Full system control, manage admins, unrestricted access to all tabs &amp; emails.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="new-admin-pw" className="form-label">Initial Password (Optional)</label>
                  <input
                    type="password"
                    id="new-admin-pw"
                    className="form-input"
                    placeholder="Min. 6 characters"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                  />
                </div>

                {/* Granular Permission: Allowed Dashboard Tabs */}
                <div className="form-group" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
                    <i className="fa-solid fa-table-columns"></i> Allowed Dashboard Tabs
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Choose which dashboard sections this administrator can access.
                  </p>
                  {newAdminRole === 'super_admin' ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', background: 'rgba(0,109,68,0.08)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid rgba(0,109,68,0.2)' }}>
                      <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i>
                      Super Admins have unrestricted access to all tabs (Overview, Gallery, Inquiries, Mailbox, Admins).
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                      {SYSTEM_TABS.map((tab) => (
                        <label
                          key={tab.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            padding: '8px 12px',
                            background: 'var(--bg-card)',
                            borderRadius: '4px',
                            border: newAdminAllowedTabs.includes(tab.id)
                              ? '1px solid var(--accent-emerald)'
                              : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            fontWeight: newAdminAllowedTabs.includes(tab.id) ? 600 : 400,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={newAdminAllowedTabs.includes(tab.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewAdminAllowedTabs((prev) => [...prev, tab.id]);
                              } else {
                                setNewAdminAllowedTabs((prev) => prev.filter((id) => id !== tab.id));
                              }
                            }}
                          />
                          <i className={`fa-solid ${tab.icon}`} style={{ color: 'var(--accent-emerald)', width: '16px' }}></i>
                          <span>{tab.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Granular Permission: Authorized Email Addresses */}
                <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
                    <i className="fa-solid fa-envelope-circle-check"></i> Authorized Mailbox Email Addresses
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Designate which official domain email addresses this administrator can view, read, and send from.
                  </p>
                  {newAdminRole === 'super_admin' ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', background: 'rgba(217,119,6,0.08)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid rgba(217,119,6,0.2)' }}>
                      <i className="fa-solid fa-at" style={{ marginRight: '6px' }}></i>
                      Super Admins can view and dispatch emails from all institutional addresses (*).
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {loadingMailboxEmails ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i> Loading available email addresses...
                        </div>
                      ) : availableMailboxEmails.length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px dashed var(--border-color)' }}>
                          No domain email addresses registered yet. Enter an email below (e.g. <code>info@idi.lk</code>) to add it.
                        </div>
                      ) : (
                        availableMailboxEmails.map((item) => (
                          <div
                            key={item.email}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: 'var(--bg-card)',
                              borderRadius: '4px',
                              border: newAdminAllowedEmails.includes(item.email)
                                ? '1px solid var(--accent-gold)'
                                : '1px solid var(--border-color)',
                            }}
                          >
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: newAdminAllowedEmails.includes(item.email) ? 600 : 400,
                                flex: 1,
                                margin: 0,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={newAdminAllowedEmails.includes(item.email)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewAdminAllowedEmails((prev) => [...prev, item.email]);
                                  } else {
                                    setNewAdminAllowedEmails((prev) => prev.filter((em) => em !== item.email));
                                  }
                                }}
                              />
                              <i className="fa-solid fa-at" style={{ color: 'var(--accent-gold)' }}></i>
                              <span>{item.label}</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomEmail(item.email)}
                              title="Delete from available addresses"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '2px 6px',
                                fontSize: '0.75rem',
                                borderRadius: '4px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        ))
                      )}

                      {/* Add Custom Email Address Input */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.35rem' }}>
                        <input
                          type="email"
                          placeholder="Add new email address (e.g. principal@idi.lk)"
                          className="form-control"
                          style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                          value={customNewEmailInput}
                          onChange={(e) => setCustomNewEmailInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomEmail('new');
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleAddCustomEmail('new')}
                        >
                          <i className="fa-solid fa-plus"></i> Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddAdminModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Create Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EDIT ADMIN MODAL */}
      {editAdminModal && editingAdmin && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-user-pen" style={{ color: 'var(--accent-emerald)' }}></i> Edit Admin Account &amp; Permissions
              </h3>
              <button className="modal-close-btn" onClick={() => setEditAdminModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditAdminSubmit} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
              <div className="modal-body" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    readOnly
                    style={{ background: 'var(--bg-main)', opacity: 0.85 }}
                    value={editingAdmin.email}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-admin-name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="edit-admin-name"
                    className="form-input"
                    required
                    value={editingAdmin.full_name || ''}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, full_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Administrative Role *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <div
                      onClick={() => setEditAdminRole('admin')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: editAdminRole === 'admin' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                        background: editAdminRole === 'admin' ? 'rgba(0,109,68,0.06)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="edit-admin-role-radio"
                        id="edit-role-admin"
                        checked={editAdminRole === 'admin'}
                        onChange={() => setEditAdminRole('admin')}
                        style={{ marginTop: '0.2rem', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-user-gear" style={{ color: 'var(--accent-emerald)' }}></i> Standard Admin
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.35 }}>
                          Configurable dashboard tabs &amp; assigned mailbox access.
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setEditAdminRole('super_admin')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: editAdminRole === 'super_admin' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        background: editAdminRole === 'super_admin' ? 'rgba(184,134,11,0.08)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="edit-admin-role-radio"
                        id="edit-role-super"
                        checked={editAdminRole === 'super_admin'}
                        onChange={() => setEditAdminRole('super_admin')}
                        style={{ marginTop: '0.2rem', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-gold)' }}></i> Super Admin
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.35 }}>
                          Full system control, manage admins, unrestricted access to all tabs &amp; emails.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-admin-status-sel" className="form-label">Account Status</label>
                  <select
                    id="edit-admin-status-sel"
                    className="form-input"
                    value={editAdminStatus}
                    onChange={(e) => setEditAdminStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended (Block Login)</option>
                  </select>
                </div>

                {/* Granular Permission: Allowed Dashboard Tabs */}
                <div className="form-group" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
                    <i className="fa-solid fa-table-columns"></i> Allowed Dashboard Tabs
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Choose which sections this administrator can access on their dashboard navbar.
                  </p>
                  {editAdminRole === 'super_admin' ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', background: 'rgba(0,109,68,0.08)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid rgba(0,109,68,0.2)' }}>
                      <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i>
                      Super Admins automatically have access to all tabs (Overview, Gallery, Inquiries, Mailbox, Admins).
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                      {SYSTEM_TABS.map((tab) => (
                        <label
                          key={tab.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            padding: '8px 12px',
                            background: 'var(--bg-card)',
                            borderRadius: '4px',
                            border: editAdminAllowedTabs.includes(tab.id)
                              ? '1px solid var(--accent-emerald)'
                              : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            fontWeight: editAdminAllowedTabs.includes(tab.id) ? 600 : 400,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={editAdminAllowedTabs.includes(tab.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditAdminAllowedTabs((prev) => [...prev, tab.id]);
                              } else {
                                setEditAdminAllowedTabs((prev) => prev.filter((id) => id !== tab.id));
                              }
                            }}
                          />
                          <i className={`fa-solid ${tab.icon}`} style={{ color: 'var(--accent-emerald)', width: '16px' }}></i>
                          <span>{tab.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Granular Permission: Authorized Email Addresses */}
                <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
                    <i className="fa-solid fa-envelope-circle-check"></i> Authorized Mailbox Email Addresses
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Configure which domain email addresses this administrator can view and send from.
                  </p>
                  {editAdminRole === 'super_admin' ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', background: 'rgba(217,119,6,0.08)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid rgba(217,119,6,0.2)' }}>
                      <i className="fa-solid fa-at" style={{ marginRight: '6px' }}></i>
                      Super Admins can access and send from all institutional addresses (*).
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {loadingMailboxEmails ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i> Loading available email addresses...
                        </div>
                      ) : availableMailboxEmails.length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px dashed var(--border-color)' }}>
                          No domain email addresses registered yet. Enter an email below (e.g. <code>info@idi.lk</code>) to add it.
                        </div>
                      ) : (
                        availableMailboxEmails.map((item) => (
                          <div
                            key={item.email}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: 'var(--bg-card)',
                              borderRadius: '4px',
                              border: editAdminAllowedEmails.includes(item.email)
                                ? '1px solid var(--accent-gold)'
                                : '1px solid var(--border-color)',
                            }}
                          >
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                fontWeight: editAdminAllowedEmails.includes(item.email) ? 600 : 400,
                                flex: 1,
                                margin: 0,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={editAdminAllowedEmails.includes(item.email)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditAdminAllowedEmails((prev) => [...prev, item.email]);
                                  } else {
                                    setEditAdminAllowedEmails((prev) => prev.filter((em) => em !== item.email));
                                  }
                                }}
                              />
                              <i className="fa-solid fa-at" style={{ color: 'var(--accent-gold)' }}></i>
                              <span>{item.label}</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomEmail(item.email)}
                              title="Delete from available addresses"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '2px 6px',
                                fontSize: '0.75rem',
                                borderRadius: '4px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        ))
                      )}

                      {/* Add Custom Email Address Input */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '0.35rem' }}>
                        <input
                          type="email"
                          placeholder="Add new email address (e.g. principal@idi.lk)"
                          className="form-control"
                          style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                          value={customEditEmailInput}
                          onChange={(e) => setCustomEditEmailInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomEmail('edit');
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleAddCustomEmail('edit')}
                        >
                          <i className="fa-solid fa-plus"></i> Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditAdminModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div className="modal-header" style={{ background: 'rgba(220,38,38,0.08)', borderBottomColor: 'rgba(220,38,38,0.15)' }}>
              <h3 style={{ color: 'var(--danger)' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Confirm Deletion
              </h3>
              <button className="modal-close-btn" onClick={() => setDeleteModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {deleteConfig.message}
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ background: '#dc2626', color: '#fff' }}
                onClick={() => deleteConfig.action && deleteConfig.action()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SUPABASE SETTINGS MODAL */}
      {configModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-database" style={{ color: 'var(--accent-emerald)' }}></i> Supabase API Settings
              </h3>
              <button className="modal-close-btn" onClick={() => setConfigModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Active Supabase credentials used for database queries, authentication, and file storage.
              </p>
              <div className="form-group">
                <label htmlFor="cfg-url" className="form-label">Supabase Project URL</label>
                <input
                  type="url"
                  id="cfg-url"
                  className="form-input"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cfg-key" className="form-label">Supabase Anon Public Key</label>
                <input
                  type="text"
                  id="cfg-key"
                  className="form-input"
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setConfigModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveConfig}>
                Save Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. CHANGE / FIRST-TIME PASSWORD UPDATE MODAL */}
      {passwordModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-card" style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-key" style={{ color: 'var(--accent-emerald)' }}></i>{' '}
                {isForcedPasswordChange ? 'Update Temporary Password' : 'Change Password'}
              </h3>
              {!isForcedPasswordChange && (
                <button className="modal-close-btn" onClick={() => setPasswordModalOpen(false)}>&times;</button>
              )}
            </div>
            <form onSubmit={handleUpdatePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
              <div className="modal-body" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
                {isForcedPasswordChange ? (
                  <div className="alert alert-danger" style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <i className="fa-solid fa-lock"></i>
                    <span>For security, please set your new personal password before accessing the administrative portal.</span>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Choose a strong, confidential password with at least 6 characters.
                  </p>
                )}

                <div className="form-group">
                  <label htmlFor="modal-new-pw" className="form-label">New Password *</label>
                  <input
                    type="password"
                    id="modal-new-pw"
                    className="form-input"
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-confirm-pw" className="form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    id="modal-confirm-pw"
                    className="form-input"
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    value={confirmPasswordVal}
                    onChange={(e) => setConfirmPasswordVal(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                {!isForcedPasswordChange && (
                  <button type="button" className="btn btn-secondary" onClick={() => setPasswordModalOpen(false)}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn btn-primary" disabled={updatingPassword}>
                  {updatingPassword ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Updating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i> {isForcedPasswordChange ? 'Save & Continue' : 'Update Password'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="toast-container" id="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            style={{
              padding: '0.85rem 1.25rem',
              marginBottom: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              background: toast.type === 'danger' ? '#fee2e2' : toast.type === 'warning' ? '#fef3c7' : '#ecfdf5',
              color: toast.type === 'danger' ? '#991b1b' : toast.type === 'warning' ? '#92400e' : '#065f46',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            <i className={toast.type === 'danger' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'}></i>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
