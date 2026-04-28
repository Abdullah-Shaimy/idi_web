document.addEventListener('DOMContentLoaded', () => {
    let alumniData = [];
    let selectedFilter = 'all';
    const grid = document.getElementById('alumni-grid');
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
        return i18n.getText('pages.alumni.' + path, fallback) || fallback;
    }

    function getBadgeLabel(batch) {
        const language = i18n ? i18n.getLanguage() : 'en';

        if (batch === 'Upcoming') {
            return getText('badge.upcoming', 'Ready to Upcoming');
        }

        if (batch === 'Exam-New') {
            return getText('badge.examNew', 'Preparing to Exam');
        }

        if (language === 'ta') {
            return batch + ' ' + getText('badge.convocation', 'பட்டமளிப்பு');
        }

        return getText('badge.convocation', 'Convocation') + ' ' + batch;
    }

    function renderFilterLabels() {
        filterButtons.forEach((button) => {
            const filterKey = button.dataset.filter === 'all' ? 'all' : button.dataset.filter;
            button.textContent = getText('filters.' + filterKey, button.textContent);
        });
    }

    function updateLoadingMessage(message) {
        const spinner = loading.querySelector('i');
        loading.innerHTML = (spinner ? spinner.outerHTML + '<br><br>' : '') + message;
    }

    function createEmptyState(message) {
        const paragraph = document.createElement('p');
        paragraph.style.gridColumn = '1 / -1';
        paragraph.style.textAlign = 'center';
        paragraph.style.padding = '3rem';
        paragraph.style.color = 'var(--text-muted)';
        paragraph.textContent = message;
        return paragraph;
    }

    function createAlumniCard(alumnus) {
        const card = document.createElement('div');
        card.className = 'alumni-card';
        card.style.animation = 'fadeIn 0.5s ease forwards';

        const orderBadge = document.createElement('div');
        orderBadge.className = 'alumni-order-badge';
        orderBadge.textContent = alumnus.id;
        card.appendChild(orderBadge);

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'alumni-img-wrapper';

        const image = document.createElement('img');
        image.loading = 'lazy';
        image.src = alumnus.image;
        image.alt = alumnus.name;
        image.className = 'alumni-img';
        image.dataset.fallbackSrc = 'assets/images/alumni_profile.webp';
        image.draggable = false;
        imageWrapper.appendChild(image);
        card.appendChild(imageWrapper);

        const badgeRow = document.createElement('div');
        badgeRow.style.marginBottom = '0.5rem';
        badgeRow.style.display = 'flex';
        badgeRow.style.alignItems = 'center';
        badgeRow.style.justifyContent = 'center';
        badgeRow.style.flexWrap = 'wrap';
        badgeRow.style.gap = '0.5rem';

        const batchBadge = document.createElement('span');
        batchBadge.className = 'alumni-batch';
        batchBadge.textContent = getBadgeLabel(alumnus.batch);
        badgeRow.appendChild(batchBadge);

        if (Number(alumnus.id) > 68) {
            const syllabusBadge = document.createElement('span');
            syllabusBadge.className = 'new-syllabus-badge';
            syllabusBadge.textContent = getText('badge.newSyllabus', 'New Syllabus');
            badgeRow.appendChild(syllabusBadge);
        }

        card.appendChild(badgeRow);

        const name = document.createElement('h3');
        name.className = 'alumni-name';
        name.textContent = alumnus.name;
        card.appendChild(name);

        const status = document.createElement('p');
        status.className = 'alumni-status';
        status.textContent = i18n ? i18n.formatOrigin(alumnus.currentStatus) : alumnus.currentStatus;
        card.appendChild(status);

        return card;
    }

    function renderAlumni(filter) {
        selectedFilter = filter || 'all';
        const filteredData = selectedFilter === 'all'
            ? alumniData
            : alumniData.filter((alumnus) => alumnus.batch === selectedFilter);

        grid.replaceChildren();

        if (!filteredData.length) {
            grid.appendChild(createEmptyState(getText('empty', 'No graduates found for this category.')));
            return;
        }

        const fragment = document.createDocumentFragment();
        filteredData.forEach((alumnus) => {
            fragment.appendChild(createAlumniCard(alumnus));
        });
        grid.appendChild(fragment);
    }

    fetch('data/alumni.json', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Unable to load alumni data.');
            }
            return response.json();
        })
        .then((data) => {
            alumniData = Array.isArray(data) ? data : [];
            loading.style.display = 'none';
            renderAlumni('all');
        })
        .catch((error) => {
            console.error('Error loading alumni:', error);
            loading.textContent = getText('loadError', 'Failed to load alumni data.');
        });

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((item) => {
                item.classList.remove('active');
            });
            button.classList.add('active');
            renderAlumni(button.dataset.filter);
        });
    });

    renderFilterLabels();
    updateLoadingMessage(getText('loading', 'Summoning the Graduates...'));

    document.addEventListener('idi:languagechange', () => {
        renderFilterLabels();

        if (loading.style.display !== 'none') {
            updateLoadingMessage(getText('loading', 'Summoning the Graduates...'));
            return;
        }

        renderAlumni(selectedFilter);
    });
});
