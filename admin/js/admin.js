/**
 * Institute of Da'wa Islamiyya (IDI) - Comprehensive Super Admin & Admin Controller
 * Manages Overview Analytics, Gallery Albums & Photos, Contact Inquiries, and Administrator Accounts.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // -------------------------------------------------------------------------
    // 1. STATE & VARIABLES
    // -------------------------------------------------------------------------
    let currentUser = null;
    let currentAdminProfile = null;
    let isSuperAdmin = false;
    let activeTab = 'overview';

    let allFolders = [];
    let currentFolder = null;
    let currentFolderPhotos = [];

    let allInquiries = [];
    let currentInquiryFilter = 'all';
    let inquiriesSearchQuery = '';

    let allAdmins = [];
    let pendingDeleteAction = null;

    // DOM Elements - Navigation & User Info
    const userEmailEl = document.getElementById('admin-user-email');
    const userAvatarEl = document.getElementById('admin-user-avatar');
    const userRoleBadge = document.getElementById('admin-role-badge');
    const navPortalTitle = document.getElementById('nav-portal-title');
    const btnLogout = document.getElementById('btn-logout');

    // DOM Elements - Tab Buttons & Sections
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    const tabSections = {
        overview: document.getElementById('tab-section-overview'),
        gallery: document.getElementById('tab-section-gallery'),
        inquiries: document.getElementById('tab-section-inquiries'),
        admins: document.getElementById('tab-section-admins'),
    };
    const badgeInquiriesCount = document.getElementById('badge-inquiries-count');

    // DOM Elements - Overview Stats
    const statTotalFolders = document.getElementById('stat-total-folders');
    const statTotalPhotos = document.getElementById('stat-total-photos');
    const statTotalInquiries = document.getElementById('stat-total-inquiries');
    const statNewInquiries = document.getElementById('stat-new-inquiries');
    const statTotalAdmins = document.getElementById('stat-total-admins');
    const statStorageStatus = document.getElementById('stat-storage-status');
    const overviewInquiriesList = document.getElementById('overview-inquiries-list');
    const overviewAlbumsList = document.getElementById('overview-albums-list');
    const btnOverviewAllInquiries = document.getElementById('btn-overview-all-inquiries');
    const btnOverviewCreateFolder = document.getElementById('btn-overview-create-folder');

    // DOM Elements - Gallery Management
    const foldersView = document.getElementById('admin-folders-view');
    const folderDetailView = document.getElementById('admin-folder-detail-view');
    const foldersLoading = document.getElementById('admin-folders-loading');
    const foldersGrid = document.getElementById('admin-folders-grid');
    const photosGrid = document.getElementById('admin-photos-grid');
    const btnBackToFolders = document.getElementById('btn-back-to-folders-admin');
    const detailFolderTitle = document.getElementById('detail-folder-title');
    const detailFolderDesc = document.getElementById('detail-folder-desc');
    const detailPhotoCount = document.getElementById('detail-photo-count');
    const btnEditCurrentFolder = document.getElementById('btn-edit-current-folder');
    const btnDeleteCurrentFolder = document.getElementById('btn-delete-current-folder');

    // DOM Elements - Photo Upload
    const uploadDropzone = document.getElementById('upload-dropzone');
    const photoFileInput = document.getElementById('photo-file-input');
    const uploadProgressWrap = document.getElementById('upload-progress-wrap');
    const uploadProgressBar = document.getElementById('upload-progress-bar');
    const uploadProgressStatus = document.getElementById('upload-progress-status');
    const uploadProgressPercent = document.getElementById('upload-progress-percent');

    // DOM Elements - Inquiries Management
    const inquiriesSearchInput = document.getElementById('inquiries-search-input');
    const btnClearInquiriesSearch = document.getElementById('btn-clear-inquiries-search');
    const inquiryStatusFiltersWrap = document.getElementById('inquiry-status-filters');
    const inquiriesTableWrap = document.getElementById('inquiries-table-wrap');
    const inquiriesTbody = document.getElementById('inquiries-tbody');
    const inquiriesLoading = document.getElementById('inquiries-loading');
    const inquiriesEmptyState = document.getElementById('inquiries-empty-state');
    const btnExportInquiries = document.getElementById('btn-export-inquiries');
    const btnRefreshInquiries = document.getElementById('btn-refresh-inquiries');

    // Filter Counters
    const countFilterAll = document.getElementById('count-filter-all');
    const countFilterNew = document.getElementById('count-filter-new');
    const countFilterInProgress = document.getElementById('count-filter-in_progress');
    const countFilterResolved = document.getElementById('count-filter-resolved');
    const countFilterArchived = document.getElementById('count-filter-archived');

    // DOM Elements - Admins Management
    const adminsManagementView = document.getElementById('admins-management-view');
    const adminsLockedView = document.getElementById('admins-locked-view');
    const adminsTbody = document.getElementById('admins-tbody');
    const adminsEmptyState = document.getElementById('admins-empty-state');
    const btnOpenAddAdmin = document.getElementById('btn-open-add-admin');
    const btnReturnOverview = document.getElementById('btn-return-overview');

    // DOM Elements - Modals & Forms
    const createFolderModal = document.getElementById('create-folder-modal');
    const btnOpenCreateFolder = document.getElementById('btn-open-create-folder');
    const createFolderForm = document.getElementById('create-folder-form');
    const createFolderCoverFile = document.getElementById('create-folder-cover-file');
    const createCoverDropzone = document.getElementById('create-cover-dropzone');
    const createCoverPlaceholder = document.getElementById('create-cover-placeholder');
    const createCoverPreviewWrap = document.getElementById('create-cover-preview-wrap');
    const createCoverPreviewImg = document.getElementById('create-cover-preview-img');
    const btnChangeCreateCover = document.getElementById('btn-change-create-cover');
    const btnRemoveCreateCover = document.getElementById('btn-remove-create-cover');

    const editFolderModal = document.getElementById('edit-folder-modal');
    const editFolderForm = document.getElementById('edit-folder-form');
    const editFolderCoverFile = document.getElementById('edit-folder-cover-file');
    const editFolderCoverCurrent = document.getElementById('edit-folder-cover-current');
    const editCoverDropzone = document.getElementById('edit-cover-dropzone');
    const editCoverPlaceholder = document.getElementById('edit-cover-placeholder');
    const editCoverPreviewWrap = document.getElementById('edit-cover-preview-wrap');
    const editCoverPreviewImg = document.getElementById('edit-cover-preview-img');
    const btnChangeEditCover = document.getElementById('btn-change-edit-cover');
    const btnRemoveEditCover = document.getElementById('btn-remove-edit-cover');

    const editPhotoModal = document.getElementById('edit-photo-modal');
    const editPhotoForm = document.getElementById('edit-photo-form');

    // Inquiry Detail Modal
    const inquiryDetailModal = document.getElementById('inquiry-detail-modal');
    const modalInquiryId = document.getElementById('modal-inquiry-id');
    const modalInquiryAvatar = document.getElementById('modal-inquiry-avatar');
    const modalInquiryName = document.getElementById('modal-inquiry-name');
    const modalInquiryCity = document.getElementById('modal-inquiry-city');
    const modalInquiryDate = document.getElementById('modal-inquiry-date');
    const modalInquiryCallBtn = document.getElementById('modal-inquiry-call-btn');
    const modalInquiryEmailBtn = document.getElementById('modal-inquiry-email-btn');
    const modalInquiryWaBtn = document.getElementById('modal-inquiry-wa-btn');
    const modalInquirySubject = document.getElementById('modal-inquiry-subject');
    const modalInquiryMessage = document.getElementById('modal-inquiry-message');
    const modalInquiryStatusSelect = document.getElementById('modal-inquiry-status-select');
    const modalInquiryNotes = document.getElementById('modal-inquiry-notes');
    const btnSaveInquiryUpdates = document.getElementById('btn-save-inquiry-updates');
    const btnModalDeleteInquiry = document.getElementById('btn-modal-delete-inquiry');

    // Add / Edit Admin Modals
    const addAdminModal = document.getElementById('add-admin-modal');
    const addAdminForm = document.getElementById('add-admin-form');
    const addAdminFullname = document.getElementById('add-admin-fullname');
    const addAdminEmail = document.getElementById('add-admin-email');
    const addAdminRole = document.getElementById('add-admin-role');
    const addAdminPassword = document.getElementById('add-admin-password');

    const editAdminModal = document.getElementById('edit-admin-modal');
    const editAdminForm = document.getElementById('edit-admin-form');
    const editAdminId = document.getElementById('edit-admin-id');
    const editAdminEmail = document.getElementById('edit-admin-email');
    const editAdminFullname = document.getElementById('edit-admin-fullname');
    const editAdminRole = document.getElementById('edit-admin-role');
    const editAdminStatus = document.getElementById('edit-admin-status');

    // Delete Confirmation Modal
    const deleteModal = document.getElementById('delete-modal');
    const deleteModalMsg = document.getElementById('delete-modal-message');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');

    // Config Modal
    const adminConfigModal = document.getElementById('admin-config-modal');
    const btnAdminConfig = document.getElementById('btn-admin-config');
    const admCfgUrl = document.getElementById('adm-cfg-url');
    const admCfgKey = document.getElementById('adm-cfg-key');
    const admCfgStatus = document.getElementById('adm-cfg-status');
    const btnSaveAdminConfig = document.getElementById('btn-save-admin-config');

    const toastContainer = document.getElementById('toast-container');

    // -------------------------------------------------------------------------
    // 2. AUTHENTICATION & ROLE-BASED GUARD
    // -------------------------------------------------------------------------

    async function checkAuth() {
        if (!window.IDISupabase.isConfigured()) {
            console.warn('[Admin] Running in demo / unconfigured mode.');
            currentUser = { id: 'demo-user', email: 'dev@idi.lk' };
            currentAdminProfile = {
                id: 'mock-admin-dev',
                role: 'super_admin',
                full_name: 'Lead Developer (Super Admin)',
                status: 'active',
            };
            isSuperAdmin = true;

            applyRoleUi();
            statStorageStatus.textContent = 'Demo Mode';
            statStorageStatus.style.color = 'var(--accent-gold)';
            return;
        }

        try {
            currentUser = await window.IDISupabase.getUser();

            if (!currentUser) {
                window.location.replace('login.html');
                return;
            }

            const profileRes = await window.IDISupabase.getCurrentAdminProfile();
            if (!profileRes || !profileRes.profile || profileRes.profile.status === 'suspended') {
                await window.IDISupabase.signOut();
                alert('Access Denied: Your account is not authorized or is currently suspended.');
                window.location.replace('login.html');
                return;
            }

            currentAdminProfile = profileRes.profile;
            isSuperAdmin = Boolean(profileRes.isSuperAdmin || (currentUser?.email && currentUser.email.toLowerCase() === 'dev@idi.lk'));

            applyRoleUi();
            statStorageStatus.textContent = 'Live Connected';
            statStorageStatus.style.color = 'var(--accent-emerald)';
        } catch (error) {
            console.error('Auth verification error:', error);
            window.location.replace('login.html');
        }
    }

    function applyRoleUi() {
        const email = currentUser?.email || 'admin@idi.lk';
        const name = currentAdminProfile?.full_name || email.split('@')[0];

        userEmailEl.textContent = email;
        userAvatarEl.textContent = (name[0] || email[0] || 'A').toUpperCase();

        const isSuper = Boolean(isSuperAdmin || (email && email.toLowerCase() === 'dev@idi.lk'));

        const tabAdmins = document.getElementById('tab-btn-admins');
        const cardAdmins = document.getElementById('stat-card-admins');
        const cardDb = document.getElementById('stat-card-db-status');

        if (isSuper) {
            userRoleBadge.className = 'role-pill role-super-admin';
            userRoleBadge.textContent = 'Super Admin';
            navPortalTitle.textContent = 'Super Admin Portal';
            if (btnModalDeleteInquiry) btnModalDeleteInquiry.style.display = 'inline-flex';
            if (btnAdminConfig) btnAdminConfig.style.display = 'inline-flex';
            if (tabAdmins) tabAdmins.style.display = 'inline-flex';
            if (cardAdmins) cardAdmins.style.display = 'flex';
            if (cardDb) cardDb.style.display = 'flex';
        } else {
            userRoleBadge.className = 'role-pill role-admin';
            userRoleBadge.textContent = 'Admin';
            navPortalTitle.textContent = 'Admin Management Portal';
            if (btnModalDeleteInquiry) btnModalDeleteInquiry.style.display = 'none';
            if (btnAdminConfig) btnAdminConfig.style.display = 'none';
            if (tabAdmins) tabAdmins.style.display = 'none';
            if (cardAdmins) cardAdmins.style.display = 'none';
            if (cardDb) cardDb.style.display = 'none';
        }
    }

    btnLogout.addEventListener('click', async () => {
        await window.IDISupabase.signOut();
        window.location.replace('login.html');
    });

    // -------------------------------------------------------------------------
    // 3. TAB NAVIGATION CONTROLLER
    // -------------------------------------------------------------------------

    function switchTab(tabKey) {
        const isSuper = Boolean(isSuperAdmin || (currentUser?.email && currentUser.email.toLowerCase() === 'dev@idi.lk'));
        if (!isSuper && tabKey === 'admins') {
            tabKey = 'overview';
        }
        if (!tabSections[tabKey]) return;
        activeTab = tabKey;

        // Update button active state
        tabButtons.forEach((btn) => {
            if (btn.dataset.tab === tabKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update sections active state
        Object.keys(tabSections).forEach((key) => {
            if (key === tabKey) {
                tabSections[key].classList.add('active');
            } else {
                tabSections[key].classList.remove('active');
            }
        });

        // Specific tab data load
        if (tabKey === 'overview') {
            loadOverviewData();
        } else if (tabKey === 'gallery') {
            loadGalleryData();
        } else if (tabKey === 'inquiries') {
            loadInquiriesData();
        } else if (tabKey === 'admins') {
            loadAdminsData();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            switchTab(target);
        });
    });

    // Stat card click shortcuts
    document.querySelectorAll('.stat-card[data-action]').forEach((card) => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            if (action === 'goto-gallery') switchTab('gallery');
            if (action === 'goto-inquiries') switchTab('inquiries');
            if (action === 'goto-admins') switchTab('admins');
        });
    });

    if (btnOverviewAllInquiries) {
        btnOverviewAllInquiries.addEventListener('click', () => switchTab('inquiries'));
    }
    if (btnOverviewCreateFolder) {
        btnOverviewCreateFolder.addEventListener('click', () => {
            switchTab('gallery');
            openModal(createFolderModal);
        });
    }
    if (btnReturnOverview) {
        btnReturnOverview.addEventListener('click', () => switchTab('overview'));
    }

    // -------------------------------------------------------------------------
    // 4. OVERVIEW DASHBOARD
    // -------------------------------------------------------------------------

    async function loadOverviewData() {
        await Promise.all([
            loadGalleryFoldersList(),
            loadInquiriesList(false),
            loadAdminsList(false),
        ]);
        updateOverviewWidgets();
    }

    function updateOverviewWidgets() {
        // Stats
        statTotalFolders.textContent = allFolders.length;
        const totalPhotos = allFolders.reduce((sum, f) => sum + (f.photo_count || 0), 0);
        statTotalPhotos.textContent = totalPhotos;

        statTotalInquiries.textContent = allInquiries.length;
        const newCount = allInquiries.filter((i) => i.status === 'new').length;
        statNewInquiries.textContent = newCount;
        statTotalAdmins.textContent = allAdmins.length;

        // Badge on Inquiries Tab
        if (newCount > 0) {
            badgeInquiriesCount.textContent = newCount;
            badgeInquiriesCount.style.display = 'inline-block';
        } else {
            badgeInquiriesCount.style.display = 'none';
        }

        // Recent Inquiries List in Overview
        overviewInquiriesList.replaceChildren();
        const recentInquiries = allInquiries.slice(0, 4);

        if (recentInquiries.length === 0) {
            overviewInquiriesList.innerHTML = '<p style="color:var(--text-muted); font-size:0.88rem; text-align:center; padding:1.5rem 0;">No inquiries received yet.</p>';
        } else {
            recentInquiries.forEach((inq) => {
                const item = document.createElement('div');
                item.className = 'overview-item';
                item.innerHTML = `
                    <div class="overview-item-info">
                        <h5>${escapeHtml(inq.name)} <span style="font-weight: normal; color: var(--text-muted); font-size: 0.8rem;">(${escapeHtml(inq.city || 'General')})</span></h5>
                        <span>${escapeHtml(inq.subject || inq.message.substring(0, 45))}</span>
                    </div>
                    <div>
                        <span class="status-badge status-${inq.status}">${formatStatusLabel(inq.status)}</span>
                    </div>
                `;
                item.addEventListener('click', () => openInquiryDetailModal(inq));
                overviewInquiriesList.appendChild(item);
            });
        }

        // Recent Albums List in Overview
        overviewAlbumsList.replaceChildren();
        const recentAlbums = allFolders.slice(0, 4);

        if (recentAlbums.length === 0) {
            overviewAlbumsList.innerHTML = '<p style="color:var(--text-muted); font-size:0.88rem; text-align:center; padding:1.5rem 0;">No albums created yet.</p>';
        } else {
            recentAlbums.forEach((album) => {
                const item = document.createElement('div');
                item.className = 'overview-item';
                item.innerHTML = `
                    <div class="overview-item-info">
                        <h5>${escapeHtml(album.name)}</h5>
                        <span><i class="fa-regular fa-image"></i> ${album.photo_count || 0} Photos</span>
                    </div>
                    <button class="btn btn-secondary btn-sm"><i class="fa-solid fa-folder-open"></i> Manage</button>
                `;
                item.addEventListener('click', () => {
                    switchTab('gallery');
                    openFolderDetail(album);
                });
                overviewAlbumsList.appendChild(item);
            });
        }
    }

    // -------------------------------------------------------------------------
    // 5. GALLERY MANAGEMENT
    // -------------------------------------------------------------------------

    async function loadGalleryData() {
        await loadGalleryFoldersList();
        renderFoldersGrid();
    }

    async function loadGalleryFoldersList() {
        try {
            const res = await window.IDISupabase.fetchFolders();
            if (res.error) {
                showToast(res.error, 'error');
                return;
            }
            allFolders = res.data || [];
        } catch (err) {
            console.error('Folders fetch error:', err);
        }
    }

    function renderFoldersGrid() {
        foldersGrid.replaceChildren();

        if (allFolders.length === 0) {
            foldersGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                    <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 0.75rem;"></i>
                    <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">No albums created yet</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">Create your first album folder to start uploading photographs.</p>
                    <button class="btn btn-primary" id="btn-empty-create-folder"><i class="fa-solid fa-plus"></i> Create Folder</button>
                </div>
            `;
            const emptyBtn = document.getElementById('btn-empty-create-folder');
            if (emptyBtn) emptyBtn.addEventListener('click', () => openModal(createFolderModal));
            return;
        }

        const fragment = document.createDocumentFragment();

        allFolders.forEach((folder) => {
            const card = document.createElement('div');
            card.className = 'admin-folder-card';

            const coverWrap = document.createElement('div');
            coverWrap.className = 'admin-folder-cover';

            if (folder.cover_image_url) {
                const img = document.createElement('img');
                img.src = folder.cover_image_url;
                img.alt = folder.name;
                img.loading = 'lazy';
                coverWrap.appendChild(img);
            } else {
                coverWrap.innerHTML = '<div class="admin-folder-cover-empty" style="height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.7); font-size:2.5rem;"><i class="fa-solid fa-folder"></i></div>';
            }

            const badge = document.createElement('div');
            badge.className = 'admin-folder-badge';
            const count = folder.photo_count || 0;
            badge.innerHTML = `<i class="fa-regular fa-image"></i> ${count} ${count === 1 ? 'Photo' : 'Photos'}`;
            coverWrap.appendChild(badge);
            card.appendChild(coverWrap);

            const body = document.createElement('div');
            body.className = 'admin-folder-body';

            const title = document.createElement('h3');
            title.className = 'admin-folder-title';
            title.textContent = folder.name;
            body.appendChild(title);

            const desc = document.createElement('p');
            desc.className = 'admin-folder-desc';
            desc.textContent = folder.description || 'No description provided.';
            body.appendChild(desc);

            const actions = document.createElement('div');
            actions.className = 'admin-folder-actions';

            const btnOpen = document.createElement('button');
            btnOpen.className = 'btn btn-primary btn-sm';
            btnOpen.innerHTML = '<i class="fa-solid fa-images"></i> Photos';
            btnOpen.addEventListener('click', () => openFolderDetail(folder));

            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn btn-secondary btn-sm';
            btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i>';
            btnEdit.title = 'Edit Folder';
            btnEdit.addEventListener('click', () => openEditFolderModal(folder));

            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-danger btn-sm';
            btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
            btnDelete.title = 'Delete Folder';
            btnDelete.addEventListener('click', () => confirmDeleteFolder(folder));

            actions.appendChild(btnOpen);
            const btnGroup = document.createElement('div');
            btnGroup.style.display = 'flex';
            btnGroup.style.gap = '0.35rem';
            btnGroup.appendChild(btnEdit);
            btnGroup.appendChild(btnDelete);
            actions.appendChild(btnGroup);

            body.appendChild(actions);
            card.appendChild(body);
            fragment.appendChild(card);
        });

        foldersGrid.appendChild(fragment);
    }

    async function openFolderDetail(folder) {
        currentFolder = folder;
        foldersView.style.display = 'none';
        folderDetailView.style.display = 'block';

        detailFolderTitle.textContent = folder.name;
        detailFolderDesc.textContent = folder.description || 'No description provided.';
        detailPhotoCount.textContent = `${folder.photo_count || 0} Photos`;

        await loadFolderPhotos(folder.id);
        window.scrollTo({ top: folderDetailView.offsetTop - 80, behavior: 'smooth' });
    }

    btnBackToFolders.addEventListener('click', () => {
        currentFolder = null;
        currentFolderPhotos = [];
        folderDetailView.style.display = 'none';
        foldersView.style.display = 'block';
        loadGalleryData();
    });

    async function loadFolderPhotos(folderId) {
        photosGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem;"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--accent-emerald);"></i><p style="margin-top:0.5rem; color:var(--text-muted);">Loading photos...</p></div>';

        try {
            const res = await window.IDISupabase.fetchPhotosByFolder(folderId);
            if (res.error) {
                showToast(res.error, 'error');
                return;
            }

            currentFolderPhotos = res.data || [];
            detailPhotoCount.textContent = `${currentFolderPhotos.length} ${currentFolderPhotos.length === 1 ? 'Photo' : 'Photos'}`;
            renderPhotosGrid();
        } catch (error) {
            showToast(error.message || 'Failed to fetch photos', 'error');
        }
    }

    function renderPhotosGrid() {
        photosGrid.replaceChildren();

        if (currentFolderPhotos.length === 0) {
            photosGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                    <i class="fa-regular fa-image" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">No photos in this album yet. Upload photos using the box above.</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        currentFolderPhotos.forEach((photo) => {
            const card = document.createElement('div');
            card.className = 'admin-photo-card';

            const thumb = document.createElement('div');
            thumb.className = 'admin-photo-thumb';

            const img = document.createElement('img');
            img.src = photo.image_url;
            img.alt = photo.title || 'Photo';
            img.loading = 'lazy';
            thumb.appendChild(img);

            if (currentFolder && currentFolder.cover_image_url === photo.image_url) {
                const coverTag = document.createElement('span');
                coverTag.className = 'cover-badge-tag';
                coverTag.innerHTML = '<i class="fa-solid fa-star"></i> Cover';
                thumb.appendChild(coverTag);
            }

            card.appendChild(thumb);

            const body = document.createElement('div');
            body.className = 'admin-photo-body';

            const title = document.createElement('div');
            title.className = 'admin-photo-title';
            title.textContent = photo.title || 'Untitled Photo';
            title.title = photo.title || '';
            body.appendChild(title);

            const actions = document.createElement('div');
            actions.className = 'admin-photo-actions';

            const btnCover = document.createElement('button');
            btnCover.className = 'btn btn-secondary btn-sm';
            btnCover.innerHTML = '<i class="fa-regular fa-star"></i>';
            btnCover.title = 'Set as Album Cover';
            btnCover.addEventListener('click', () => setCoverImage(photo.image_url));

            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn btn-secondary btn-sm';
            btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i>';
            btnEdit.title = 'Edit Caption';
            btnEdit.addEventListener('click', () => openEditPhotoModal(photo));

            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-danger btn-sm';
            btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
            btnDelete.title = 'Delete Photo';
            btnDelete.addEventListener('click', () => confirmDeletePhoto(photo));

            actions.appendChild(btnCover);
            actions.appendChild(btnEdit);
            actions.appendChild(btnDelete);

            body.appendChild(actions);
            card.appendChild(body);
            fragment.appendChild(card);
        });

        photosGrid.appendChild(fragment);
    }

    async function setCoverImage(imageUrl) {
        if (!currentFolder) return;
        try {
            await window.IDISupabase.setFolderCoverImage(currentFolder.id, imageUrl);
            currentFolder.cover_image_url = imageUrl;
            showToast('Album cover image updated!', 'success');
            renderPhotosGrid();
        } catch (error) {
            showToast(error.message || 'Failed to update cover image', 'error');
        }
    }

    // Multi-photo upload dropzone
    if (uploadDropzone) {
        uploadDropzone.addEventListener('click', () => photoFileInput.click());

        uploadDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDropzone.style.borderColor = 'var(--accent-emerald)';
            uploadDropzone.style.background = 'var(--accent-emerald-faint)';
        });

        ['dragleave', 'dragend'].forEach((evt) => {
            uploadDropzone.addEventListener(evt, () => {
                uploadDropzone.style.borderColor = '';
                uploadDropzone.style.background = '';
            });
        });

        uploadDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropzone.style.borderColor = '';
            uploadDropzone.style.background = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handlePhotoUploads(e.dataTransfer.files);
            }
        });

        photoFileInput.addEventListener('change', () => {
            if (photoFileInput.files && photoFileInput.files.length > 0) {
                handlePhotoUploads(photoFileInput.files);
            }
        });
    }

    async function handlePhotoUploads(fileList) {
        if (!currentFolder) return;
        const allSelected = Array.from(fileList);
        const webpFiles = allSelected.filter((f) => f.type === 'image/webp' || f.name.toLowerCase().endsWith('.webp'));
        const nonWebpFiles = allSelected.filter((f) => !(f.type === 'image/webp' || f.name.toLowerCase().endsWith('.webp')));

        if (nonWebpFiles.length > 0 && webpFiles.length === 0) {
            showToast('Only WEBP (.webp) format photos are allowed. Please convert your images to WEBP.', 'error');
            photoFileInput.value = '';
            return;
        }

        if (nonWebpFiles.length > 0) {
            showToast(`Skipped ${nonWebpFiles.length} non-WEBP file(s). Only .webp is supported.`, 'error');
        }

        const files = webpFiles;
        if (files.length === 0) return;

        uploadProgressWrap.style.display = 'block';
        uploadProgressBar.style.width = '0%';
        uploadProgressPercent.textContent = '0%';

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const percent = Math.round(((i + 1) / files.length) * 100);
            uploadProgressStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Uploading ${i + 1} of ${files.length}: <strong>${escapeHtml(file.name)}</strong>`;
            uploadProgressBar.style.width = `${percent}%`;
            uploadProgressPercent.textContent = `${percent}%`;

            try {
                const newPhoto = await window.IDISupabase.uploadPhoto(file, currentFolder.id, currentFolder.name);
                currentFolderPhotos.unshift(newPhoto);

                // If folder had no cover, set first photo as cover
                if (!currentFolder.cover_image_url) {
                    await setCoverImage(newPhoto.image_url);
                }
                successCount++;
            } catch (err) {
                console.error(`Failed to upload ${file.name}:`, err);
                failCount++;
            }
        }

        setTimeout(() => {
            uploadProgressWrap.style.display = 'none';
            photoFileInput.value = '';
        }, 1200);

        if (failCount === 0) {
            showToast(`Successfully uploaded ${successCount} WEBP photo(s)!`, 'success');
        } else {
            showToast(`Uploaded ${successCount} photo(s) (${failCount} failed).`, 'error');
        }

        detailPhotoCount.textContent = `${currentFolderPhotos.length} Photos`;
        renderPhotosGrid();
    }

    // -------------------------------------------------------------------------
    // 6. CONTACT FORM INQUIRIES MANAGEMENT
    // -------------------------------------------------------------------------

    async function loadInquiriesData() {
        inquiriesLoading.style.display = 'block';
        inquiriesTableWrap.style.display = 'none';
        inquiriesEmptyState.style.display = 'none';

        await loadInquiriesList(true);

        inquiriesLoading.style.display = 'none';
        applyInquiriesFilter();
    }

    async function loadInquiriesList(renderAfter = true) {
        try {
            const res = await window.IDISupabase.fetchContactInquiries();
            if (res.error) {
                showToast(res.error, 'error');
                return;
            }
            allInquiries = res.data || [];
            updateInquiriesFilterPills();
            if (renderAfter) applyInquiriesFilter();
        } catch (err) {
            console.error('Inquiries fetch error:', err);
        }
    }

    function updateInquiriesFilterPills() {
        countFilterAll.textContent = allInquiries.length;
        countFilterNew.textContent = allInquiries.filter((i) => i.status === 'new').length;
        countFilterInProgress.textContent = allInquiries.filter((i) => i.status === 'in_progress').length;
        countFilterResolved.textContent = allInquiries.filter((i) => i.status === 'resolved').length;
        countFilterArchived.textContent = allInquiries.filter((i) => i.status === 'archived').length;

        const newCount = allInquiries.filter((i) => i.status === 'new').length;
        if (newCount > 0) {
            badgeInquiriesCount.textContent = newCount;
            badgeInquiriesCount.style.display = 'inline-block';
        } else {
            badgeInquiriesCount.style.display = 'none';
        }
    }

    function applyInquiriesFilter() {
        let filtered = [...allInquiries];

        // 1. Status Filter
        if (currentInquiryFilter !== 'all') {
            filtered = filtered.filter((i) => i.status === currentInquiryFilter);
        }

        // 2. Search Query Filter
        if (inquiriesSearchQuery.trim()) {
            const q = inquiriesSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(
                (i) =>
                    (i.name && i.name.toLowerCase().includes(q)) ||
                    (i.email && i.email.toLowerCase().includes(q)) ||
                    (i.phone && i.phone.toLowerCase().includes(q)) ||
                    (i.city && i.city.toLowerCase().includes(q)) ||
                    (i.message && i.message.toLowerCase().includes(q)) ||
                    (i.subject && i.subject.toLowerCase().includes(q))
            );
        }

        renderInquiriesTable(filtered);
    }

    function renderInquiriesTable(inquiries) {
        inquiriesTbody.replaceChildren();

        if (inquiries.length === 0) {
            inquiriesTableWrap.style.display = 'none';
            inquiriesEmptyState.style.display = 'block';
            return;
        }

        inquiriesTableWrap.style.display = 'block';
        inquiriesEmptyState.style.display = 'none';

        const fragment = document.createDocumentFragment();

        inquiries.forEach((inq) => {
            const tr = document.createElement('tr');

            // Sender
            const tdSender = document.createElement('td');
            tdSender.innerHTML = `
                <div style="font-weight: 700; color: var(--text-primary);">${escapeHtml(inq.name)}</div>
            `;

            // Contact
            const tdContact = document.createElement('td');
            let contactHtml = '';
            if (inq.phone) {
                contactHtml += `<div><a href="tel:${escapeHtml(inq.phone)}" style="color: var(--accent-emerald); text-decoration: none; font-weight: 600;"><i class="fa-solid fa-phone" style="font-size: 0.8rem;"></i> ${escapeHtml(inq.phone)}</a></div>`;
            }
            if (inq.email) {
                contactHtml += `<div><a href="mailto:${escapeHtml(inq.email)}" style="color: var(--text-muted); text-decoration: none; font-size: 0.82rem;"><i class="fa-solid fa-envelope" style="font-size: 0.75rem;"></i> ${escapeHtml(inq.email)}</a></div>`;
            }
            tdContact.innerHTML = contactHtml || '<span style="color: var(--text-muted); font-size: 0.8rem;">No contact info</span>';

            // City
            const tdCity = document.createElement('td');
            tdCity.textContent = inq.city || '—';

            // Subject & Excerpt
            const tdMessage = document.createElement('td');
            tdMessage.style.maxWidth = '280px';
            const subjectTxt = inq.subject ? `<strong>${escapeHtml(inq.subject)}</strong>: ` : '';
            tdMessage.innerHTML = `
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px;">
                    ${subjectTxt}${escapeHtml(inq.message)}
                </div>
            `;

            // Status Badge
            const tdStatus = document.createElement('td');
            tdStatus.innerHTML = `<span class="status-badge status-${inq.status}">${formatStatusLabel(inq.status)}</span>`;

            // Date
            const tdDate = document.createElement('td');
            tdDate.style.fontSize = '0.82rem';
            tdDate.style.color = 'var(--text-muted)';
            tdDate.textContent = formatDate(inq.created_at);

            // Actions
            const tdActions = document.createElement('td');
            tdActions.style.textAlign = 'right';

            const btnView = document.createElement('button');
            btnView.className = 'btn btn-secondary btn-sm';
            btnView.innerHTML = '<i class="fa-solid fa-eye"></i> View';
            btnView.addEventListener('click', () => openInquiryDetailModal(inq));
            tdActions.appendChild(btnView);

            tr.appendChild(tdSender);
            tr.appendChild(tdContact);
            tr.appendChild(tdCity);
            tr.appendChild(tdMessage);
            tr.appendChild(tdStatus);
            tr.appendChild(tdDate);
            tr.appendChild(tdActions);

            fragment.appendChild(tr);
        });

        inquiriesTbody.appendChild(fragment);
    }

    // Inquiries Search & Filter Listeners
    inquiriesSearchInput.addEventListener('input', (e) => {
        inquiriesSearchQuery = e.target.value;
        btnClearInquiriesSearch.style.display = inquiriesSearchQuery ? 'block' : 'none';
        applyInquiriesFilter();
    });

    btnClearInquiriesSearch.addEventListener('click', () => {
        inquiriesSearchInput.value = '';
        inquiriesSearchQuery = '';
        btnClearInquiriesSearch.style.display = 'none';
        applyInquiriesFilter();
    });

    inquiryStatusFiltersWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        inquiryStatusFiltersWrap.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        currentInquiryFilter = btn.dataset.status;
        applyInquiriesFilter();
    });

    btnRefreshInquiries.addEventListener('click', () => {
        loadInquiriesData();
        showToast('Inquiries refreshed.', 'success');
    });

    // CSV Export
    btnExportInquiries.addEventListener('click', () => {
        if (allInquiries.length === 0) {
            showToast('No inquiries available to export.', 'error');
            return;
        }

        const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Subject', 'Message', 'Status', 'Admin Notes', 'Received At'];
        const rows = allInquiries.map((inq) => [
            inq.id,
            `"${(inq.name || '').replace(/"/g, '""')}"`,
            `"${(inq.email || '').replace(/"/g, '""')}"`,
            `"${(inq.phone || '').replace(/"/g, '""')}"`,
            `"${(inq.city || '').replace(/"/g, '""')}"`,
            `"${(inq.subject || '').replace(/"/g, '""')}"`,
            `"${(inq.message || '').replace(/"/g, '""')}"`,
            inq.status,
            `"${(inq.admin_notes || '').replace(/"/g, '""')}"`,
            inq.created_at,
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `idi_contact_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV export downloaded!', 'success');
    });

    // Inquiry Detail Modal
    function openInquiryDetailModal(inquiry) {
        modalInquiryId.value = inquiry.id;
        modalInquiryAvatar.textContent = (inquiry.name[0] || 'M').toUpperCase();
        modalInquiryName.textContent = inquiry.name;
        modalInquiryCity.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${escapeHtml(inquiry.city || 'Not specified')}`;
        modalInquiryDate.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatDate(inquiry.created_at)}`;

        // Direct contact shortcuts
        if (inquiry.phone) {
            modalInquiryCallBtn.href = `tel:${inquiry.phone}`;
            modalInquiryCallBtn.style.display = 'inline-flex';

            const cleanPhone = inquiry.phone.replace(/[^0-9]/g, '');
            modalInquiryWaBtn.href = `https://wa.me/${cleanPhone}`;
            modalInquiryWaBtn.style.display = 'inline-flex';
        } else {
            modalInquiryCallBtn.style.display = 'none';
            modalInquiryWaBtn.style.display = 'none';
        }

        if (inquiry.email) {
            modalInquiryEmailBtn.href = `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject || 'Inquiry')}`;
            modalInquiryEmailBtn.style.display = 'inline-flex';
        } else {
            modalInquiryEmailBtn.style.display = 'none';
        }

        modalInquirySubject.textContent = inquiry.subject || 'General Inquiry';
        modalInquiryMessage.textContent = inquiry.message;
        modalInquiryStatusSelect.value = inquiry.status || 'new';
        modalInquiryNotes.value = inquiry.admin_notes || '';

        // Only super admin can delete inquiries
        if (btnModalDeleteInquiry) {
            btnModalDeleteInquiry.style.display = isSuperAdmin ? 'inline-flex' : 'none';
        }

        openModal(inquiryDetailModal);
    }

    btnSaveInquiryUpdates.addEventListener('click', async () => {
        const id = modalInquiryId.value;
        const status = modalInquiryStatusSelect.value;
        const notes = modalInquiryNotes.value.trim();

        try {
            btnSaveInquiryUpdates.disabled = true;
            btnSaveInquiryUpdates.textContent = 'Saving...';

            await window.IDISupabase.updateInquiryStatus(id, status, notes);

            // Update in local array
            const found = allInquiries.find((i) => i.id === id);
            if (found) {
                found.status = status;
                found.admin_notes = notes;
            }

            showToast('Inquiry status and notes saved!', 'success');
            closeModal(inquiryDetailModal);
            updateInquiriesFilterPills();
            applyInquiriesFilter();
            updateOverviewWidgets();
        } catch (err) {
            showToast(err.message || 'Failed to update inquiry', 'error');
        } finally {
            btnSaveInquiryUpdates.disabled = false;
            btnSaveInquiryUpdates.textContent = 'Save Status & Notes';
        }
    });

    if (btnModalDeleteInquiry) {
        btnModalDeleteInquiry.addEventListener('click', () => {
            const id = modalInquiryId.value;
            closeModal(inquiryDetailModal);
            confirmDelete({
                message: 'Are you sure you want to permanently delete this contact inquiry record?',
                onConfirm: async () => {
                    try {
                        await window.IDISupabase.deleteInquiry(id);
                        allInquiries = allInquiries.filter((i) => i.id !== id);
                        showToast('Inquiry deleted successfully.', 'success');
                        updateInquiriesFilterPills();
                        applyInquiriesFilter();
                        updateOverviewWidgets();
                    } catch (err) {
                        showToast(err.message || 'Failed to delete inquiry', 'error');
                    }
                },
            });
        });
    }

    // -------------------------------------------------------------------------
    // 7. ADMIN USER MANAGEMENT (Super Admin Only)
    // -------------------------------------------------------------------------

    async function loadAdminsData() {
        if (!isSuperAdmin) {
            adminsManagementView.style.display = 'none';
            adminsLockedView.style.display = 'block';
            return;
        }

        adminsManagementView.style.display = 'block';
        adminsLockedView.style.display = 'none';

        await loadAdminsList(true);
    }

    async function loadAdminsList(renderAfter = true) {
        try {
            const res = await window.IDISupabase.fetchAdminUsers();
            if (res.error) {
                showToast(res.error, 'error');
                return;
            }
            allAdmins = res.data || [];
            if (renderAfter && isSuperAdmin) renderAdminsTable();
        } catch (err) {
            console.error('Admins fetch error:', err);
        }
    }

    function renderAdminsTable() {
        adminsTbody.replaceChildren();

        if (allAdmins.length === 0) {
            adminsEmptyState.style.display = 'block';
            return;
        }

        adminsEmptyState.style.display = 'none';
        const fragment = document.createDocumentFragment();

        allAdmins.forEach((admin) => {
            const tr = document.createElement('tr');

            // Administrator name & avatar
            const tdAdmin = document.createElement('td');
            const name = admin.full_name || admin.email.split('@')[0];
            tdAdmin.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: ${admin.role === 'super_admin' ? 'linear-gradient(135deg, #b8860b, #daa520)' : 'var(--accent-emerald)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem;">
                        ${(name[0] || 'A').toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight: 700; color: var(--text-primary);">${escapeHtml(name)}</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">${admin.user_id === currentUser?.id ? '(Current Session)' : ''}</div>
                    </div>
                </div>
            `;

            // Email
            const tdEmail = document.createElement('td');
            tdEmail.textContent = admin.email;

            // Role
            const isSuper = admin.role === 'super_admin' || (admin.email && admin.email.toLowerCase() === 'dev@idi.lk');
            const tdRole = document.createElement('td');
            tdRole.innerHTML = isSuper ? '<span class="role-pill role-super-admin">Super Admin</span>' : '<span class="role-pill role-admin">Admin</span>';

            // Status
            const tdStatus = document.createElement('td');
            tdStatus.innerHTML = `<span class="status-badge status-${admin.status}">${formatStatusLabel(admin.status)}</span>`;

            // Created Date
            const tdDate = document.createElement('td');
            tdDate.style.fontSize = '0.85rem';
            tdDate.style.color = 'var(--text-muted)';
            tdDate.textContent = formatDate(admin.created_at);

            // Actions
            const tdActions = document.createElement('td');
            tdActions.style.textAlign = 'right';

            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn btn-secondary btn-sm';
            btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';
            btnEdit.addEventListener('click', () => openEditAdminModal(admin));

            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-danger btn-sm';
            btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
            btnDelete.title = 'Remove Admin';
            btnDelete.style.marginLeft = '0.4rem';

            // Prevent deleting own active session
            if (admin.user_id === currentUser?.id) {
                btnDelete.disabled = true;
                btnDelete.title = 'Cannot remove own active account';
                btnDelete.style.opacity = '0.5';
            } else {
                btnDelete.addEventListener('click', () => confirmDeleteAdmin(admin));
            }

            tdActions.appendChild(btnEdit);
            tdActions.appendChild(btnDelete);

            tr.appendChild(tdAdmin);
            tr.appendChild(tdEmail);
            tr.appendChild(tdRole);
            tr.appendChild(tdStatus);
            tr.appendChild(tdDate);
            tr.appendChild(tdActions);

            fragment.appendChild(tr);
        });

        adminsTbody.appendChild(fragment);
    }

    if (btnOpenAddAdmin) {
        btnOpenAddAdmin.addEventListener('click', () => {
            addAdminForm.reset();
            openModal(addAdminModal);
        });
    }

    if (addAdminForm) {
        addAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = addAdminEmail.value.trim();
            const fullName = addAdminFullname.value.trim();
            const role = addAdminRole.value;
            const password = addAdminPassword.value;

            try {
                const submitBtn = document.getElementById('btn-submit-add-admin');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating...';

                await window.IDISupabase.createAdminUser({
                    email,
                    role,
                    full_name: fullName,
                    password,
                });

                showToast(`Administrator ${email} successfully created!`, 'success');
                closeModal(addAdminModal);
                await loadAdminsList(true);
                updateOverviewWidgets();
            } catch (err) {
                showToast(err.message || 'Failed to create admin user', 'error');
            } finally {
                const submitBtn = document.getElementById('btn-submit-add-admin');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Admin';
            }
        });
    }

    function openEditAdminModal(admin) {
        editAdminId.value = admin.id;
        editAdminEmail.value = admin.email;
        editAdminFullname.value = admin.full_name || '';
        editAdminRole.value = admin.role || 'admin';
        editAdminStatus.value = admin.status || 'active';
        openModal(editAdminModal);
    }

    if (editAdminForm) {
        editAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = editAdminId.value;
            const fullName = editAdminFullname.value.trim();
            const role = editAdminRole.value;
            const status = editAdminStatus.value;

            try {
                const submitBtn = document.getElementById('btn-submit-edit-admin');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Saving...';

                await window.IDISupabase.updateAdminUser(id, {
                    full_name: fullName,
                    role,
                    status,
                });

                showToast('Admin account updated successfully!', 'success');
                closeModal(editAdminModal);
                await loadAdminsList(true);
                updateOverviewWidgets();
            } catch (err) {
                showToast(err.message || 'Failed to update admin account', 'error');
            } finally {
                const submitBtn = document.getElementById('btn-submit-edit-admin');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            }
        });
    }

    function confirmDeleteAdmin(admin) {
        confirmDelete({
            message: `Are you sure you want to remove administrator "${escapeHtml(admin.email)}"? They will immediately lose administrative access.`,
            onConfirm: async () => {
                try {
                    await window.IDISupabase.deleteAdminUser(admin.id);
                    allAdmins = allAdmins.filter((a) => a.id !== admin.id);
                    showToast('Admin user removed.', 'success');
                    renderAdminsTable();
                    updateOverviewWidgets();
                } catch (err) {
                    showToast(err.message || 'Failed to remove admin', 'error');
                }
            },
        });
    }

    // -------------------------------------------------------------------------
    // 8. FOLDER & PHOTO MODAL HANDLERS
    // -------------------------------------------------------------------------

    if (btnOpenCreateFolder) {
        btnOpenCreateFolder.addEventListener('click', () => {
            createFolderForm.reset();
            resetCoverUploader(createCoverPlaceholder, createCoverPreviewWrap, createCoverPreviewImg);
            openModal(createFolderModal);
        });
    }

    setupCoverUploader(
        createCoverDropzone,
        createFolderCoverFile,
        createCoverPlaceholder,
        createCoverPreviewWrap,
        createCoverPreviewImg,
        btnChangeCreateCover,
        btnRemoveCreateCover
    );

    if (createFolderForm) {
        createFolderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('create-folder-name').value.trim();
            const desc = document.getElementById('create-folder-desc').value.trim();
            const file = createFolderCoverFile.files[0];

            const submitBtn = document.getElementById('btn-submit-create-folder');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';

            try {
                let coverUrl = null;
                if (file) {
                    const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
                    if (!isWebp) {
                        showToast('Cover image must be in WEBP (.webp) format only.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Create Album';
                        return;
                    }
                    const uploadRes = await window.IDISupabase.uploadImageFile(file, name);
                    coverUrl = uploadRes.publicUrl;
                }

                const newFolder = await window.IDISupabase.createFolder({
                    name,
                    description: desc,
                    cover_image_url: coverUrl,
                });

                allFolders.unshift(newFolder);
                showToast(`Album "${name}" created successfully!`, 'success');
                closeModal(createFolderModal);
                renderFoldersGrid();
                updateOverviewWidgets();
            } catch (err) {
                showToast(err.message || 'Failed to create folder', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Album';
            }
        });
    }

    function openEditFolderModal(folder) {
        document.getElementById('edit-folder-id').value = folder.id;
        document.getElementById('edit-folder-name').value = folder.name;
        document.getElementById('edit-folder-desc').value = folder.description || '';
        editFolderCoverCurrent.value = folder.cover_image_url || '';

        if (folder.cover_image_url) {
            editCoverPlaceholder.style.display = 'none';
            editCoverPreviewWrap.style.display = 'block';
            editCoverPreviewImg.src = folder.cover_image_url;
        } else {
            resetCoverUploader(editCoverPlaceholder, editCoverPreviewWrap, editCoverPreviewImg);
        }

        openModal(editFolderModal);
    }

    setupCoverUploader(
        editCoverDropzone,
        editFolderCoverFile,
        editCoverPlaceholder,
        editCoverPreviewWrap,
        editCoverPreviewImg,
        btnChangeEditCover,
        btnRemoveEditCover
    );

    if (btnEditCurrentFolder) {
        btnEditCurrentFolder.addEventListener('click', () => {
            if (currentFolder) openEditFolderModal(currentFolder);
        });
    }

    if (editFolderForm) {
        editFolderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-folder-id').value;
            const name = document.getElementById('edit-folder-name').value.trim();
            const desc = document.getElementById('edit-folder-desc').value.trim();
            const file = editFolderCoverFile.files[0];
            let coverUrl = editFolderCoverCurrent.value || null;

            const submitBtn = document.getElementById('btn-submit-edit-folder');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                if (file) {
                    const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
                    if (!isWebp) {
                        showToast('Cover image must be in WEBP (.webp) format only.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Save Changes';
                        return;
                    }
                    const uploadRes = await window.IDISupabase.uploadImageFile(file, name);
                    coverUrl = uploadRes.publicUrl;
                }

                const updated = await window.IDISupabase.updateFolder(id, {
                    name,
                    description: desc,
                    cover_image_url: coverUrl,
                });

                const idx = allFolders.findIndex((f) => f.id === id);
                if (idx > -1) allFolders[idx] = { ...allFolders[idx], ...updated };

                if (currentFolder && currentFolder.id === id) {
                    currentFolder = { ...currentFolder, ...updated };
                    detailFolderTitle.textContent = updated.name;
                    detailFolderDesc.textContent = updated.description || 'No description provided.';
                }

                showToast('Album updated successfully!', 'success');
                closeModal(editFolderModal);
                renderFoldersGrid();
                updateOverviewWidgets();
            } catch (err) {
                showToast(err.message || 'Failed to update folder', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            }
        });
    }

    function confirmDeleteFolder(folder) {
        confirmDelete({
            message: `Are you sure you want to delete album "${escapeHtml(folder.name)}"? All photographs inside this album will be permanently deleted from Storage & Database.`,
            onConfirm: async () => {
                try {
                    await window.IDISupabase.deleteFolder(folder.id);
                    allFolders = allFolders.filter((f) => f.id !== folder.id);
                    showToast('Album deleted successfully.', 'success');
                    renderFoldersGrid();
                    updateOverviewWidgets();
                } catch (err) {
                    showToast(err.message || 'Failed to delete album', 'error');
                }
            },
        });
    }

    if (btnDeleteCurrentFolder) {
        btnDeleteCurrentFolder.addEventListener('click', () => {
            if (currentFolder) confirmDeleteFolder(currentFolder);
        });
    }

    function openEditPhotoModal(photo) {
        document.getElementById('edit-photo-id').value = photo.id;
        document.getElementById('edit-photo-title').value = photo.title || '';
        document.getElementById('edit-photo-desc').value = photo.description || '';
        openModal(editPhotoModal);
    }

    if (editPhotoForm) {
        editPhotoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-photo-id').value;
            const title = document.getElementById('edit-photo-title').value.trim();
            const desc = document.getElementById('edit-photo-desc').value.trim();

            const submitBtn = document.getElementById('btn-submit-edit-photo');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                await window.IDISupabase.updatePhoto(id, { title, description: desc });

                const p = currentFolderPhotos.find((item) => item.id === id);
                if (p) {
                    p.title = title;
                    p.description = desc;
                }

                showToast('Photo caption saved!', 'success');
                closeModal(editPhotoModal);
                renderPhotosGrid();
            } catch (err) {
                showToast(err.message || 'Failed to update photo', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save';
            }
        });
    }

    function confirmDeletePhoto(photo) {
        confirmDelete({
            message: `Are you sure you want to delete this photograph "${escapeHtml(photo.title || 'Untitled')}"?`,
            onConfirm: async () => {
                try {
                    await window.IDISupabase.deletePhoto(photo.id, photo.storage_path);
                    currentFolderPhotos = currentFolderPhotos.filter((p) => p.id !== photo.id);
                    detailPhotoCount.textContent = `${currentFolderPhotos.length} Photos`;

                    const parent = allFolders.find((f) => f.id === photo.folder_id);
                    if (parent) parent.photo_count = currentFolderPhotos.length;

                    showToast('Photo deleted.', 'success');
                    renderPhotosGrid();
                    updateOverviewWidgets();
                } catch (err) {
                    showToast(err.message || 'Failed to delete photo', 'error');
                }
            },
        });
    }

    // -------------------------------------------------------------------------
    // 9. SETTINGS & HELPERS
    // -------------------------------------------------------------------------

    if (btnAdminConfig) {
        btnAdminConfig.addEventListener('click', () => {
            const cfg = window.IDISupabase.getConfig();
            admCfgUrl.value = cfg.url || '';
            admCfgKey.value = cfg.anonKey || '';
            admCfgStatus.style.display = 'none';
            openModal(adminConfigModal);
        });
    }

    if (btnSaveAdminConfig) {
        btnSaveAdminConfig.addEventListener('click', () => {
            const url = admCfgUrl.value.trim();
            const key = admCfgKey.value.trim();
            if (!url || !key) {
                admCfgStatus.style.color = 'var(--danger)';
                admCfgStatus.textContent = 'Please enter both URL and Anon Key.';
                admCfgStatus.style.display = 'block';
                return;
            }
            window.IDISupabase.setConfig(url, key);
            admCfgStatus.style.color = 'var(--success)';
            admCfgStatus.textContent = 'Credentials saved! Reloading dashboard...';
            admCfgStatus.style.display = 'block';
            setTimeout(() => window.location.reload(), 800);
        });
    }

    function setupCoverUploader(dropzone, fileInput, placeholder, previewWrap, previewImg, changeBtn, removeBtn) {
        if (!dropzone || !fileInput) return;

        dropzone.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
                if (!isWebp) {
                    showToast('Invalid file format. Only WEBP (.webp) cover images are allowed.', 'error');
                    fileInput.value = '';
                    resetCoverUploader(placeholder, previewWrap, previewImg);
                    return;
                }
                previewImg.src = URL.createObjectURL(file);
                placeholder.style.display = 'none';
                previewWrap.style.display = 'block';
            }
        });

        if (changeBtn) {
            changeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.value = '';
                resetCoverUploader(placeholder, previewWrap, previewImg);
            });
        }
    }

    function resetCoverUploader(placeholder, previewWrap, previewImg) {
        if (placeholder) placeholder.style.display = 'flex';
        if (previewWrap) previewWrap.style.display = 'none';
        if (previewImg) previewImg.src = '';
    }

    // Modal Manager
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    document.querySelectorAll('.modal-overlay').forEach((modal) => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    function confirmDelete({ message, onConfirm }) {
        deleteModalMsg.textContent = message;
        pendingDeleteAction = onConfirm;
        openModal(deleteModal);
    }

    btnConfirmDelete.addEventListener('click', async () => {
        if (typeof pendingDeleteAction === 'function') {
            const action = pendingDeleteAction;
            pendingDeleteAction = null;
            closeModal(deleteModal);
            await action();
        } else {
            closeModal(deleteModal);
        }
    });

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatStatusLabel(status) {
        switch (status) {
            case 'new': return 'New';
            case 'in_progress': return 'In Progress';
            case 'resolved': return 'Resolved';
            case 'archived': return 'Archived';
            case 'active': return 'Active';
            case 'suspended': return 'Suspended';
            default: return status || 'Unknown';
        }
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    }

    // -------------------------------------------------------------------------
    // 10. INITIALIZATION
    // -------------------------------------------------------------------------
    await checkAuth();
    switchTab('overview');
});
