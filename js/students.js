document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    const timelines = Array.from(document.querySelectorAll('.timeline-wrapper'));

    if (!tabButtons.length || !timelines.length) {
        return;
    }

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedTab = button.dataset.tab;

            tabButtons.forEach((item) => {
                item.classList.toggle('active', item === button);
            });

            timelines.forEach((timeline) => {
                timeline.classList.toggle('active', timeline.id === selectedTab);
            });
        });
    });
});
