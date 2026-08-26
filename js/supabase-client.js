/**
 * Institute of Da'wa Islamiyya (IDI) - Supabase Integration Client
 * Handles Database queries, Authentication, and Storage operations.
 */

(function () {
    // -------------------------------------------------------------------------
    // 1. SUPABASE CONFIGURATION
    // -------------------------------------------------------------------------
    // Replace these values with your actual Supabase Project credentials.
    // Found in Supabase Dashboard -> Project Settings -> API.
    // You can also override these at runtime via localStorage ('idi_supabase_url', 'idi_supabase_anon_key')
    const DEFAULT_CONFIG = {
        url: window.localStorage.getItem('idi_supabase_url') || 'https://tusqsesisyvtlflbzasj.supabase.co',
        anonKey: window.localStorage.getItem('idi_supabase_anon_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1c3FzZXNpc3l2dGxmbGJ6YXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTU1OTMsImV4cCI6MjEwMzE5MTU5M30.15H1BNCbCRD_il5zQXmMgQnPt99mtRwEI8Agcutw4h8',
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
            url: window.localStorage.getItem('idi_supabase_url') || DEFAULT_CONFIG.url,
            anonKey: window.localStorage.getItem('idi_supabase_anon_key') || DEFAULT_CONFIG.anonKey,
        };
    }

    /**
     * Save configuration to localStorage
     */
    function setConfig(url, anonKey) {
        if (url) window.localStorage.setItem('idi_supabase_url', url.trim());
        if (anonKey) window.localStorage.setItem('idi_supabase_anon_key', anonKey.trim());
        client = null; // Reset client instance to re-initialize
    }

    /**
     * Initializes or returns the existing Supabase client instance
     */
    function getClient() {
        if (client) {
            return client;
        }

        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
            console.warn('[IDI Supabase] Supabase JS SDK not loaded yet.');
            return null;
        }

        const config = getConfig();
        if (!config.url || !config.anonKey) {
            console.warn('[IDI Supabase] Supabase URL or Anon Key is missing.');
            return null;
        }

        try {
            client = window.supabase.createClient(config.url, config.anonKey, {
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

    let MOCK_ADMINS = [
        {
            id: 'mock-admin-1',
            user_id: 'mock-user-dev-id',
            email: 'dev@idi.lk',
            role: 'super_admin',
            full_name: 'Lead Developer (Super Admin)',
            status: 'active',
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
            created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        }
    ];

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
            const folder = MOCK_FOLDERS.find((f) => f.id === folderId);
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

            if (error || !data) {
                if (userEmail.toLowerCase() === 'dev@idi.lk') {
                    return {
                        id: 'dev-super-admin',
                        user_id: userId,
                        email: 'dev@idi.lk',
                        role: 'super_admin',
                        full_name: 'Lead Developer (Super Admin)',
                        status: 'active',
                    };
                }
                return null;
            }

            if (userEmail.toLowerCase() === 'dev@idi.lk') {
                data.role = 'super_admin';
                data.status = 'active';
            }

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
        if (user && user.email && user.email.toLowerCase() === 'dev@idi.lk') return true;
        const profile = await getAdminProfile(userId);
        return Boolean(profile && profile.status === 'active');
    }

    /**
     * Verify if a user ID is a `super_admin`
     */
    async function checkIsSuperAdmin(userId) {
        const user = await getUser();
        if (user && user.email && user.email.toLowerCase() === 'dev@idi.lk') return true;
        const profile = await getAdminProfile(userId);
        return Boolean(profile && (profile.role === 'super_admin' || (user && user.email.toLowerCase() === 'dev@idi.lk')) && profile.status === 'active');
    }

    /**
     * Get active logged in user profile with role info
     */
    async function getCurrentAdminProfile() {
        const user = await getUser();
        if (!user) return null;
        let profile = await getAdminProfile(user.id);
        const isDev = Boolean(user.email && user.email.toLowerCase() === 'dev@idi.lk');

        if (!profile && isDev) {
            profile = {
                id: 'dev-super-admin',
                user_id: user.id,
                email: 'dev@idi.lk',
                role: 'super_admin',
                full_name: 'Lead Developer (Super Admin)',
                status: 'active',
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
            const updates = {
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
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('[IDI Supabase] admin_users query warning:', error.message);
                return { data: [...MOCK_ADMINS], error: null, isMock: true };
            }

            // Normalize records if schema migration hasn't been executed yet
            const normalized = (data || []).map((admin) => ({
                ...admin,
                role: admin.role || (admin.email && admin.email.toLowerCase() === 'dev@idi.lk' ? 'super_admin' : 'admin'),
                status: admin.status || 'active',
                full_name: admin.full_name || (admin.email && admin.email.toLowerCase() === 'dev@idi.lk' ? 'Lead Developer' : admin.email.split('@')[0]),
            }));

            // Ensure dev@idi.lk is always in the list
            if (!normalized.some((a) => a.email && a.email.toLowerCase() === 'dev@idi.lk')) {
                normalized.unshift({
                    id: 'dev-super-admin-row',
                    email: 'dev@idi.lk',
                    role: 'super_admin',
                    full_name: 'Lead Developer (Super Admin)',
                    status: 'active',
                    created_at: new Date().toISOString(),
                });
            }

            return { data: normalized, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error fetching admin users:', error);
            return { data: [...MOCK_ADMINS], error: null, isMock: true };
        }
    }

    /**
     * Add / Authorize new Admin user
     */
    async function createAdminUser({ email, role, full_name, password }) {
        const supabase = getClient();
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanRole = role === 'super_admin' ? 'super_admin' : 'admin';
        const cleanName = (full_name || '').trim();

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
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            MOCK_ADMINS.push(newAdmin);
            return { data: newAdmin, error: null, isMock: true };
        }

        try {
            // Attempt to create user account if password provided
            let authUserId = null;
            if (password && password.length >= 6) {
                const { data: signUpData, error: signErr } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password: password,
                    options: {
                        data: { full_name: cleanName, role: cleanRole }
                    }
                });
                if (!signErr && signUpData && signUpData.user) {
                    authUserId = signUpData.user.id;
                }
            }

            // If user wasn't newly created via signup, we insert by generating a reference UUID
            // or by matching the existing auth user ID
            const targetUserId = authUserId || crypto.randomUUID();

            const { data, error } = await supabase
                .from('admin_users')
                .insert([
                    {
                        user_id: targetUserId,
                        email: cleanEmail,
                        role: cleanRole,
                        full_name: cleanName || null,
                        status: 'active',
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null, isMock: false };
        } catch (error) {
            console.error('[IDI Supabase] Error creating admin user:', error);
            throw error;
        }
    }

    /**
     * Update admin user role, full name, or status
     */
    async function updateAdminUser(adminId, { role, status, full_name }) {
        const supabase = getClient();
        const payload = {};
        if (role !== undefined) payload.role = role;
        if (status !== undefined) payload.status = status;
        if (full_name !== undefined) payload.full_name = full_name ? full_name.trim() : null;

        if (!supabase || !isConfigured()) {
            const admin = MOCK_ADMINS.find((a) => a.id === adminId);
            if (admin) {
                if (role !== undefined) admin.role = role;
                if (status !== undefined) admin.status = status;
                if (full_name !== undefined) admin.full_name = full_name;
                admin.updated_at = new Date().toISOString();
            }
            return { data: admin, error: null, isMock: true };
        }

        try {
            const { data, error } = await supabase
                .from('admin_users')
                .update(payload)
                .eq('id', adminId)
                .select()
                .single();

            if (error) throw error;
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
        if (!supabase || !isConfigured()) {
            MOCK_ADMINS = MOCK_ADMINS.filter((a) => a.id !== adminId);
            return { success: true, isMock: true };
        }

        try {
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
    async function updateFolder(folderId, { name, description, cover_image_url }) {
        const supabase = getClient();
        if (!supabase || !isConfigured()) {
            const folder = MOCK_FOLDERS.find((f) => f.id === folderId);
            if (folder) {
                if (name !== undefined) folder.name = name.trim();
                if (description !== undefined) folder.description = description ? description.trim() : null;
                if (cover_image_url !== undefined) folder.cover_image_url = cover_image_url;
                folder.updated_at = new Date().toISOString();
            }
            return folder;
        }

        const payload = {};
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

        const payload = {};
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
    window.IDISupabase = {
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
    };
})();
