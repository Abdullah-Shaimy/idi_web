/* ── Page Enter: fadeUp Animation ── */
(function () {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes _fadeUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .page-enter {
            opacity: 0;
            animation: _fadeUp 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
        .scroll-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1),
                        transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .scroll-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const selectors = [
        '.hero-content',
        '.hero h1',
        '.hero p',
        '.hero-btns',
        '.section-title-wrapper',
        '.card',
        '.about-grid',
        '.contact-form',
        '.result-search-card',
        '.student-table-wrap',
        '.alumni-grid',
        '.gallery-grid',
        '.management-grid',
        '.hifz-section',
        'form',
        'table',
    ];

    document.querySelectorAll(selectors.join(', ')).forEach((el, i) => {
        if (el.closest('.hero-slider')) return;
        el.classList.add('page-enter');
        el.style.animationDelay = `${0.05 + i * 0.08}s`;
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // 2. Full-Screen Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        const mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-nav-overlay';
        mobileOverlay.innerHTML = `
            <button class="close-menu-btn">&times;</button>
            <div class="mobile-nav-links">
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="hifz.html">Hifz Program</a>
                <a href="students.html">Students</a>
                <a href="alumni.html">Alumni</a>
                <a href="gallery.html">Gallery</a>
                <a href="contact.html">Contact</a>
            </div>
        `;
        document.body.appendChild(mobileOverlay);

        const closeBtn = mobileOverlay.querySelector('.close-menu-btn');

        mobileMenuBtn.addEventListener('click', () => {
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeBtn.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Scroll Reveal — only for elements NOT already animated by page-enter
    //    (elements below the fold that scroll into view later)
    const scrollRevealTargets = document.querySelectorAll('.goal-item, .responsive-grid > div, .footer-section');
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealOnScroll.unobserve(entry.target); // fire once
            }
        });
    }, { threshold: 0.12 });

    scrollRevealTargets.forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.07}s`;
        revealOnScroll.observe(el);
    });

    // 4. Highlight Active Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // 5. Hero Background Slider
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }
});
