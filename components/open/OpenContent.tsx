'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

export default function OpenContent() {
  const { t, language } = useLanguage();
  const [stars, setStars] = useState([]);
  const [orbs, setOrbs] = useState([]);
  const [launched, setLaunched] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [launchDateStr, setLaunchDateStr] = useState('');

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const runningRef = useRef(false);

  // Generate stars & orbs safely on mount to prevent SSR hydration mismatch
  useEffect(() => {
    const starList = [];
    for (let i = 0; i < 110; i++) {
      const size = 1 + Math.random() * 1.5;
      starList.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        duration: `${2 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`,
      });
    }
    setStars(starList);

    const orbColors = ['#006d44', '#b8860b', '#daa520', '#008f5d'];
    const orbList = [];
    for (let i = 0; i < 14; i++) {
      const size = 50 + Math.random() * 130;
      orbList.push({
        id: i,
        width: `${size}px`,
        height: `${size}px`,
        bg: orbColors[i % orbColors.length],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${7 + Math.random() * 8}s`,
        delay: `${Math.random() * 4}s`,
      });
    }
    setOrbs(orbList);
  }, []);

  // Update launch date display on language change
  useEffect(() => {
    try {
      const formatted = new Date().toLocaleDateString(
        language === 'ta' ? 'ta-LK' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );
      setLaunchDateStr(formatted);
    } catch {
      setLaunchDateStr(new Date().toDateString());
    }
  }, [language]);

  // Confetti engine
  const randomColor = () => {
    const palette = ['#006d44', '#daa520', '#008f5d', '#b8860b', '#f5e6a3', '#ffffff', '#52d17c', '#ffd700'];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  const burst = (canvas, count) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 14;
      particlesRef.current.push({
        x: canvas.width * (0.2 + Math.random() * 0.6),
        y: canvas.height * (0.15 + Math.random() * 0.35),
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
  };

  const drawParticle = (ctx, p) => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);

    if (p.shape === 'rect') {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const tick = () => {
    if (!runningRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.01);

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.008;
      drawParticle(ctx, p);
    });

    if (particlesRef.current.length === 0) {
      runningRef.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    animFrameRef.current = window.requestAnimationFrame(tick);
  };

  const startConfetti = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (animFrameRef.current) {
      window.cancelAnimationFrame(animFrameRef.current);
    }
    particlesRef.current = [];
    runningRef.current = true;
    burst(canvas, 200);
    setTimeout(() => burst(canvas, 150), 600);
    setTimeout(() => burst(canvas, 120), 1300);
    tick();
  };

  const stopConfetti = () => {
    runningRef.current = false;
    if (animFrameRef.current) {
      window.cancelAnimationFrame(animFrameRef.current);
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    particlesRef.current = [];
  };

  const handleLaunch = () => {
    setLaunched(true);
    setShowCelebration(true);
    startConfetti();
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    stopConfetti();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCelebration();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopConfetti();
    };
  }, []);

  return (
    <div className="open-page-container">
      {/* Background gradients */}
      <div className="bg"></div>

      {/* Stars */}
      <div className="stars" id="stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: s.left,
              top: s.top,
              width: s.width,
              height: s.height,
              ['--d' as any]: s.duration,
              ['--dl' as any]: s.delay,
            }}
          />
        ))}
      </div>

      {/* Orbs */}
      <div className="orbs" id="orbs">
        {orbs.map((o) => (
          <div
            key={o.id}
            className="orb"
            style={{
              width: o.width,
              height: o.height,
              background: o.bg,
              left: o.left,
              top: o.top,
              ['--d' as any]: o.duration,
              ['--dl' as any]: o.delay,
            }}
          />
        ))}
      </div>

      {/* Single viewport stage */}
      <main className="stage">
        <p className="bismillah">
          {t('pages.open.page.bismillah', 'Bismillahir • Rahmanir Rahim')}
        </p>

        <div className="logo-ring">
          <Image
            src="/assets/images/idi_logo.webp"
            alt="IDI Logo"
            width={130}
            height={130}
            priority
          />
        </div>

        <h1 className="inst-name">
          {t('pages.open.page.name', "Institute of Da'wa Islamiyya")}
        </h1>
        <p className="tagline">
          {t('pages.open.page.tagline', 'Nurturing Hearts with the Light of Quran')}
        </p>

        <div className="divider"></div>

        <p
          className="welcome"
          dangerouslySetInnerHTML={{
            __html: t(
              'pages.open.page.welcome',
              'We are <strong>honored and delighted</strong> to announce the official launch of our website — a digital home for our students, alumni, and all who seek <strong>knowledge, guidance, and light</strong> through the Quran.'
            ),
          }}
        />

        <div className="btn-wrap">
          <button
            className="launch-btn"
            id="launchBtn"
            onClick={handleLaunch}
            disabled={launched}
            style={
              launched
                ? {
                    background: 'linear-gradient(135deg,#b8860b,#daa520)',
                    color: '#000',
                  }
                : undefined
            }
          >
            {!launched && <span className="pulse-ring"></span>}
            <i className={launched ? 'fa-solid fa-check' : 'fa-solid fa-rocket'}></i>
            {' '}
            {launched
              ? t('pages.open.page.launched', 'Launched!')
              : t('pages.open.page.launch', 'Launch Website')}
          </button>
        </div>

        <div className="date-badge">
          <i className="fa-regular fa-calendar-check"></i>
          <span id="launchDate">{launchDateStr}</span>
        </div>
      </main>

      {/* Confetti canvas */}
      <canvas id="confetti-canvas" ref={canvasRef} />

      {/* Celebration modal */}
      <div
        id="celebration"
        className={showCelebration ? 'active' : ''}
        style={{ display: showCelebration ? 'flex' : 'none' }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if ((e.target as HTMLElement).id === 'celebration') closeCelebration();
        }}
      >
        <div className="cel-card">
          <button
            className="close-cel"
            id="closeCel"
            aria-label="Close"
            onClick={closeCelebration}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="cel-icon">🎉</div>
          <p className="cel-ribbon">
            ✦ {t('pages.open.page.ribbon', 'Official Launch')} ✦
          </p>
          <h2 className="cel-title">
            {t('pages.open.page.celebrateTitle', 'Congratulations!')}
          </h2>
          <p
            className="cel-sub"
            dangerouslySetInnerHTML={{
              __html: t(
                'pages.open.page.celebrateCopy',
                'The official website of <strong style="color:var(--gold-l)">Institute of Da\'wa Islamiyya</strong> is now live. May Allah bless this endeavour and make it a source of benefit for all.'
              ),
            }}
          />
          <div className="cel-divider"></div>
          <p className="cel-quote">
            {t(
              'pages.open.page.quote',
              '"Read in the name of your Lord who created." — Al-Quran 96:1'
            )}
          </p>
          <Link href="/" className="cel-go">
            <i className="fa-solid fa-house"></i>{' '}
            {t('pages.open.page.enter', 'Enter the Website')}
          </Link>
        </div>
      </div>
    </div>
  );
}
