document.addEventListener('DOMContentLoaded', () => {
    let galleryData = [];
    let selectedFilter = 'All';
    const grid = document.getElementById('gallery-grid');
    const loading = document.getElementById('loading');
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
    const i18n = window.IDI_I18N;

    if (!grid || !loading) {
        return;
    }

    function getText(path, fallback) {
        if (!i18n) {
            return fallback;
        }
        return i18n.getText('pages.gallery.' + path, fallback) || fallback;
    }

    function renderFilterLabels() {
        filterButtons.forEach((button) => {
            button.textContent = getText('filters.' + button.dataset.filter, button.textContent);
        });
    }

    function updateLoadingMessage(message) {
        const spinner = loading.querySelector('i');
        loading.innerHTML = (spinner ? spinner.outerHTML + '<br><br>' : '') + message;
    }

    function createEmptyState(message) {
        const state = document.createElement('div');
        state.style.gridColumn = '1 / -1';
        state.style.textAlign = 'center';
        state.style.padding = '4rem';
        state.style.color = 'var(--text-muted)';
        state.textContent = message;
        return state;
    }

    function createGalleryItem(imageData) {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const image = document.createElement('img');
        image.loading = 'lazy';
        image.src = imageData.src;
        image.alt = imageData.caption;
        image.className = 'gallery-img';
        image.draggable = false;
        item.appendChild(image);

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';

        const caption = document.createElement('p');
        caption.className = 'gallery-caption';
        caption.textContent = getText('captions.' + imageData.id, imageData.caption);
        overlay.appendChild(caption);

        image.alt = caption.textContent;
        item.appendChild(overlay);
        return item;
    }

    function renderGallery(filter) {
        selectedFilter = filter || 'All';
        const filteredData = selectedFilter === 'All'
            ? galleryData
            : galleryData.filter((item) => item.category === selectedFilter);

        grid.replaceChildren();

        if (!filteredData.length) {
            grid.appendChild(createEmptyState(getText('empty', 'No images found in this category yet.')));
            return;
        }

        const fragment = document.createDocumentFragment();
        filteredData.forEach((imageData) => {
            fragment.appendChild(createGalleryItem(imageData));
        });
        grid.appendChild(fragment);
    }

    fetch('data/gallery.json', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Unable to load gallery data.');
            }
            return response.json();
        })
        .then((data) => {
            galleryData = Array.isArray(data) ? data : [];
            loading.style.display = 'none';
            renderGallery('All');
        })
        .catch((error) => {
            console.error('Error loading gallery:', error);
            loading.textContent = getText('loadError', 'Failed to load images.');
        });

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((item) => {
                item.classList.remove('active');
            });
            button.classList.add('active');
            renderGallery(button.dataset.filter);
        });
    });

    renderFilterLabels();
    updateLoadingMessage(getText('loading', 'Unfolding Memories...'));

    document.addEventListener('idi:languagechange', () => {
        renderFilterLabels();

        if (loading.style.display !== 'none') {
            updateLoadingMessage(getText('loading', 'Unfolding Memories...'));
            return;
        }

        renderGallery(selectedFilter);
    });
});
