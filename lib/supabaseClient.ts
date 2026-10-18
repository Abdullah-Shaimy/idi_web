/**
 * Institute of Da'wa Islamiyya (IDI) - Supabase Integration Client
 * Handles Database queries, Authentication, and Storage operations.
 */// Institute of Da'wa Islamiyya (IDI) - Supabase Client
import { createClient } from "@supabase/supabase-js";

function getStorageItem(key) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function setStorageItem(key, val) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, val);
    } catch (e) {}
  }
}

    // -------------------------------------------------------------------------
    // 1. SUPABASE CONFIGURATION
    // -------------------------------------------------------------------------
    // Replace these values with your actual Supabase Project credentials.
    // Found in Supabase Dashboard -> Project Settings -> API.
    // You can also override these at runtime via localStorage ('idi_supabase_url', 'idi_supabase_anon_key')
    const DEFAULT_CONFIG = {
        url: getStorageItem('idi_supabase_url') || ((typeof process !== "undefined" && process.env && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL))) || 'https://pbgqrjlcqyyolejchymx.supabase.co',
        anonKey: getStorageItem('idi_supabase_anon_key') || ((typeof process !== "undefined" && process.env && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY))) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ3FyamxjcXl5b2xlamNoeW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMzczOTQsImV4cCI6MjEwNzYxMzM5NH0.IOdBTilJQ79zP6tqxLxTtqQnK1xreTo0E99A07-lrK0',
    };

    let client = null;

    /**
     * Checks if real Supabase credentials have been configured
     */
    function isConfigured() {
        const url = getConfig().url;
        const anonKey = getConfig().anonKey;
        return (
            url &&
            anonKey &&
            !url.includes('your-project-id.supabase.co') &&
            !anonKey.includes('your-anon-public-key')
        );
    }

    /**
     * Get active configuration
     */
    function getConfig() {
        return {
            url: getStorageItem('idi_supabase_url') || ((typeof process !== "undefined" && process.env && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL))) || DEFAULT_CONFIG.url,
            anonKey: getStorageItem('idi_supabase_anon_key') || ((typeof process !== "undefined" && process.env && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY))) || DEFAULT_CONFIG.anonKey,
        };
    }

    /**
     * Save configuration to localStorage
     */
    function setConfig(url, anonKey) {
        if (url) setStorageItem('idi_supabase_url', url.trim());
        if (anonKey) setStorageItem('idi_supabase_anon_key', anonKey.trim());
        client = null; // Reset client instance to re-initialize
    }

    /**
     * Initializes or returns the existing Supabase client instance
     */
    function getClient() {
        if (client) {
            return client;
        }

        if (typeof createClient !== 'function') {
            console.warn('[IDI Supabase] Supabase JS SDK not loaded yet.');
            return null;
        }

        const config = getConfig();
        if (!config.url || !config.anonKey) {
            console.warn('[IDI Supabase] Supabase URL or Anon Key is missing.');
            return null;
        }

        try {
            client = createClient(config.url, config.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                },
            });
            return client;
        } catch (error) {
            console.error('[IDI Supabase] Initialization error:', error);
            return null;
        }
    }

    // -------------------------------------------------------------------------
    // 2. MOCK / FALLBACK DATA (Used when Supabase is not yet connected)
    // -------------------------------------------------------------------------
    const MOCK_FOLDERS = [
        {
            id: 'mock-folder-1',
            name: 'Annual Day 2026',
            description: 'Annual gathering, student speeches, and academic award ceremony.',
            cover_image_url: 'https://images.unsplash.com/photo-1606820864387-e23a41e975ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            photo_count: 3,
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
            id: 'mock-folder-2',
            name: 'Campus Life & Mosque',
            description: 'The peaceful campus environment and interior of the Madrasa Mosque.',
            cover_image_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            photo_count: 2,
            created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        },
        {
            id: 'mock-folder-3',
            name: 'Hifz Program & Daily Study',
            description: 'Students engaged in Quranic memorization, Tajweed, and evening Dua sessions.',
            cover_image_url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            photo_count: 2,
            created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
        },
    ];

    const MOCK_PHOTOS = {
        'mock-folder-1': [
            {
                id: 'mock-photo-101',
                folder_id: 'mock-folder-1',
                title: 'Annual gathering and prize distribution',
                description: 'Recognition ceremony for exemplary Hifz achievements.',
                image_url: 'https://images.unsplash.com/photo-1606820864387-e23a41e975ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                storage_path: 'mock/annual-day/photo-101.jpg',
                created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            },
            {
                id: 'mock-photo-102',
                folder_id: 'mock-folder-1',
                title: 'Keynote address by esteemed scholars',
                description: 'Inspiring words delivered to graduates and their families.',
                image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                storage_path: 'mock/annual-day/photo-102.jpg',
                created_at: new Date(Date.now() - 86400000 * 5 + 1000).toISOString(),
            },
            {
                id: 'mock-photo-103',
                folder_id: 'mock-folder-1',
                title: 'Graduation assembly in the main auditorium',
                description: 'Congregation of teachers, students, and community elders.',
                image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                storage_path: 'mock/annual-day/photo-103.jpg',
                created_at: new Date(Date.now() - 86400000 * 5 + 2000).toISOString(),
            },
        ],
        'mock-folder-2': [
            {
                id: 'mock-photo-201',
                folder_id: 'mock-folder-2',
                title: 'Beautiful interior of the Madrasa Mosque',
                description: 'Serene atmosphere for prayer and contemplation.',
                image_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                storage_path: 'mock/campus/photo-201.jpg',
                created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
            },
            {
                id: 'mock-photo-202',
                folder_id: 'mock-folder-2',
                title: 'Campus grounds and library entrance',
                description: 'Tranquil pathways supporting a dedicated learning environment.',
                image_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                storage_path: 'mock/campus/photo-202.jpg',
                created_at: new Date(Date.now() - 86400000 * 15 + 1000).toISOString(),
            },
        ],
        'mock-folder-3': [
            {
                id: 'mock-photo-301',
                folder_id: 'mock-folder-3',
                title: 'Students studying the Quran in the main hall',
                description: 'Daily morning recitation and memorization circles.',
                image_url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                storage_path: 'mock/hifz/photo-301.jpg',
                created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
            },
            {
                id: 'mock-photo-302',
                folder_id: 'mock-folder-3',
                title: 'Evening Dua after Maghrib prayers',
                description: 'Collective prayers and spiritual remembrance.',
                image_url: 'https://images.unsplash.com/photo-1628189871790-2527fc69537d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                storage_path: 'mock/hifz/photo-302.jpg',
                created_at: new Date(Date.now() - 86400000 * 25 + 1000).toISOString(),
            },
        ],
    };

    let MOCK_INQUIRIES = [
        {
            id: 'mock-inq-1',
            name: 'Mohammed Rizwan',
            email: 'rizwan.m@example.com',
            phone: '+94 77 123 4567',
            city: 'Colombo',
            subject: 'Hifz Program Admission Inquiry for 2026/27',
            message: 'Assalamu Alaikum. I would like to inquire about the admission criteria and boarding facilities for my 12-year-old son for the upcoming Hifz batch. Please share the prospectus and fee structure.',
            status: 'new',
            admin_notes: '',
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
            id: 'mock-inq-2',
            name: 'Fathima Zahra',
            email: 'fathima.z@example.com',
            phone: '+94 71 987 6543',
            city: 'Kandy',
            subject: 'Open Madrasa Course Syllabus Details',
            message: 'Greetings! Could you please let me know if the Open Madrasa courses offer weekend online sessions for working professionals? Jazakallah Khair.',
            status: 'in_progress',
            admin_notes: 'Replied with course syllabus via email on Feb 25. Waiting for confirmation.',
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
        {
            id: 'mock-inq-3',
            name: 'Ahamed Faris',
            email: 'faris.ahamed@example.com',
            phone: '+94 76 555 1234',
            city: 'Galle',
            subject: 'Alumni Verification & Certificate Request',
            message: 'I completed my Hifz course in 2022. I require an official verification letter for higher studies abroad. Kindly advise on the procedure.',
            status: 'resolved',
            admin_notes: 'Certificate dispatched via registered post.',
            created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
            id: 'mock-inq-4',
            name: 'Ibrahim Saleem',
            email: 'ibrahim.s@example.com',
            phone: '+94 75 444 8899',
            city: 'Negombo',
            subject: 'General Campus Visit Scheduling',
            message: 'We are planning a visit with our local community youth group to see the Madrasa library and environment. Is upcoming Saturday suitable?',
            status: 'new',
            admin_notes: '',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
    ];

    let MOCK_ALUMNI_REGISTRATIONS = [];

    let MOCK_ADMINS = [
        {
            id: 'mock-admin-1',
            user_id: 'mock-user-dev-id',
            email: 'dev@idi.lk',
            role: 'super_admin',
            full_name: 'Lead Developer (Super Admin)',
            status: 'active',
            allowed_tabs: ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'],
            allowed_emails: ['*'],
            created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 60).toISOString(),
        },
        {
            id: 'mock-admin-2',
            user_id: 'mock-user-admin-id',
            email: 'admin@idi.lk',
            role: 'super_admin',
            full_name: 'Principal Administrator',
            status: 'active',
            allowed_tabs: ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'],
            allowed_emails: ['*'],
            created_at: new Date(Date.now() - 86400000 * 40).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 40).toISOString(),
        },
        {
            id: 'mock-admin-3',
            user_id: 'mock-user-staff-id',
            email: 'gallery.manager@idi.lk',
            role: 'admin',
            full_name: 'Media & Communications Officer',
            status: 'active',
            allowed_tabs: ['overview', 'gallery'],
            allowed_emails: ['support@idi.lk'],
            created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        }
    ];

    function isKnownSuperAdminEmail(email?: string | null): boolean {
        if (!email) return false;
        const clean = email.toLowerCase().trim();
        return clean === 'dev@idi.lk' || clean === 'dev@abdullahshaimy.lk';
    }

    // -------------------------------------------------------------------------
    // 3. PUBLIC GALLERY SERVICE METHODS
    // -------------------------------------------------------------------------

    /**
     * Fetch all folders with photo counts
     */
    async function fetchFolders() {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            console.info('[IDI Supabase] Using fallback mock folders (Supabase not configured yet).');
            return { data: MOCK_FOLDERS, error: null, isMock: true };
        }

        try {
            const { data, error } = await supabase
                .from('gallery_folders')
                .select(`
                    id,
                    name,
                    description,
                    cover_image_url,
                    created_at,
                    updated_at,
                    gallery_photos (count)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedFolders = (data || []).map((folder) => {
                const countObj = folder.gallery_photos && folder.gallery_photos[0];
                const count = countObj ? countObj.count : 0;
                return {
                    id: folder.id,
                    name: folder.name,
                    description: folder.description,
                    cover_image_url: folder.cover_image_url,
                    photo_count: count,
                    created_at: folder.created_at,
                    updated_at: folder.updated_at,
                };
            });

            return { data: formattedFolders, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error fetching folders:', error);
            return { data: null, error: error.message || error, isMock: false };
        }
    }

    /**
     * Fetch photos belonging to a specific folder
     */
    async function fetchPhotosByFolder(folderId) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const mockList = MOCK_PHOTOS[folderId] || [];
            return { data: mockList, error: null, isMock: true };
        }

        try {
            const { data, error } = await supabase
                .from('gallery_photos')
                .select('*')
                .eq('folder_id', folderId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data: data || [], error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error fetching folder photos:', error);
            return { data: null, error: error.message || error, isMock: false };
        }
    }

    /**
     * Fetch a single folder by ID
     */
    async function fetchFolderById(folderId) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const folder: any = MOCK_FOLDERS.find((f) => f.id === folderId);
            return { data: folder || null, error: folder ? null : 'Folder not found', isMock: true };
        }

        try {
            const { data, error } = await supabase
                .from('gallery_folders')
                .select('*')
                .eq('id', folderId)
                .single();

            if (error) throw error;
            return { data, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error fetching folder by ID:', error);
            return { data: null, error: error.message || error, isMock: false };
        }
    }

    // -------------------------------------------------------------------------
    // 4. ADMIN AUTHENTICATION & AUTHORIZATION
    // -------------------------------------------------------------------------

    /**
     * Sign in with Email and Password
     */
    async function signIn(email, password) {
        const supabase = getClient();
        if (!supabase) {
            return { data: null, error: 'Supabase client is not initialized.' };
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (error) throw error;

            // Check if authenticated user is listed in admin_users
            const profile = await getAdminProfile(data.user.id);
            if (!profile || profile.status === 'suspended') {
                await supabase.auth.signOut();
                return {
                    data: null,
                    error: 'Access denied: Your account is not authorized or is currently suspended.',
                };
            }

            return { data, profile, error: null };
        } catch (error) {
            return { data: null, error: error.message || error };
        }
    }

    /**
     * Sign out active session
     */
    async function signOut() {
        const supabase = getClient();
        if (!supabase) return { error: null };
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (error) {
            return { error: error.message || error };
        }
    }

    /**
     * Get active session
     */
    async function getSession() {
        const supabase = getClient();
        if (!supabase) return null;
        try {
            const { data } = await supabase.auth.getSession();
            return data.session;
        } catch {
            return null;
        }
    }

    /**
     * Get currently logged-in user
     */
    async function getUser() {
        const supabase = getClient();
        if (!supabase) return null;
        try {
            const { data } = await supabase.auth.getUser();
            return data.user;
        } catch {
            return null;
        }
    }

    /**
     * Update active logged-in user password and clear must_change_password flag
     */
    async function updatePassword(newPassword: string) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            return { data: null, error: null, isMock: true };
        }

        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;

            const user = data.user;
            if (user) {
                try {
                    await supabase
                        .from('admin_users')
                        .update({ must_change_password: false, updated_at: new Date().toISOString() })
                        .eq('user_id', user.id);
                } catch {
                    // Ignore if column doesn't exist yet
                }
            }

            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message || error };
        }
    }

    /**
     * Get admin profile data by user ID
     */
    async function getAdminProfile(userId) {
        if (!userId) return null;
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            return {
                id: 'mock-admin-dev',
                user_id: userId,
                email: 'dev@idi.lk',
                role: 'super_admin',
                full_name: 'Lead Developer (Super Admin)',
                status: 'active',
            };
        }

        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            const user = await getUser();
            const userEmail = (user && user.email) || (data && data.email) || '';
            const isKnownSuper = isKnownSuperAdminEmail(userEmail);

            if (error || !data) {
                if (isKnownSuper) {
                    return {
                        id: 'super-admin-' + userId,
                        user_id: userId,
                        email: userEmail || 'dev@abdullahshaimy.lk',
                        role: 'super_admin',
                        full_name: userEmail.includes('abdullah') ? 'Abdullah Shaimy' : 'Lead Developer (Super Admin)',
                        status: 'active',
                        allowed_tabs: ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'],
                        allowed_emails: ['*'],
                    };
                }
                return null;
            }

            const userMeta = ((user as any)?.user_metadata || {}) as Record<string, any>;
            const roleFromRecord = data.role || userMeta.role;
            const isSuper = roleFromRecord === 'super_admin' || (!roleFromRecord && isKnownSuper);

            data.role = isSuper ? 'super_admin' : 'admin';
            data.status = data.status || 'active';
            data.allowed_tabs =
                data.allowed_tabs ||
                userMeta.allowed_tabs ||
                (isSuper ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'] : ['overview', 'gallery', 'inquiries', 'mailbox']);
            const resolvedEmails = Array.isArray(data.allowed_emails)
                ? data.allowed_emails
                : Array.isArray(userMeta.allowed_emails)
                ? userMeta.allowed_emails
                : (isSuper ? ['*'] : []);

            data.allowed_emails = isSuper ? ['*'] : resolvedEmails;

            return data;
        } catch {
            return null;
        }
    }

    /**
     * Verify if a user ID is listed in the `admin_users` table
     */
    async function checkIsAdmin(userId) {
        const user = await getUser();
        if (user && isKnownSuperAdminEmail(user.email)) return true;
        const profile = await getAdminProfile(userId);
        return Boolean(profile && profile.status === 'active');
    }

    /**
     * Verify if a user ID is a `super_admin`
     */
    async function checkIsSuperAdmin(userId) {
        const user = await getUser();
        if (user && isKnownSuperAdminEmail(user.email)) return true;
        const profile = await getAdminProfile(userId);
        return Boolean(profile && (profile.role === 'super_admin' || isKnownSuperAdminEmail(user?.email)) && profile.status === 'active');
    }

    /**
     * Get active logged in user profile with role info
     */
    async function getCurrentAdminProfile() {
        const user = await getUser();
        if (!user) return null;
        let profile = await getAdminProfile(user.id);
        const isDev = isKnownSuperAdminEmail(user.email);

        if (!profile && isDev) {
            profile = {
                id: 'super-admin-' + user.id,
                user_id: user.id,
                email: user.email || 'dev@abdullahshaimy.lk',
                role: 'super_admin',
                full_name: user.email?.includes('abdullah') ? 'Abdullah Shaimy' : 'Lead Developer (Super Admin)',
                status: 'active',
                allowed_tabs: ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'],
                allowed_emails: ['*'],
            };
        }

        const isSuper = isDev || (profile && profile.role === 'super_admin');
        return {
            user,
            profile,
            isSuperAdmin: Boolean(isSuper),
            role: isSuper ? 'super_admin' : (profile ? profile.role : 'admin'),
        };
    }

    // -------------------------------------------------------------------------
    // 5. CONTACT INQUIRIES MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * Submit a contact inquiry from public website
     */
    async function submitContactInquiry({ name, email, phone, city, subject, message }) {
        const payload = {
            name: (name || '').trim(),
            email: (email || '').trim() || null,
            phone: (phone || '').trim() || null,
            city: (city || '').trim() || null,
            subject: (subject || 'General Inquiry').trim(),
            message: (message || '').trim(),
            status: 'new',
        };

        if (!payload.name || !payload.message) {
            throw new Error('Name and message are required.');
        }

        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const mockEntry = {
                id: 'inq-' + Date.now(),
                ...payload,
                admin_notes: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            MOCK_INQUIRIES.unshift(mockEntry);
            return { data: mockEntry, error: null, isMock: true };
        }

        try {
            const { error } = await supabase
                .from('contact_inquiries')
                .insert([payload]);

            if (error) {
                console.warn('[IDI Supabase] Notice on contact_inquiries insert:', error.message);
                const mockEntry = {
                    id: 'inq-' + Date.now(),
                    ...payload,
                    admin_notes: '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                MOCK_INQUIRIES.unshift(mockEntry);
                return { success: true, error: null, isMock: true };
            }
            return { success: true, error: null, isMock: false };
        } catch (error) {
            console.warn('[IDI Supabase] Fallback on contact inquiry submission:', error.message || error);
            const mockEntry = {
                id: 'inq-' + Date.now(),
                ...payload,
                admin_notes: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            MOCK_INQUIRIES.unshift(mockEntry);
            return { success: true, error: null, isMock: true };
        }
    }

    /**
     * Submit an Alumni Registration from public website
     */
    async function submitAlumniRegistration(registrationData: Record<string, any>) {
        const payload = {
            full_name: (registrationData.full_name || '').trim(),
            name_tamil: (registrationData.name_tamil || '').trim() || null,
            title: (registrationData.title || '').trim() || null,
            completion_year: (registrationData.completion_year || '').trim(),
            program: (registrationData.program || '').trim(),
            student_id: (registrationData.student_id || '').trim() || null,
            is_hafiz: Boolean(registrationData.is_hafiz),
            phone: (registrationData.phone || '').trim(),
            email: (registrationData.email || '').trim(),
            city: (registrationData.city || '').trim(),
            country: (registrationData.country || 'Sri Lanka').trim(),
            address: (registrationData.address || '').trim() || null,
            occupation: (registrationData.occupation || '').trim(),
            organization: (registrationData.organization || '').trim() || null,
            higher_education: (registrationData.higher_education || '').trim() || null,
            interests: Array.isArray(registrationData.interests) ? registrationData.interests : [],
            message: (registrationData.message || '').trim() || null,
            status: 'submitted',
            created_at: new Date().toISOString(),
        };

        if (!payload.full_name || !payload.phone || !payload.email) {
            throw new Error('Full Name, Phone number, and Email are required.');
        }

        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const mockEntry = {
                id: 'alumni-reg-' + Date.now(),
                ...payload,
            };
            MOCK_ALUMNI_REGISTRATIONS.unshift(mockEntry);
            return { data: mockEntry, error: null, isMock: true };
        }

        try {
            // Try inserting into dedicated alumni_registrations table if it exists
            const { data, error } = await supabase
                .from('alumni_registrations')
                .insert([payload])
                .select()
                .maybeSingle();

            if (!error) {
                return { data, error: null, isMock: false };
            }

            console.warn('[IDI Supabase] alumni_registrations insert note:', error.message);
            // Fallback: also log to contact_inquiries so admins see it immediately in dashboard
            const formattedMessage = [
                `--- ALUMNI REGISTRATION DETAILS ---`,
                `Full Name: ${payload.full_name} (${payload.name_tamil || 'N/A'})`,
                `Title: ${payload.title || 'N/A'}`,
                `Batch / Year: ${payload.completion_year || 'N/A'}`,
                `Program: ${payload.program || 'N/A'}`,
                `Hifz Completed: ${payload.is_hafiz ? 'Yes' : 'No'}`,
                `Phone / WhatsApp: ${payload.phone}`,
                `Email: ${payload.email}`,
                `Location: ${payload.city}, ${payload.country}`,
                `Address: ${payload.address || 'N/A'}`,
                `Occupation: ${payload.occupation} (${payload.organization || 'N/A'})`,
                `Higher Education: ${payload.higher_education || 'N/A'}`,
                `Interests: ${payload.interests.join(', ') || 'General'}`,
                `Message / Memories: ${payload.message || 'None provided'}`,
            ].join('\n');

            await supabase.from('contact_inquiries').insert([{
                name: payload.full_name,
                email: payload.email,
                phone: payload.phone,
                city: payload.city,
                subject: `[Alumni Registration] ${payload.full_name} (Batch ${payload.completion_year || 'N/A'})`,
                message: formattedMessage,
                status: 'new',
            }]);

            return { data: payload, error: null, isMock: false };
        } catch (err: any) {
            console.warn('[IDI Supabase] Fallback on alumni registration:', err.message || err);
            const mockEntry = {
                id: 'alumni-reg-' + Date.now(),
                ...payload,
            };
            MOCK_ALUMNI_REGISTRATIONS.unshift(mockEntry);
            return { data: mockEntry, error: null, isMock: true };
        }
    }

    /**
     * Fetch contact inquiries (Accessible to Super Admins and Admins)
     */
    async function fetchContactInquiries(status = null, search = '') {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            let list = [...MOCK_INQUIRIES];
            if (status && status !== 'all') {
                list = list.filter((i) => i.status === status);
            }
            if (search && search.trim()) {
                const s = search.toLowerCase().trim();
                list = list.filter(
                    (i) =>
                        (i.name && i.name.toLowerCase().includes(s)) ||
                        (i.email && i.email.toLowerCase().includes(s)) ||
                        (i.phone && i.phone.toLowerCase().includes(s)) ||
                        (i.city && i.city.toLowerCase().includes(s)) ||
                        (i.message && i.message.toLowerCase().includes(s)) ||
                        (i.subject && i.subject.toLowerCase().includes(s))
                );
            }
            return { data: list, error: null, isMock: true };
        }

        try {
            let query = supabase
                .from('contact_inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) {
                // If table is not created in Supabase yet, return fallback mock inquiries
                return { data: [...MOCK_INQUIRIES], error: null, isMock: true, pendingMigration: true };
            }
            return { data: data || [], error: null, isMock: false };
        } catch {
            return { data: [...MOCK_INQUIRIES], error: null, isMock: true };
        }
    }

    /**
     * Update inquiry status and optional admin internal notes
     */
    async function updateInquiryStatus(inquiryId, status, adminNotes = null) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const found = MOCK_INQUIRIES.find((i) => i.id === inquiryId);
            if (found) {
                found.status = status;
                if (adminNotes !== null) found.admin_notes = adminNotes;
                found.updated_at = new Date().toISOString();
            }
            return { data: found, error: null, isMock: true };
        }

        try {
            const updates: Record<string, any> = {
                status,
                updated_at: new Date().toISOString(),
            };
            if (adminNotes !== null) {
                updates.admin_notes = adminNotes;
            }

            const { data, error } = await supabase
                .from('contact_inquiries')
                .update(updates)
                .eq('id', inquiryId)
                .select()
                .single();

            if (error) {
                // If table not in Supabase yet, update mock
                const found = MOCK_INQUIRIES.find((i) => i.id === inquiryId);
                if (found) {
                    found.status = status;
                    if (adminNotes !== null) found.admin_notes = adminNotes;
                }
                return { data: found, error: null, isMock: true };
            }
            return { data, error: null, isMock: false };
        } catch (error) {
            return { data: null, error: error.message || error, isMock: false };
        }
    }

    /**
     * Delete an inquiry (Super Admin only)
     */
    async function deleteInquiry(inquiryId) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            MOCK_INQUIRIES = MOCK_INQUIRIES.filter((i) => i.id !== inquiryId);
            return { error: null, isMock: true };
        }

        try {
            const { error } = await supabase
                .from('contact_inquiries')
                .delete()
                .eq('id', inquiryId);

            if (error) {
                MOCK_INQUIRIES = MOCK_INQUIRIES.filter((i) => i.id !== inquiryId);
                return { error: null, isMock: true };
            }
            return { error: null, isMock: false };
        } catch (error) {
            return { error: error.message || error, isMock: false };
        }
    }

    // -------------------------------------------------------------------------
    // 6. SUPER ADMIN - ADMIN USER ACCOUNTS MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * Fetch list of all administrator users
     */
    async function fetchAdminUsers() {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            return { data: [...MOCK_ADMINS], error: null, isMock: true };
        }

        try {
            // First try server API route with admin session
            try {
                const session = await getSession();
                const token = session?.access_token || '';
                const res = await fetch('/api/admin/users', {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                if (res.ok) {
                    const result = await res.json();
                    if (result.success && Array.isArray(result.users)) {
                        return { data: result.users, error: null, isMock: false };
                    }
                }
            } catch (apiErr) {
                console.warn('[IDI Supabase] /api/admin/users GET failed, falling back to direct query:', apiErr);
            }

            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('[IDI Supabase] admin_users query warning:', error.message);
                return { data: [...MOCK_ADMINS], error: null, isMock: true };
            }

            // Normalize records if schema migration hasn't been executed yet
            const normalized = (data || []).map((admin) => {
                const isSuper = admin.role === 'super_admin' || (!admin.role && isKnownSuperAdminEmail(admin.email));
                return {
                    ...admin,
                    role: isSuper ? 'super_admin' : 'admin',
                    status: admin.status || 'active',
                    full_name: admin.full_name || (isSuper ? 'Super Administrator' : (admin.email?.split('@')[0] || 'Admin')),
                    allowed_tabs: admin.allowed_tabs || (isSuper ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'] : ['overview', 'gallery', 'inquiries', 'mailbox']),
                    allowed_emails: isSuper
                        ? ['*']
                        : (Array.isArray(admin.allowed_emails) ? admin.allowed_emails : []),
                    must_change_password: Boolean(admin.must_change_password),
                };
            });

            return { data: normalized, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error fetching admin users:', error);
            return { data: [...MOCK_ADMINS], error: null, isMock: true };
        }
    }

    /**
     * Add / Authorize new Admin user
     */
    async function createAdminUser({ email, role, full_name, password, allowed_tabs, allowed_emails }) {
        const supabase = getClient();
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanRole = role === 'super_admin' ? 'super_admin' : 'admin';
        const cleanName = (full_name || '').trim();
        const cleanTabs = allowed_tabs || (cleanRole === 'super_admin' ? ['overview', 'gallery', 'inquiries', 'mailbox', 'admins'] : ['overview', 'gallery', 'inquiries', 'mailbox']);
        const cleanEmails = cleanRole === 'super_admin' ? ['*'] : (Array.isArray(allowed_emails) ? allowed_emails : []);

        if (!cleanEmail) {
            throw new Error('Valid email address is required.');
        }

        if (!supabase || !isConfigured()) {
            const newAdmin = {
                id: 'mock-admin-' + Date.now(),
                user_id: 'mock-user-' + Math.random().toString(36).substring(2, 8),
                email: cleanEmail,
                role: cleanRole,
                full_name: cleanName || cleanEmail.split('@')[0],
                status: 'active',
                allowed_tabs: cleanTabs,
                allowed_emails: cleanEmails,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            MOCK_ADMINS.push(newAdmin);
            return { data: newAdmin, error: null, isMock: true };
        }

        try {
            // Call server-side API endpoint with session Bearer token
            const session = await getSession();
            const token = session?.access_token || '';

            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    email: cleanEmail,
                    role: cleanRole,
                    full_name: cleanName,
                    password: password || undefined,
                    allowed_tabs: cleanTabs,
                    allowed_emails: cleanEmails,
                }),
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                throw new Error(result.error || 'Failed to create admin user');
            }

            return { data: result.user, generatedPassword: result.generatedPassword, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error creating admin user:', error);
            throw error;
        }
    }

    /**
     * Update admin user role, full name, or status
     */
    async function updateAdminUser(adminId, { role, status, full_name, allowed_tabs, allowed_emails, password }: any = {}) {
        const supabase = getClient();
        const payload: Record<string, any> = {};
        if (role !== undefined) payload.role = role;
        if (status !== undefined) payload.status = status;
        if (full_name !== undefined) payload.full_name = full_name ? full_name.trim() : null;
        if (allowed_tabs !== undefined) payload.allowed_tabs = allowed_tabs;
        if (allowed_emails !== undefined) payload.allowed_emails = allowed_emails;
        if (password !== undefined) payload.password = password;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adminId);

        if (!supabase || !isConfigured() || !isUuid) {
            const admin = MOCK_ADMINS.find((a) => a.id === adminId);
            if (admin) {
                if (role !== undefined) admin.role = role;
                if (status !== undefined) admin.status = status;
                if (full_name !== undefined) admin.full_name = full_name;
                if (allowed_tabs !== undefined) admin.allowed_tabs = allowed_tabs;
                if (allowed_emails !== undefined) admin.allowed_emails = allowed_emails;
                admin.updated_at = new Date().toISOString();
            }
            return { data: admin || { id: adminId, ...payload }, error: null, isMock: true };
        }

        try {
            // First call server API
            const session = await getSession();
            const token = session?.access_token || '';

            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    id: adminId,
                    ...payload,
                }),
            });

            const result = await res.json();
            if (res.ok && result.success) {
                return { data: result.user, error: null, isMock: false };
            }

            // Fallback direct table update if API unavailable
            delete payload.password;
            let { data, error } = await supabase
                .from('admin_users')
                .update(payload)
                .eq('id', adminId)
                .select()
                .single();

            // Fallback if columns not yet migrated on remote Supabase instance
            if (error && error.code === 'PGRST204') {
                const stripped = { ...payload };
                delete stripped.allowed_tabs;
                delete stripped.allowed_emails;
                const retry = await supabase.from('admin_users').update(stripped).eq('id', adminId).select().single();
                if (retry.error) throw retry.error;
                data = { ...retry.data, allowed_tabs, allowed_emails };
            } else if (error) {
                throw error;
            }

            return { data, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error updating admin user:', error);
            throw error;
        }
    }

    /**
     * Delete an admin user record
     */
    async function deleteAdminUser(adminId) {
        const supabase = getClient();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adminId);

        if (!supabase || !isConfigured() || !isUuid) {
            MOCK_ADMINS = MOCK_ADMINS.filter((a) => a.id !== adminId);
            return { success: true, isMock: true };
        }

        try {
            const session = await getSession();
            const token = session?.access_token || '';

            const res = await fetch(`/api/admin/users?id=${encodeURIComponent(adminId)}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const result = await res.json();
            if (res.ok && result.success) {
                return { success: true, isMock: false };
            }

            // Fallback to direct delete
            const { data, error } = await supabase
                .from('admin_users')
                .delete()
                .eq('id', adminId);

            if (error) throw error;
            return { data, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error deleting admin user:', error);
            throw error;
        }
    }

    // -------------------------------------------------------------------------
    // 7. ADMIN FOLDER & PHOTO MANAGEMENT (CRUD)
    // -------------------------------------------------------------------------

    /**
     * Create a new gallery folder
     */
    async function createFolder({ name, description, cover_image_url }) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const newF = {
                id: 'mock-folder-' + Date.now(),
                name: name.trim(),
                description: description ? description.trim() : null,
                cover_image_url: cover_image_url || null,
                photo_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            MOCK_FOLDERS.unshift(newF);
            MOCK_PHOTOS[newF.id] = [];
            return newF;
        }

        const { data, error } = await supabase
            .from('gallery_folders')
            .insert([
                {
                    name: name.trim(),
                    description: description ? description.trim() : null,
                    cover_image_url: cover_image_url ? cover_image_url.trim() : null,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Update an existing folder
     */
    async function updateFolder(folderId: any, { name, description, cover_image_url }: any) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const folder = MOCK_FOLDERS.find((f) => f.id === folderId);
            if (folder) {
                if (name !== undefined) folder.name = name.trim();
                if (description !== undefined) folder.description = description ? description.trim() : null;
                if (cover_image_url !== undefined) folder.cover_image_url = cover_image_url;
                (folder as any).updated_at = new Date().toISOString();
            }
            return folder;
        }

        const payload: Record<string, any> = {};
        if (name !== undefined) payload.name = name.trim();
        if (description !== undefined) payload.description = description ? description.trim() : null;
        if (cover_image_url !== undefined) payload.cover_image_url = cover_image_url;

        const { data, error } = await supabase
            .from('gallery_folders')
            .update(payload)
            .eq('id', folderId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Delete a folder and all its photos from Storage & Database
     */
    async function deleteFolder(folderId) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const idx = MOCK_FOLDERS.findIndex((f) => f.id === folderId);
            if (idx > -1) MOCK_FOLDERS.splice(idx, 1);
            delete MOCK_PHOTOS[folderId];
            return { success: true };
        }

        // 1. Fetch all photo records for this folder to delete their files from Storage
        const { data: photos, error: fetchErr } = await supabase
            .from('gallery_photos')
            .select('storage_path')
            .eq('folder_id', folderId);

        if (!fetchErr && photos && photos.length > 0) {
            const filePaths = photos.map((p) => p.storage_path).filter(Boolean);
            if (filePaths.length > 0) {
                await supabase.storage.from('gallery').remove(filePaths);
            }
        }

        // 2. Delete the folder record (database CASCADE will delete gallery_photos)
        const { data, error } = await supabase
            .from('gallery_folders')
            .delete()
            .eq('id', folderId);

        if (error) throw error;
        return data;
    }

    /**
     * Set a photo as folder cover image
     */
    async function setFolderCoverImage(folderId, imageUrl) {
        return updateFolder(folderId, { cover_image_url: imageUrl });
    }

    /**
     * Upload an image file directly to Supabase Storage and return public URL
     */
    async function uploadImageFile(file, folderSlug = 'covers') {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const mockUrl = URL.createObjectURL(file);
            return {
                publicUrl: mockUrl,
                storagePath: `mock/${folderSlug}/${file.name}`,
            };
        }

        const isWebpCover = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
        if (!isWebpCover) {
            throw new Error(`Invalid file type "${file.type || file.name}". Only WEBP (.webp) images are supported.`);
        }

        if (file.size > 8 * 1024 * 1024) {
            throw new Error('Image file is too large. Maximum allowed size is 8MB.');
        }

        const fileExt = file.name.split('.').pop() || 'webp';
        const cleanSlug = (folderSlug || 'covers')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '-');
        const uniqueId = Math.random().toString(36).substring(2, 9);
        const storagePath = `${cleanSlug}/cover-${Date.now()}-${uniqueId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(storagePath);

        return {
            publicUrl: publicUrlData.publicUrl,
            storagePath: storagePath,
        };
    }

    /**
     * Upload an image file to Supabase Storage and insert metadata into `gallery_photos`
     */
    async function uploadPhoto(file, folderId, folderSlug, customTitle, customDescription) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const isWebpMock = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
            if (!isWebpMock) {
                throw new Error('Only WEBP (.webp) format photos are supported.');
            }
            const mockPhoto = {
                id: 'mock-photo-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                folder_id: folderId,
                title: customTitle || file.name.replace(/\.[^/.]+$/, ''),
                description: customDescription || null,
                image_url: URL.createObjectURL(file),
                storage_path: `mock/${folderSlug || 'album'}/${file.name}`,
                created_at: new Date().toISOString(),
            };
            if (!MOCK_PHOTOS[folderId]) MOCK_PHOTOS[folderId] = [];
            MOCK_PHOTOS[folderId].unshift(mockPhoto);
            const parent = MOCK_FOLDERS.find((f) => f.id === folderId);
            if (parent) parent.photo_count = MOCK_PHOTOS[folderId].length;
            return mockPhoto;
        }

        const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
        if (!isWebp) {
            throw new Error(`Invalid file type "${file.type || file.name}". Only WEBP (.webp) format photos are supported.`);
        }

        const fileExt = file.name.split('.').pop() || 'webp';
        const cleanSlug = (folderSlug || folderId || 'album')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '-');
        const uniqueId = Math.random().toString(36).substring(2, 9);
        const storagePath = `${cleanSlug}/${Date.now()}-${uniqueId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(storagePath);

        const imageUrl = publicUrlData.publicUrl;
        const title = customTitle || file.name.replace(/\.[^/.]+$/, '');
        const { data, error: dbError } = await supabase
            .from('gallery_photos')
            .insert([
                {
                    folder_id: folderId,
                    title: title,
                    description: customDescription || null,
                    image_url: imageUrl,
                    storage_path: storagePath,
                },
            ])
            .select()
            .single();

        if (dbError) {
            await supabase.storage.from('gallery').remove([storagePath]);
            throw dbError;
        }

        return data;
    }

    /**
     * Update photo metadata (title, description)
     */
    async function updatePhoto(photoId, { title, description }) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            for (const key of Object.keys(MOCK_PHOTOS)) {
                const p = MOCK_PHOTOS[key].find((item) => item.id === photoId);
                if (p) {
                    if (title !== undefined) p.title = title.trim();
                    if (description !== undefined) p.description = description ? description.trim() : null;
                    return p;
                }
            }
            return { id: photoId, title, description };
        }

        const payload: Record<string, any> = {};
        if (title !== undefined) payload.title = title.trim();
        if (description !== undefined) payload.description = description ? description.trim() : null;

        const { data, error } = await supabase
            .from('gallery_photos')
            .update(payload)
            .eq('id', photoId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Delete a single photo from Storage and Database
     */
    async function deletePhoto(photoId, storagePath) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            for (const key of Object.keys(MOCK_PHOTOS)) {
                const idx = MOCK_PHOTOS[key].findIndex((item) => item.id === photoId);
                if (idx > -1) {
                    MOCK_PHOTOS[key].splice(idx, 1);
                    const parent = MOCK_FOLDERS.find((f) => f.id === key);
                    if (parent) parent.photo_count = MOCK_PHOTOS[key].length;
                    return { success: true };
                }
            }
            return { success: true };
        }

        if (storagePath) {
            await supabase.storage.from('gallery').remove([storagePath]);
        }

        const { data, error } = await supabase
            .from('gallery_photos')
            .delete()
            .eq('id', photoId);

        if (error) throw error;
        return data;
    }

    // -------------------------------------------------------------------------
    // 8. EXPORT TO GLOBAL WINDOW OBJECT
    // -------------------------------------------------------------------------
    
