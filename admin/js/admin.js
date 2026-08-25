/**
 * Institute of Da'wa Islamiyya (IDI) - Admin Dashboard Controller
 * Handles authentication checks, folder management, multi-photo uploads to Supabase Storage, and metadata editing.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // -------------------------------------------------------------------------
    // 1. STATE & VARIABLES
    // -------------------------------------------------------------------------
    let currentUser = null;
    let allFolders = [];
    let currentFolder = null;
    let currentFolderPhotos = [];
    let pendingDeleteAction = null;

    // DOM Elements - Navigation & Stats
    const userEmailEl = document.getElementById('admin-user-email');
    const userAvatarEl = document.getElementById('admin-user-avatar');
    const btnLogout = document.getElementById('btn-logout');
    const statTotalFolders = document.getElementById('stat-total-folders');
    const statTotalPhotos = document.getElementById('stat-total-photos');
    const statStorageStatus = document.getElementById('stat-storage-status');

    // DOM Elements - Views
    const foldersView = document.getElementById('admin-folders-view');
    const folderDetailView = document.getElementById('admin-folder-detail-view');
    const foldersLoading = document.getElementById('admin-folders-loading');
    const foldersGrid = document.getElementById('admin-folders-grid');
    const photosGrid = document.getElementById('admin-photos-grid');

    // DOM Elements - Folder Detail
    const btnBackToFolders = document.getElementById('btn-back-to-folders-admin');
    const detailFolderTitle = document.getElementById('detail-folder-title');
    const detailFolderDesc = document.getElementById('detail-folder-desc');
    const detailPhotoCount = document.getElementById('detail-photo-count');
    const btnEditCurrentFolder = document.getElementById('btn-edit-current-folder');
    const btnDeleteCurrentFolder = document.getElementById('btn-delete-current-folder');

    // DOM Elements - Upload
    const uploadDropzone = document.getElementById('upload-dropzone');
    const photoFileInput = document.getElementById('photo-file-input');
    const uploadProgressWrap = document.getElementById('upload-progress-wrap');
    const uploadProgressBar = document.getElementById('upload-progress-bar');
    const uploadProgressStatus = document.getElementById('upload-progress-status');
    const uploadProgressPercent = document.getElementById('upload-progress-percent');

    // Modals & Forms
    const createFolderModal = document.getElementById('create-folder-modal');
    const btnOpenCreateFolder = document.getElementById('btn-open-create-folder');
    const createFolderForm = document.getElementById('create-folder-form');
    const btnSubmitCreateFolder = document.getElementById('btn-submit-create-folder');
    const createFolderCoverFile = document.getElementById('create-folder-cover-file');
    const createCoverDropzone = document.getElementById('create-cover-dropzone');
    const createCoverPlaceholder = document.getElementById('create-cover-placeholder');
    const createCoverPreviewWrap = document.getElementById('create-cover-preview-wrap');
    const createCoverPreviewImg = document.getElementById('create-cover-preview-img');
    const btnChangeCreateCover = document.getElementById('btn-change-create-cover');
    const btnRemoveCreateCover = document.getElementById('btn-remove-create-cover');

    const editFolderModal = document.getElementById('edit-folder-modal');
    const editFolderForm = document.getElementById('edit-folder-form');
    const btnSubmitEditFolder = document.getElementById('btn-submit-edit-folder');
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

    const deleteModal = document.getElementById('delete-modal');
    const deleteModalMsg = document.getElementById('delete-modal-message');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');

    const adminConfigModal = document.getElementById('admin-config-modal');
    const btnAdminConfig = document.getElementById('btn-admin-config');
    const admCfgUrl = document.getElementById('adm-cfg-url');
    const admCfgKey = document.getElementById('adm-cfg-key');
    const admCfgStatus = document.getElementById('adm-cfg-status');
    const btnSaveAdminConfig = document.getElementById('btn-save-admin-config');

    const toastContainer = document.getElementById('toast-container');

    // -------------------------------------------------------------------------
    // 2. AUTHENTICATION & AUTHORIZATION GUARD
    // -------------------------------------------------------------------------
    async function checkAuth() {
        if (!window.IDISupabase.isConfigured()) {
            console.warn('[Admin] Running with demo / unconfigured mode.');
            userEmailEl.textContent = 'demo-admin@idi.edu';
            userAvatarEl.textContent = 'D';
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

            const isAdmin = await window.IDISupabase.checkIsAdmin(currentUser.id);
            if (!isAdmin) {
                await window.IDISupabase.signOut();
                alert('Access Denied: Your account is not registered in the admin_users table.');
                window.location.replace('login.html');
                return;
            }

            userEmailEl.textContent = currentUser.email || 'Admin';
            userAvatarEl.textContent = (currentUser.email || 'A')[0].toUpperCase();
            statStorageStatus.textContent = 'Live Connected';
            statStorageStatus.style.color = 'var(--accent-emerald)';
        } catch (error) {
            console.error('Auth verification error:', error);
            window.location.replace('login.html');
        }
    }

    btnLogout.addEventListener('click', async () => {
        await window.IDISupabase.signOut();
        window.location.replace('login.html');
    });

    // -------------------------------------------------------------------------
    // 3. FOLDERS MANAGEMENT & STATS
    // -------------------------------------------------------------------------

    async function loadDashboard() {
        foldersLoading.style.display = 'grid';
        foldersGrid.replaceChildren();

        try {
            const res = await window.IDISupabase.fetchFolders();
            foldersLoading.style.display = 'none';

            if (res.error) {
                showToast(res.error, 'error');
                return;
            }

            allFolders = res.data || [];
            updateStats();
            renderFoldersGrid();
        } catch (error) {
            foldersLoading.style.display = 'none';
            showToast(error.message || 'Failed to load folders', 'error');
        }
    }

    function updateStats() {
        statTotalFolders.textContent = allFolders.length;
        const totalPhotos = allFolders.reduce((sum, f) => sum + (f.photo_count || 0), 0);
        statTotalPhotos.textContent = totalPhotos;
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

            // Cover
            const coverWrap = document.createElement('div');
            coverWrap.className = 'admin-folder-cover';

            if (folder.cover_image_url) {
                const img = document.createElement('img');
                img.src = folder.cover_image_url;
                img.alt = folder.name;
                img.loading = 'lazy';
                coverWrap.appendChild(img);
            } else {
                coverWrap.innerHTML = '<div class="admin-folder-cover-empty"><i class="fa-solid fa-folder"></i></div>';
            }

            const badge = document.createElement('div');
            badge.className = 'admin-folder-badge';
            const count = folder.photo_count || 0;
            badge.innerHTML = `<i class="fa-regular fa-image"></i> ${count} ${count === 1 ? 'Photo' : 'Photos'}`;
            coverWrap.appendChild(badge);

            card.appendChild(coverWrap);

            // Body
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

            // Actions
            const actions = document.createElement('div');
            actions.className = 'admin-folder-actions';

            const btnOpen = document.createElement('button');
            btnOpen.className = 'btn btn-primary btn-sm';
            btnOpen.innerHTML = '<i class="fa-solid fa-images"></i> Manage Photos';
            btnOpen.addEventListener('click', () => openFolderDetail(folder));

            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn btn-secondary btn-sm';
            btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i>';
            btnEdit.title = 'Edit Folder Info';
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

    // -------------------------------------------------------------------------
    // 4. FOLDER DETAIL & PHOTOS MANAGEMENT
    // -------------------------------------------------------------------------

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
        loadDashboard();
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

            // Thumb
            const thumb = document.createElement('div');
            thumb.className = 'admin-photo-thumb';

            const img = document.createElement('img');
            img.src = photo.image_url;
            img.alt = photo.title || 'Photo';
            img.loading = 'lazy';
            thumb.appendChild(img);

            // Cover badge if this photo is current cover
            if (currentFolder && currentFolder.cover_image_url === photo.image_url) {
                const coverTag = document.createElement('span');
                coverTag.className = 'cover-badge-tag';
                coverTag.innerHTML = '<i class="fa-solid fa-star"></i> Cover';
                thumb.appendChild(coverTag);
            }

            card.appendChild(thumb);

            // Body
            const body = document.createElement('div');
            body.className = 'admin-photo-body';

            const title = document.createElement('div');
            title.className = 'admin-photo-title';
            title.textContent = photo.title || 'Untitled Photo';
            title.title = photo.title || '';
            body.appendChild(title);

            // Actions
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

    // -------------------------------------------------------------------------
    // 5. MULTI-PHOTO UPLOAD
    // -------------------------------------------------------------------------

    uploadDropzone.addEventListener('click', () => photoFileInput.click());

    uploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('dragover');
    });

    uploadDropzone.addEventListener('dragleave', () => {
        uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    });

    photoFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files);
            e.target.value = ''; // Reset input
        }
    });

    async function handleFileUpload(fileList) {
        if (!currentFolder) return;

        const files = Array.from(fileList);
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const validFiles = files.filter((f) => validTypes.includes(f.type.toLowerCase()));

        if (validFiles.length === 0) {
            showToast('Please select valid image files (JPG, PNG, WEBP).', 'error');
            return;
        }

        uploadProgressWrap.style.display = 'block';
        uploadProgressBar.style.width = '0%';

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const percent = Math.round(((i + 1) / validFiles.length) * 100);

            uploadProgressStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Uploading ${i + 1} of ${validFiles.length}: ${file.name}`;
            uploadProgressPercent.textContent = `${percent}%`;
            uploadProgressBar.style.width = `${percent}%`;

            try {
                const uploaded = await window.IDISupabase.uploadPhoto(file, currentFolder.id, currentFolder.name);
                successCount++;

                // Auto-set as cover if folder has no cover
                if (!currentFolder.cover_image_url && uploaded && uploaded.image_url) {
                    await window.IDISupabase.setFolderCoverImage(currentFolder.id, uploaded.image_url);
                    currentFolder.cover_image_url = uploaded.image_url;
                }
            } catch (err) {
                console.error(`Failed to upload ${file.name}:`, err);
                failCount++;
            }
        }

        uploadProgressStatus.innerHTML = `<i class="fa-solid fa-check" style="color:var(--success);"></i> Upload completed: ${successCount} successful${failCount > 0 ? `, ${failCount} failed` : ''}.`;

        setTimeout(() => {
            uploadProgressWrap.style.display = 'none';
        }, 3000);

        showToast(`Successfully uploaded ${successCount} photos!`, 'success');
        await loadFolderPhotos(currentFolder.id);
    }

    // -------------------------------------------------------------------------
    // 6. MODAL & CRUD ACTIONS
    // -------------------------------------------------------------------------

    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    // Attach all generic close triggers
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    // -------------------------------------------------------------------------
    // COVER IMAGE UPLOADERS & PREVIEW LOGIC
    // -------------------------------------------------------------------------
    let selectedCreateCoverFile = null;
    let selectedEditCoverFile = null;

    function resetCreateCoverUI() {
        selectedCreateCoverFile = null;
        if (createFolderCoverFile) createFolderCoverFile.value = '';
        if (createCoverPreviewImg) createCoverPreviewImg.src = '';
        if (createCoverPreviewWrap) createCoverPreviewWrap.style.display = 'none';
        if (createCoverPlaceholder) createCoverPlaceholder.style.display = 'block';
    }

    function setCreateCoverFile(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            showToast('Cover image must be smaller than 8MB.', 'error');
            return;
        }
        selectedCreateCoverFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (createCoverPreviewImg) createCoverPreviewImg.src = e.target.result;
            if (createCoverPlaceholder) createCoverPlaceholder.style.display = 'none';
            if (createCoverPreviewWrap) createCoverPreviewWrap.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    if (createCoverDropzone && createFolderCoverFile) {
        createCoverDropzone.addEventListener('click', (e) => {
            if (e.target.closest('#btn-change-create-cover') || e.target.closest('#btn-remove-create-cover')) return;
            if (!selectedCreateCoverFile) {
                createFolderCoverFile.click();
            }
        });

        createFolderCoverFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                setCreateCoverFile(e.target.files[0]);
            }
        });

        createCoverDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            createCoverDropzone.classList.add('dragover');
        });

        createCoverDropzone.addEventListener('dragleave', () => {
            createCoverDropzone.classList.remove('dragover');
        });

        createCoverDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            createCoverDropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setCreateCoverFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (btnChangeCreateCover && createFolderCoverFile) {
        btnChangeCreateCover.addEventListener('click', (e) => {
            e.stopPropagation();
            createFolderCoverFile.click();
        });
    }

    if (btnRemoveCreateCover) {
        btnRemoveCreateCover.addEventListener('click', (e) => {
            e.stopPropagation();
            resetCreateCoverUI();
        });
    }

    // Edit Cover helpers
    function resetEditCoverUI() {
        selectedEditCoverFile = null;
        if (editFolderCoverFile) editFolderCoverFile.value = '';
        if (editFolderCoverCurrent) editFolderCoverCurrent.value = '';
        if (editCoverPreviewImg) editCoverPreviewImg.src = '';
        if (editCoverPreviewWrap) editCoverPreviewWrap.style.display = 'none';
        if (editCoverPlaceholder) editCoverPlaceholder.style.display = 'block';
    }

    function setEditCoverFile(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            showToast('Cover image must be smaller than 8MB.', 'error');
            return;
        }
        selectedEditCoverFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (editCoverPreviewImg) editCoverPreviewImg.src = e.target.result;
            if (editCoverPlaceholder) editCoverPlaceholder.style.display = 'none';
            if (editCoverPreviewWrap) editCoverPreviewWrap.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    if (editCoverDropzone && editFolderCoverFile) {
        editCoverDropzone.addEventListener('click', (e) => {
            if (e.target.closest('#btn-change-edit-cover') || e.target.closest('#btn-remove-edit-cover')) return;
            if (!selectedEditCoverFile && !editFolderCoverCurrent.value) {
                editFolderCoverFile.click();
            }
        });

        editFolderCoverFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                setEditCoverFile(e.target.files[0]);
            }
        });

        editCoverDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            editCoverDropzone.classList.add('dragover');
        });

        editCoverDropzone.addEventListener('dragleave', () => {
            editCoverDropzone.classList.remove('dragover');
        });

        editCoverDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            editCoverDropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setEditCoverFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (btnChangeEditCover && editFolderCoverFile) {
        btnChangeEditCover.addEventListener('click', (e) => {
            e.stopPropagation();
            editFolderCoverFile.click();
        });
    }

    if (btnRemoveEditCover) {
        btnRemoveEditCover.addEventListener('click', (e) => {
            e.stopPropagation();
            resetEditCoverUI();
        });
    }

    // Create Folder Form Submit
    btnOpenCreateFolder.addEventListener('click', () => {
        createFolderForm.reset();
        resetCreateCoverUI();
        openModal(createFolderModal);
    });

    createFolderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('create-folder-name').value.trim();
        const desc = document.getElementById('create-folder-desc').value.trim();

        btnSubmitCreateFolder.disabled = true;
        const originalBtnHtml = btnSubmitCreateFolder.innerHTML;

        try {
            let coverUrl = null;

            // If a cover image file was chosen, upload it to Supabase Storage
            if (selectedCreateCoverFile) {
                btnSubmitCreateFolder.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading Cover...';
                const uploaded = await window.IDISupabase.uploadImageFile(selectedCreateCoverFile, name);
                coverUrl = uploaded.publicUrl;
            }

            btnSubmitCreateFolder.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Album...';
            await window.IDISupabase.createFolder({
                name,
                description: desc,
                cover_image_url: coverUrl,
            });

            closeModal(createFolderModal);
            resetCreateCoverUI();
            showToast('Album created successfully!', 'success');
            await loadDashboard();
        } catch (error) {
            showToast(error.message || 'Failed to create folder', 'error');
        } finally {
            btnSubmitCreateFolder.disabled = false;
            btnSubmitCreateFolder.innerHTML = originalBtnHtml;
        }
    });

    // Edit Folder Form Submit
    function openEditFolderModal(folder) {
        document.getElementById('edit-folder-id').value = folder.id;
        document.getElementById('edit-folder-name').value = folder.name || '';
        document.getElementById('edit-folder-desc').value = folder.description || '';

        resetEditCoverUI();
        if (folder.cover_image_url) {
            editFolderCoverCurrent.value = folder.cover_image_url;
            editCoverPreviewImg.src = folder.cover_image_url;
            editCoverPlaceholder.style.display = 'none';
            editCoverPreviewWrap.style.display = 'block';
        }

        openModal(editFolderModal);
    }

    btnEditCurrentFolder.addEventListener('click', () => {
        if (currentFolder) openEditFolderModal(currentFolder);
    });

    editFolderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const folderId = document.getElementById('edit-folder-id').value;
        const name = document.getElementById('edit-folder-name').value.trim();
        const desc = document.getElementById('edit-folder-desc').value.trim();

        btnSubmitEditFolder.disabled = true;
        const originalBtnHtml = btnSubmitEditFolder.innerHTML;

        try {
            let coverUrl = editFolderCoverCurrent.value || null;

            // If a new cover image file was chosen, upload it to Supabase Storage
            if (selectedEditCoverFile) {
                btnSubmitEditFolder.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading Cover...';
                const uploaded = await window.IDISupabase.uploadImageFile(selectedEditCoverFile, name);
                coverUrl = uploaded.publicUrl;
            }

            btnSubmitEditFolder.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving Changes...';
            await window.IDISupabase.updateFolder(folderId, {
                name,
                description: desc,
                cover_image_url: coverUrl,
            });

            closeModal(editFolderModal);
            showToast('Album updated successfully!', 'success');

            if (currentFolder && currentFolder.id === folderId) {
                currentFolder.name = name;
                currentFolder.description = desc;
                currentFolder.cover_image_url = coverUrl;
                detailFolderTitle.textContent = name;
                detailFolderDesc.textContent = desc;
            }
            await loadDashboard();
        } catch (error) {
            showToast(error.message || 'Failed to update folder', 'error');
        } finally {
            btnSubmitEditFolder.disabled = false;
            btnSubmitEditFolder.innerHTML = originalBtnHtml;
        }
    });

    // Delete Folder Confirmation
    function confirmDeleteFolder(folder) {
        const count = folder.photo_count || 0;
        deleteModalMsg.innerHTML = `
            <strong>Delete Album: "${folder.name}"?</strong><br><br>
            This folder contains <strong>${count} photos</strong>.<br>
            Deleting this folder will permanently remove all its photos from Cloud Storage and the Database.<br><br>
            <em>Are you sure you want to delete this album?</em>
        `;
        pendingDeleteAction = async () => {
            try {
                await window.IDISupabase.deleteFolder(folder.id);
                closeModal(deleteModal);
                showToast(`Album "${folder.name}" deleted.`, 'success');
                if (currentFolder && currentFolder.id === folder.id) {
                    btnBackToFolders.click();
                } else {
                    await loadDashboard();
                }
            } catch (error) {
                showToast(error.message || 'Failed to delete folder', 'error');
            }
        };
        openModal(deleteModal);
    }

    btnDeleteCurrentFolder.addEventListener('click', () => {
        if (currentFolder) confirmDeleteFolder(currentFolder);
    });

    // Edit Photo Metadata
    function openEditPhotoModal(photo) {
        document.getElementById('edit-photo-id').value = photo.id;
        document.getElementById('edit-photo-title').value = photo.title || '';
        document.getElementById('edit-photo-desc').value = photo.description || '';
        openModal(editPhotoModal);
    }

    editPhotoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const photoId = document.getElementById('edit-photo-id').value;
        const title = document.getElementById('edit-photo-title').value.trim();
        const desc = document.getElementById('edit-photo-desc').value.trim();

        try {
            await window.IDISupabase.updatePhoto(photoId, { title, description: desc });
            closeModal(editPhotoModal);
            showToast('Photo caption updated!', 'success');
            if (currentFolder) await loadFolderPhotos(currentFolder.id);
        } catch (error) {
            showToast(error.message || 'Failed to update photo', 'error');
        }
    });

    // Delete Photo Confirmation
    function confirmDeletePhoto(photo) {
        deleteModalMsg.innerHTML = `
            <strong>Delete Photo: "${photo.title || 'Untitled'}"?</strong><br><br>
            This photo will be removed from Cloud Storage and the Database.<br><br>
            <em>Are you sure you want to delete this photo?</em>
        `;
        pendingDeleteAction = async () => {
            try {
                await window.IDISupabase.deletePhoto(photo.id, photo.storage_path);
                closeModal(deleteModal);
                showToast('Photo deleted successfully.', 'success');
                if (currentFolder) await loadFolderPhotos(currentFolder.id);
            } catch (error) {
                showToast(error.message || 'Failed to delete photo', 'error');
            }
        };
        openModal(deleteModal);
    }

    btnConfirmDelete.addEventListener('click', async () => {
        if (typeof pendingDeleteAction === 'function') {
            await pendingDeleteAction();
            pendingDeleteAction = null;
        }
    });

    // -------------------------------------------------------------------------
    // 7. SUPABASE SETTINGS DIALOG
    // -------------------------------------------------------------------------
    btnAdminConfig.addEventListener('click', () => {
        const config = window.IDISupabase.getConfig();
        admCfgUrl.value = config.url && !config.url.includes('your-project-id') ? config.url : '';
        admCfgKey.value = config.anonKey && !config.anonKey.includes('your-anon-public-key') ? config.anonKey : '';
        admCfgStatus.style.display = 'none';
        openModal(adminConfigModal);
    });

    btnSaveAdminConfig.addEventListener('click', () => {
        const url = admCfgUrl.value.trim();
        const key = admCfgKey.value.trim();

        if (!url || !key) {
            admCfgStatus.style.color = 'var(--danger)';
            admCfgStatus.textContent = 'Both Project URL and Anon Key are required.';
            admCfgStatus.style.display = 'block';
            return;
        }

        window.IDISupabase.setConfig(url, key);
        admCfgStatus.style.color = 'var(--success)';
        admCfgStatus.textContent = 'Configuration saved! Reloading dashboard...';
        admCfgStatus.style.display = 'block';

        setTimeout(() => {
            closeModal(adminConfigModal);
            window.location.reload();
        }, 800);
    });

    // -------------------------------------------------------------------------
    // 8. TOAST SYSTEM
    // -------------------------------------------------------------------------
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // -------------------------------------------------------------------------
    // 9. INITIALIZE
    // -------------------------------------------------------------------------
    await checkAuth();
    await loadDashboard();
});
