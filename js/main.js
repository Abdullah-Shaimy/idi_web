document.addEventListener('DOMContentLoaded', () => {


    // 2. Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i') || mobileMenuBtn;
            if(navLinks.classList.contains('active')) {
                icon.innerHTML = '&#10005;'; // X icon
            } else {
                icon.innerHTML = '&#9776;'; // Hamburger icon
            }
        });
    }

    // 3. Highlight Active Nav Link based on URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