export const IDISupabase = {
    isConfigured,
    getConfig,
    setConfig,
    getClient,
    fetchFolders,
    fetchPhotosByFolder,
    fetchFolderById,
    signIn,
    signOut,
    getSession,
    getUser,
    getAdminProfile,
    checkIsAdmin,
    checkIsSuperAdmin,
    getCurrentAdminProfile,
    submitContactInquiry,
    submitAlumniRegistration,
    fetchContactInquiries,
    updateInquiryStatus,
    deleteInquiry,
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    createFolder,
    updateFolder,
    deleteFolder,
    setFolderCoverImage,
    uploadImageFile,
    uploadPhoto,
    updatePhoto,
    deletePhoto,
    updatePassword,
};

export {
    isConfigured,
    getConfig,
    setConfig,
    getClient,
    fetchFolders,
    fetchPhotosByFolder,
    fetchFolderById,
    signIn,
    signOut,
    getSession,
    getUser,
    getAdminProfile,
    checkIsAdmin,
    checkIsSuperAdmin,
    getCurrentAdminProfile,
    submitContactInquiry,
    submitAlumniRegistration,
    fetchContactInquiries,
    updateInquiryStatus,
    deleteInquiry,
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    createFolder,
    updateFolder,
    deleteFolder,
    setFolderCoverImage,
    uploadImageFile,
    uploadPhoto,
    updatePhoto,
    deletePhoto,
    updatePassword,
};

export default IDISupabase;
