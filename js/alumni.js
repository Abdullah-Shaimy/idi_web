document.addEventListener('DOMContentLoaded', () => {
    let alumniData = [];
    const grid = document.getElementById('alumni-grid');
    const loading = document.getElementById('loading');
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

    if (!grid || !loading) {
        return;
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
        if (alumnus.batch === 'Upcoming') {
            batchBadge.textContent = 'Ready to Upcoming';
        } else if (alumnus.batch === 'Exam-New') {
            batchBadge.textContent = 'Preparing to Exam';
        } else {
            batchBadge.textContent = 'Convocation ' + alumnus.batch;
        }
        badgeRow.appendChild(batchBadge);

        if (Number(alumnus.id) > 68) {
            const syllabusBadge = document.createElement('span');
            syllabusBadge.className = 'new-syllabus-badge';
            syllabusBadge.textContent = 'New Syllabus';
            badgeRow.appendChild(syllabusBadge);
        }

        card.appendChild(badgeRow);

        const name = document.createElement('h3');
        name.className = 'alumni-name';
        name.textContent = alumnus.name;
        card.appendChild(name);

        const status = document.createElement('p');
        status.className = 'alumni-status';
        status.textContent = alumnus.currentStatus;
        card.appendChild(status);

        return card;
    }

    function renderAlumni(filter) {
        const selectedFilter = filter || 'all';
        const filteredData = selectedFilter === 'all'
            ? alumniData
            : alumniData.filter((alumnus) => alumnus.batch === selectedFilter);

        grid.replaceChildren();

        if (!filteredData.length) {
            grid.appendChild(createEmptyState('No graduates found for this category.'));
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
            loading.textContent = 'Failed to load alumni data.';
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
});
