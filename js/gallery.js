/**
 * Institute of Da'wa Islamiyya (IDI) - Dynamic Folder-Based Gallery & Lightbox
 * Communicates with Supabase (or fallback mock) and provides smooth album navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const foldersView = document.getElementById('folders-view');
    const albumView = document.getElementById('album-view');
    const foldersLoading = document.getElementById('folders-loading');
    const foldersGrid = document.getElementById('folders-grid');
    const photosLoading = document.getElementById('photos-loading');
    const photosGrid = document.getElementById('photos-grid');

    const albumBreadcrumbTitle = document.getElementById('album-breadcrumb-title');
    const albumTitleEl = document.getElementById('album-title');
    const albumDescEl = document.getElementById('album-desc');
    const btnBackToFolders = document.getElementById('btn-back-to-folders');
    const btnBreadcrumbGallery = document.getElementById('btn-breadcrumb-gallery');

    // Lightbox DOM Elements
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxAlbumName = document.getElementById('lightbox-album-name');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxStage = document.getElementById('lightbox-stage');

    // State Variables
    let foldersList = [];
    let currentFolder = null;
    let currentPhotos = [];
    let currentPhotoIndex = 0;
    const i18n = window.IDI_I18N;

    // Helper for i18n
    function getI18nText(key, fallback) {
        if (!i18n || typeof i18n.getText !== 'function') return fallback;
        return i18n.getText('pages.gallery.' + key, fallback) || fallback;
    }

    // -------------------------------------------------------------------------
    // 1. FOLDER VIEW MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * Load and render all gallery folders
     */
    async function loadFolders() {
        foldersLoading.style.display = 'grid';
        foldersGrid.style.display = 'none';
        foldersGrid.replaceChildren();

        try {
            const result = await window.IDISupabase.fetchFolders();
            foldersLoading.style.display = 'none';

            if (result.error && (!result.data || result.data.length === 0)) {
                foldersGrid.style.display = 'grid';
                foldersGrid.appendChild(createEmptyState(
                    'fa-solid fa-triangle-exclamation',
                    'Unable to Load Albums',
                    'Could not connect to the gallery database. Please try again later.'
                ));
                return;
            }

            foldersList = result.data || [];
            foldersGrid.style.display = 'grid';

            if (foldersList.length === 0) {
                foldersGrid.appendChild(createEmptyState(
                    'fa-regular fa-images',
                    'No Albums Found',
                    'No gallery albums have been published yet.'
                ));
                return;
            }

            renderFolders(foldersList);
        } catch (err) {
            console.error('Error loading folders:', err);
            foldersLoading.style.display = 'none';
            foldersGrid.style.display = 'grid';
            foldersGrid.appendChild(createEmptyState(
                'fa-solid fa-triangle-exclamation',
                'Failed to Load Gallery',
                err.message || 'An unexpected error occurred.'
            ));
        }
    }

    /**
     * Render folder cards into grid
     */
    function renderFolders(folders) {
        foldersGrid.replaceChildren();
        const fragment = document.createDocumentFragment();

        folders.forEach((folder) => {
            const card = document.createElement('div');
            card.className = 'folder-card page-enter';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open folder ${folder.name}`);

            // Cover Container
            const coverWrap = document.createElement('div');
            coverWrap.className = 'folder-cover';

            if (folder.cover_image_url) {
                const coverImg = document.createElement('img');
                coverImg.className = 'folder-cover-img';
                coverImg.src = folder.cover_image_url;
                coverImg.alt = folder.name;
                coverImg.loading = 'lazy';
                coverImg.draggable = false;
                coverWrap.appendChild(coverImg);

                const overlay = document.createElement('div');
                overlay.className = 'folder-cover-overlay';
                coverWrap.appendChild(overlay);
            } else {
                const fallback = document.createElement('div');
                fallback.className = 'folder-fallback-icon';
                fallback.innerHTML = `
                    <i class="fa-solid fa-folder"></i>
                    <span style="font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; font-weight: 700;">IDI Album</span>
                `;
                coverWrap.appendChild(fallback);
            }

            // Photo Count Badge
            const badge = document.createElement('div');
            badge.className = 'folder-badge-count';
            const count = folder.photo_count || 0;
            badge.innerHTML = `<i class="fa-regular fa-image"></i> ${count} ${count === 1 ? 'Photo' : 'Photos'}`;
            coverWrap.appendChild(badge);

            card.appendChild(coverWrap);

            // Card Body
            const body = document.createElement('div');
            body.className = 'folder-card-body';

            const titleRow = document.createElement('div');
            titleRow.className = 'folder-title-row';

            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-folder-open folder-icon-inline';
            titleRow.appendChild(icon);

            const title = document.createElement('h3');
            title.className = 'folder-card-title';
            title.textContent = folder.name;
            titleRow.appendChild(title);

            body.appendChild(titleRow);

            if (folder.description) {
                const desc = document.createElement('p');
                desc.className = 'folder-card-desc';
                desc.textContent = folder.description;
                body.appendChild(desc);
            } else {
                const descPlaceholder = document.createElement('p');
                descPlaceholder.className = 'folder-card-desc';
                descPlaceholder.style.fontStyle = 'italic';
                descPlaceholder.textContent = 'Explore photos from this album.';
                body.appendChild(descPlaceholder);
            }

            // Card Footer
            const footer = document.createElement('div');
            footer.className = 'folder-card-footer';
            footer.innerHTML = `
                <span style="color: var(--text-muted); font-size: 0.8rem;"><i class="fa-regular fa-calendar"></i> ${formatDate(folder.created_at)}</span>
                <span>View Album <i class="fa-solid fa-arrow-right"></i></span>
            `;
            body.appendChild(footer);

            card.appendChild(body);

            // Click and Enter listener
            const openAction = () => openFolder(folder);
            card.addEventListener('click', openAction);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openAction();
                }
            });

            fragment.appendChild(card);
        });

        foldersGrid.appendChild(fragment);
    }

    // -------------------------------------------------------------------------
    // 2. ALBUM PHOTOS VIEW MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * Open a folder and switch to photo grid view
     */
    async function openFolder(folder) {
        currentFolder = folder;
        window.location.hash = `album-${folder.id}`;

        // Switch visible containers
        foldersView.style.display = 'none';
        albumView.style.display = 'block';

        // Update header details
        albumBreadcrumbTitle.textContent = folder.name;
        albumTitleEl.textContent = folder.name;
        albumDescEl.textContent = folder.description || 'Collection of photographs and moments.';

        // Load Photos
        photosLoading.style.display = 'grid';
        photosGrid.style.display = 'none';
        photosGrid.replaceChildren();

        window.scrollTo({ top: albumView.offsetTop - 120, behavior: 'smooth' });

        try {
            const result = await window.IDISupabase.fetchPhotosByFolder(folder.id);
            photosLoading.style.display = 'none';
            photosGrid.style.display = 'grid';

            if (result.error) {
                photosGrid.appendChild(createEmptyState(
                    'fa-solid fa-triangle-exclamation',
                    'Unable to Load Photos',
                    result.error
                ));
                return;
            }

            currentPhotos = result.data || [];

            if (currentPhotos.length === 0) {
                photosGrid.appendChild(createEmptyState(
                    'fa-regular fa-image',
                    'No Photos Yet',
                    'No photos have been uploaded to this album yet.'
                ));
                return;
            }

            renderPhotos(currentPhotos);
        } catch (err) {
            console.error('Error fetching photos:', err);
            photosLoading.style.display = 'none';
            photosGrid.style.display = 'grid';
            photosGrid.appendChild(createEmptyState(
                'fa-solid fa-triangle-exclamation',
                'Error Loading Album',
                err.message || 'An unexpected error occurred.'
            ));
        }
    }

    /**
     * Render photo cards into the photo grid
     */
    function renderPhotos(photos) {
        photosGrid.replaceChildren();
        const fragment = document.createDocumentFragment();

        photos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'photo-card page-enter';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Photo ${index + 1}`);

            const img = document.createElement('img');
            img.className = 'photo-card-img';
            img.src = photo.image_url;
            img.alt = currentFolder ? `${currentFolder.name} - Photo ${index + 1}` : `Photo ${index + 1}`;
            img.loading = 'lazy';
            img.draggable = false;
            card.appendChild(img);

            const overlay = document.createElement('div');
            overlay.className = 'photo-card-overlay';

            const zoomIcon = document.createElement('div');
            zoomIcon.className = 'photo-zoom-icon';
            zoomIcon.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i>';
            overlay.appendChild(zoomIcon);

            if (photo.description) {
                const desc = document.createElement('div');
                desc.className = 'photo-card-desc';
                desc.textContent = photo.description;
                overlay.appendChild(desc);
            }

            card.appendChild(overlay);

            // Lightbox trigger
            const openLightboxAction = () => openLightbox(index);
            card.addEventListener('click', openLightboxAction);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightboxAction();
                }
            });

            fragment.appendChild(card);
        });

        photosGrid.appendChild(fragment);
    }

    /**
     * Switch back to the main Folders view
     */
    function showFoldersView() {
        currentFolder = null;
        currentPhotos = [];
        closeLightbox();

        // Clear hash without reload
        if (window.location.hash.startsWith('#album-')) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }

        albumView.style.display = 'none';
        foldersView.style.display = 'block';
        window.scrollTo({ top: foldersView.offsetTop - 120, behavior: 'smooth' });
    }

    // -------------------------------------------------------------------------
    // 3. MODERN INTERACTIVE LIGHTBOX
    // -------------------------------------------------------------------------

    /**
     * Open Lightbox at specific photo index
     */
    function openLightbox(index) {
        if (!currentPhotos || currentPhotos.length === 0) return;
        currentPhotoIndex = (index >= 0 && index < currentPhotos.length) ? index : 0;
        updateLightboxContent();

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close Lightbox
     */
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /**
     * Navigate Lightbox photo
     */
    function changePhoto(direction) {
        if (!currentPhotos || currentPhotos.length === 0) return;

        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = direction > 0 ? 'scale(0.95) translateX(20px)' : 'scale(0.95) translateX(-20px)';

        setTimeout(() => {
            currentPhotoIndex = (currentPhotoIndex + direction + currentPhotos.length) % currentPhotos.length;
            updateLightboxContent();
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1) translateX(0)';
        }, 150);
    }

    /**
     * Update active Lightbox elements
     */
    function updateLightboxContent() {
        const photo = currentPhotos[currentPhotoIndex];
        if (!photo) return;

        lightboxAlbumName.textContent = currentFolder ? currentFolder.name : 'Album';
        lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${currentPhotos.length}`;
        lightboxImg.src = photo.image_url;
        lightboxImg.alt = currentFolder ? `${currentFolder.name} - Photo ${currentPhotoIndex + 1}` : `Photo ${currentPhotoIndex + 1}`;

        // Only display description if provided, otherwise hide caption bar cleanly
        if (photo.description) {
            lightboxTitle.textContent = photo.description;
            lightboxTitle.style.display = 'block';
            lightboxDesc.style.display = 'none';
        } else {
            lightboxTitle.style.display = 'none';
            lightboxDesc.style.display = 'none';
        }

        // Hide prev/next if only 1 photo
        if (currentPhotos.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }

    // -------------------------------------------------------------------------
    // 4. EVENT LISTENERS & NAVIGATION
    // -------------------------------------------------------------------------

    // Back to folders button listeners
    btnBackToFolders.addEventListener('click', showFoldersView);
    btnBreadcrumbGallery.addEventListener('click', showFoldersView);

    // Lightbox Buttons
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        changePhoto(-1);
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        changePhoto(1);
    });

    // Close when clicking lightbox background outside image
    lightboxStage.addEventListener('click', (e) => {
        if (e.target === lightboxStage || e.target.classList.contains('lightbox-img-wrap')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changePhoto(-1);
        } else if (e.key === 'ArrowRight') {
            changePhoto(1);
        }
    });

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                changePhoto(-1); // Swipe right -> prev
            } else {
                changePhoto(1);  // Swipe left -> next
            }
        }
    }, { passive: true });

    // Handle Browser History & Direct URL Hash
    async function handleHashChange() {
        const hash = window.location.hash;
        if (hash.startsWith('#album-')) {
            const folderId = hash.replace('#album-', '');
            // Find in foldersList or fetch
            let folder = foldersList.find((f) => f.id === folderId);
            if (!folder) {
                const res = await window.IDISupabase.fetchFolderById(folderId);
                if (res.data) folder = res.data;
            }
            if (folder) {
                openFolder(folder);
            } else {
                showFoldersView();
            }
        } else {
            showFoldersView();
        }
    }

    window.addEventListener('popstate', handleHashChange);

    // -------------------------------------------------------------------------
    // 5. UTILITY FUNCTIONS
    // -------------------------------------------------------------------------

    function createEmptyState(iconClass, title, message) {
        const wrap = document.createElement('div');
        wrap.className = 'gallery-empty-state';
        wrap.innerHTML = `
            <div class="gallery-empty-icon">
                <i class="${iconClass}"></i>
            </div>
            <h3>${title}</h3>
            <p>${message}</p>
        `;
        return wrap;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return '';
        }
    }

    // -------------------------------------------------------------------------
    // 6. INITIALIZATION
    // -------------------------------------------------------------------------
    (async function init() {
        await loadFolders();

        // Check if direct album was linked
        if (window.location.hash.startsWith('#album-')) {
            await handleHashChange();
        }
    })();
});
