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
            // Query folders and count of gallery_photos
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
            const isAdmin = await checkIsAdmin(data.user.id);
            if (!isAdmin) {
                // Sign out immediately if not authorized as admin
                await supabase.auth.signOut();
                return {
                    data: null,
                    error: 'Access denied: Your account is not authorized as an administrator.',
                };
            }

            return { data, error: null };
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
     * Verify if a user ID is listed in the `admin_users` table
     */
    async function checkIsAdmin(userId) {
        if (!userId) return false;
        const supabase = getClient();
        if (!supabase) return false;

        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('id')
                .eq('user_id', userId)
                .maybeSingle();

            if (error || !data) {
                return false;
            }
            return true;
        } catch {
            return false;
        }
    }

    // -------------------------------------------------------------------------
    // 5. ADMIN FOLDER & PHOTO MANAGEMENT (CRUD)
    // -------------------------------------------------------------------------

    /**
     * Create a new gallery folder
     */
    async function createFolder({ name, description, cover_image_url }) {
        const supabase = getClient();
        if (!supabase) throw new Error('Supabase client not initialized.');

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
        if (!supabase) throw new Error('Supabase client not initialized.');

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
        if (!supabase) throw new Error('Supabase client not initialized.');

        // 1. Fetch all photo records for this folder to delete their files from Storage
        const { data: photos, error: fetchErr } = await supabase
            .from('gallery_photos')
            .select('storage_path')
            .eq('folder_id', folderId);

        if (!fetchErr && photos && photos.length > 0) {
            const filePaths = photos.map((p) => p.storage_path).filter(Boolean);
            if (filePaths.length > 0) {
                // Delete from Supabase storage
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
     * Upload an image file directly to Supabase Storage (e.g. for album cover) and return public URL
     */
    async function uploadImageFile(file, folderSlug = 'covers') {
        const supabase = getClient();
        if (!supabase) throw new Error('Supabase client not initialized.');

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type.toLowerCase())) {
            throw new Error(`Invalid file type "${file.type}". Only JPG, PNG, and WEBP are supported.`);
        }

        // Validate file size (max 8MB)
        if (file.size > 8 * 1024 * 1024) {
            throw new Error('Image file is too large. Maximum allowed size is 8MB.');
        }

        // Create safe filename and storage path
        const fileExt = file.name.split('.').pop() || 'jpg';
        const cleanSlug = (folderSlug || 'covers')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '-');
        const uniqueId = Math.random().toString(36).substring(2, 9);
        const storagePath = `${cleanSlug}/cover-${Date.now()}-${uniqueId}.${fileExt}`;

        // Upload to Supabase Storage 'gallery' bucket
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        // Get Public URL
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
        if (!supabase) throw new Error('Supabase client not initialized.');

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type.toLowerCase())) {
            throw new Error(`Invalid file type "${file.type}". Only JPG, PNG, and WEBP are supported.`);
        }

        // Create safe filename and storage path: folder-slug/timestamp-random.ext
        const fileExt = file.name.split('.').pop() || 'jpg';
        const cleanSlug = (folderSlug || folderId || 'album')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '-');
        const uniqueId = Math.random().toString(36).substring(2, 9);
        const storagePath = `${cleanSlug}/${Date.now()}-${uniqueId}.${fileExt}`;

        // 1. Upload to Supabase Storage 'gallery' bucket
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(storagePath);

        const imageUrl = publicUrlData.publicUrl;

        // 3. Insert record into `gallery_photos`
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
            // Clean up storage file if DB insert fails
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
        if (!supabase) throw new Error('Supabase client not initialized.');

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
        if (!supabase) throw new Error('Supabase client not initialized.');

        // 1. Delete from Storage if path exists
        if (storagePath) {
            await supabase.storage.from('gallery').remove([storagePath]);
        }

        // 2. Delete from Database
        const { data, error } = await supabase
            .from('gallery_photos')
            .delete()
            .eq('id', photoId);

        if (error) throw error;
        return data;
    }

    // -------------------------------------------------------------------------
    // 6. EXPORT TO GLOBAL WINDOW OBJECT
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
        checkIsAdmin,
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
