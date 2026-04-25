document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.getElementById('stars');
    const orbsContainer = document.getElementById('orbs');
    const launchDate = document.getElementById('launchDate');
    const launchButton = document.getElementById('launchBtn');
    const celebration = document.getElementById('celebration');
    const closeCelebrationButton = document.getElementById('closeCel');
    const confettiCanvas = document.getElementById('confetti-canvas');

    if (!starsContainer || !orbsContainer || !launchDate || !launchButton || !celebration || !closeCelebrationButton || !confettiCanvas) {
        return;
    }

    for (let index = 0; index < 110; index += 1) {
        const star = document.createElement('div');
        const size = 1 + Math.random() * 1.5;

        star.className = 'star';
        star.style.cssText = [
            'left:' + (Math.random() * 100) + '%',
            'top:' + (Math.random() * 100) + '%',
            'width:' + size + 'px',
            'height:' + size + 'px',
            '--d:' + (2 + Math.random() * 4) + 's',
            '--dl:' + (Math.random() * 5) + 's',
        ].join(';');

        starsContainer.appendChild(star);
    }

    const orbColors = ['#006d44', '#b8860b', '#daa520', '#008f5d'];
    for (let index = 0; index < 14; index += 1) {
        const orb = document.createElement('div');
        const size = 50 + Math.random() * 130;

        orb.className = 'orb';
        orb.style.cssText = [
            'width:' + size + 'px',
            'height:' + size + 'px',
            'background:' + orbColors[index % orbColors.length],
            'left:' + (Math.random() * 100) + '%',
            'top:' + (Math.random() * 100) + '%',
            '--d:' + (7 + Math.random() * 8) + 's',
            '--dl:' + (Math.random() * 4) + 's',
        ].join(';');

        orbsContainer.appendChild(orb);
    }

    launchDate.textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const context = confettiCanvas.getContext('2d');
    let particles = [];
    let animationId = 0;
    let running = false;

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    function randomColor() {
        const palette = ['#006d44', '#daa520', '#008f5d', '#b8860b', '#f5e6a3', '#ffffff', '#52d17c', '#ffd700'];
        return palette[Math.floor(Math.random() * palette.length)];
    }

    function burst(count) {
        for (let index = 0; index < count; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 5 + Math.random() * 14;

            particles.push({
                x: confettiCanvas.width * (0.2 + Math.random() * 0.6),
                y: confettiCanvas.height * (0.15 + Math.random() * 0.35),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (4 + Math.random() * 5),
                w: 5 + Math.random() * 8,
                h: 7 + Math.random() * 12,
                color: randomColor(),
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 9,
                alpha: 1,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
            });
        }
    }

    function drawParticle(particle) {
        context.save();
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation * Math.PI / 180);

        if (particle.shape === 'rect') {
            context.fillRect(-particle.w / 2, -particle.h / 2, particle.w, particle.h);
        } else {
            context.beginPath();
            context.arc(0, 0, particle.w / 2, 0, Math.PI * 2);
            context.fill();
        }

        context.restore();
    }

    function tick() {
        if (!running) {
            return;
        }

        context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        particles = particles.filter((particle) => particle.alpha > 0.01);

        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3;
            particle.vx *= 0.99;
            particle.rotation += particle.rotationSpeed;
            particle.alpha -= 0.008;
            drawParticle(particle);
        });

        if (!particles.length) {
            running = false;
            context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            return;
        }

        animationId = window.requestAnimationFrame(tick);
    }

    function startConfetti() {
        window.cancelAnimationFrame(animationId);
        particles = [];
        running = true;
        burst(200);
        window.setTimeout(() => burst(150), 600);
        window.setTimeout(() => burst(120), 1300);
        tick();
    }

    function stopConfetti() {
        running = false;
        window.cancelAnimationFrame(animationId);
        context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        particles = [];
    }

    function closeCelebration() {
        celebration.classList.remove('active');
        celebration.style.display = 'none';
        stopConfetti();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    launchButton.addEventListener('click', () => {
        launchButton.disabled = true;
        launchButton.style.background = 'linear-gradient(135deg,#b8860b,#daa520)';
        launchButton.style.color = '#000';
        launchButton.replaceChildren();

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-check';
        launchButton.appendChild(icon);
        launchButton.appendChild(document.createTextNode(' Launched!'));

        celebration.classList.add('active');
        celebration.style.display = 'flex';
        startConfetti();
    });

    closeCelebrationButton.addEventListener('click', closeCelebration);

    celebration.addEventListener('click', (event) => {
        if (event.target === celebration) {
            closeCelebration();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeCelebration();
        }
    });

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) {
            return;
        }

        const href = link.getAttribute('href') || '';
        if (!href || link.target === '_blank' || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
            return;
        }

        event.preventDefault();
        document.documentElement.style.opacity = '0';
        window.setTimeout(() => {
            window.location.href = href;
        }, 350);
    });
});
